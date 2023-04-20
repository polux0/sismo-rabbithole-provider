import axios, { Axios, AxiosResponse } from 'axios';
import encodeQuestId from './helper';
import getConfigByNetwork from './config/config';
import fs from 'fs';

// strategy:
// move everything necessary to config ( enviornment variables ) ✓
// move logic from IIFE to function ✓
// research factory in order to be able to choose right variables for right provider ( mainnet, optimism, polygon ) ✓
// collect starting blocks for polygon & ethereum mainnet ✓
// move get latest block to `helper.ts`

// optimism
const optimismQuestId = '423399b4-a891-4d60-b4b2-afdc7a9be85b';
// polygon
const polygonQuestId = '21d47899-5ea3-4046-b19c-138eaff9e271';
// ethereum
const ethereumQuestId = '216b83da-6053-4ef5-aeaf-850d337d0b68';

const {
  URL,
  API_KEY,
  MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY,
  MAXIMUM_NUMBER_OF_THREADS,
  MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH,
  STARTING_BLOCK,
  ZERO_ADDRESS,
} = getConfigByNetwork('ethereum');

async function queryQuestTokenHolders(
  fromBlock: number,
  toBlock: number,
  questId: string,
  offset?: number,
): Promise<string[]> {
  try {
    const { data: response }: AxiosResponse = await axios({
      url: `${URL}/api?module=logs&action=getLogs&address=0x52629961f71c1c2564c5aa22372cb1b9fa9eba3e&topic=0xa9e09a39b54248cb5161a8bad4e544f88b8aa2da99e7c425846bece6703cc1fc&data=${encodeQuestId(
        questId,
      )}&fromBlock=${fromBlock}&toBlock=${toBlock}&page=1&offset=${
        offset ?? MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH
      }&apikey=${API_KEY}`,
      method: 'get',
    });
    let holders: string[] | undefined;
    if (response.result) {
      holders = response.result.map((transaction: any) => {
        return transaction.topics[1]
          ? transaction.topics[1].replace('000000000000000000000000', '')
          : ZERO_ADDRESS;
      });
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
      url: `${URL}/api?module=proxy&action=eth_blockNumber&apikey=${API_KEY}`,
      method: 'get',
    });
    return Number(BigInt(response.result).toString());
  } catch (error) {
    console.log('`getLatestBlock` threw an error: ', error);
    return 0;
  }
}
async function queryQuestTokenHoldersWithThreads(
  questId: string,
): Promise<string[]> {
  try {
    const fromBlock: number = STARTING_BLOCK;
    const toBlock: number = (await getLatestBlock()) ?? 89495952;
    const blockRange: number = toBlock - fromBlock;
    const maximumIterationIncrement: number =
      blockRange / MAXIMUM_NUMBER_OF_THREADS;
    let startBlock: number = fromBlock;
    let endBlock: number = startBlock + maximumIterationIncrement;
    const promises: Promise<string[]>[] = [];

    do {
      for (let index = 0; index < MAXIMUM_NUMBER_OF_THREADS; index++) {
        promises.push(queryQuestTokenHolders(startBlock, endBlock, questId));
        startBlock = endBlock;
        endBlock += Number(maximumIterationIncrement);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY),
      );
    } while (endBlock < toBlock);

    const addresses = (await Promise.all(promises)).flat();
    return addresses;
  } catch (error) {
    console.log('`queryQuestTokenHoldersWithThreads` threw an error: ', error);
    return [];
  }
}
(async () => {
  const aggregatedHolders = await queryQuestTokenHoldersWithThreads(
    optimismQuestId,
  );
  const aggregatedHoldersSanitized = aggregatedHolders.filter(
    (address) => address.length <= 42 && address !== ZERO_ADDRESS,
  );
  try {
    fs.writeFileSync(
      '/home/equinox/Desktop/development/rabbithole-provider/src/tests/test.txt',
      JSON.stringify(aggregatedHoldersSanitized),
    );
    // file written successfully
  } catch (err) {
    console.error(err);
  }
  // console.log('aggregateHolders: ', aggregateHolders);
})();
