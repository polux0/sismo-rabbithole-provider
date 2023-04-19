import axios, { Axios, AxiosResponse } from 'axios';
import encodeQuestId from './encoder';
import config from './config/config';

// strategy:
// move everything necessary to config ( enviornment variables )
// move logic from IIFE to function
// research factory in order to be able to choose right variables for right provider ( mainnet, optimism, polygon )
// collect starting blocks for polygon & ethereum mainnet

// startingBlock
// api url
// api key
// minimum timeout
// maximum number of threads
// maximum number of blocks to fetch

const testQuestId = '423399b4-a891-4d60-b4b2-afdc7a9be85b';

async function getAllQuestHolders(
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
        offset ?? config.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH
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
    console.log('`getAllQuestHolders` threw an error: ', error);
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
  try {
    const blockRange: number = toBlock - fromBlock;
    const maximumIterationIncrement: number =
      blockRange / config.MAXIMUM_NUMBER_OF_THREADS;
    let startBlock: number = fromBlock;
    let endBlock: number = startBlock + maximumIterationIncrement;
    const promises: Promise<string[]>[] = [];
    for (let index = 0; index < config.MAXIMUM_NUMBER_OF_THREADS; index++) {
      promises.push(getAllQuestHolders(startBlock, endBlock, questId));
      startBlock = endBlock;
      endBlock += Number(maximumIterationIncrement);
    }
    const addresses = (await Promise.all(promises)).flat();
    return addresses;
  } catch (error) {
    console.log('`getAllQuestHoldersWithThreads` threw an error: ', error);
    return [];
  }
}
(async () => {
  const resultAggregate: (string[] | any[])[] = [];
  const optimismLatestBlock: number = (await getLatestBlock()) ?? 89495952;
  let startingBlock = 89391505;
  let endingBlock: number;
  do {
    await new Promise((resolve) =>
      setTimeout(resolve, config.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY),
    );
    endingBlock =
      startingBlock +
      config.MAXIMUM_NUMBER_OF_THREADS *
        config.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
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
