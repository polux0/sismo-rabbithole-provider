import axios, { Axios, AxiosResponse } from 'axios';
import encodeQuestId from './encoder';

const ethereumMainnetRabbitHoleStartingBlock = 1000;
const polygonRabbitHoleStartingBlock = 2000;
const optimismRabbitHoleStartingBlock = 74000009;

const etherescanApiKey = '';
const optimisticEtherescanApiKey = '';
const polygonScanApiKey = '';

const testQuestId = '423399b4-a891-4d60-b4b2-afdc7a9be85b';

const MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY = 1001;
const MAXIMUM_NUMBER_OF_THREADS = 4;
const MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH = 10000;

async function getAllQuestHolders(
  //add network here ( as enum: Optimism, Etherscan, Polygon)
  fromBlock: number,
  toBlock: number,
  questId: string,
  offset?: number,
): Promise<string[]> {
  try {
    const { data: response }: AxiosResponse = await axios({
      url: `https://api-optimistic.etherscan.io/api?module=logs&action=getLogs&address=0x52629961f71c1c2564c5aa22372cb1b9fa9eba3e&topic=0xa9e09a39b54248cb5161a8bad4e544f88b8aa2da99e7c425846bece6703cc1fc&data=${encodeQuestId(
        questId,
      )}&fromBlock=${fromBlock}&toBlock=${toBlock}&page=1&offset=${
        offset ?? MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH
      }&apikey=56ERH5SEYMKNYB5P8VPCF6G39UIJQAW9V4`,
      method: 'get',
    });
    let holders: string[] | undefined;
    if (response.result) {
      holders = response.result.map((transaction: any) =>
        transaction.topics[1].replace('000000000000000000000000', ''),
      );
    }
    return holders ?? [];
  } catch (error) {
    console.log('`getAccountsFromAPI` threw an error: ', error);
    return [];
  }
}
async function getLatestBlock(): Promise<number | undefined> {
  try {
    // failed transactions are excluded
    const { data: response }: AxiosResponse = await axios({
      url: `https://api-optimistic.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=56ERH5SEYMKNYB5P8VPCF6G39UIJQAW9V4`,
      method: 'get',
    });
    return Number(BigInt(response.result).toString());
  } catch (error) {
    console.log('`getLatestBlock` threw an error: ', error);
    return 0;
  }
}
async function getAllQuestHoldersWithThreads(
  fromBlock: number,
  toBlock: number,
  questId: string,
): Promise<string[]> {
  const blockRange: number = toBlock - fromBlock;
  const maximumIterationIncrement: number =
    blockRange / MAXIMUM_NUMBER_OF_THREADS;
  let startBlock: number = fromBlock;
  let endBlock: number = startBlock + maximumIterationIncrement;
  const promises: Promise<string[]>[] = [];
  for (let index = 0; index < MAXIMUM_NUMBER_OF_THREADS; index++) {
    promises.push(getAllQuestHolders(startBlock, endBlock, questId));
    startBlock = endBlock;
    endBlock += Number(maximumIterationIncrement);
  }
  const addresses = (await Promise.all(promises)).flat();
  return addresses;
}
(async () => {
  const resultAggregate: (string[] | any[])[] = [];
  const optimismLatestBlock: number = (await getLatestBlock()) ?? 89495952;
  let startingBlock = 89391505;
  let endingBlock: number;
  do {
    await new Promise((resolve) =>
      setTimeout(resolve, MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY),
    );
    endingBlock =
      startingBlock +
      MAXIMUM_NUMBER_OF_THREADS * MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
    const result: string[] | undefined = await getAllQuestHoldersWithThreads(
      startingBlock,
      endingBlock,
      testQuestId,
    );
    startingBlock = endingBlock;
    resultAggregate.push(result);
  } while (endingBlock < optimismLatestBlock);
  console.log('resultAggregate: ', resultAggregate.flat());
  return resultAggregate.flat();
})();
