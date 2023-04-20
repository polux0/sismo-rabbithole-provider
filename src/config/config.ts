import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK: number | undefined;
  POLYGON_RABBIT_HOLE_STARTING_BLOCK: number | undefined;
  OPTIMISM_RABBIT_HOLE_STARTING_BLOCK: number | undefined;
  ETHERSCAN_URL: string | undefined;
  OPTIMISTIC_ETHERSCAN_URL: string | undefined;
  POLYGONSCAN_URL: string | undefined;
  ETHERSCAN_API_KEY: string | undefined;
  OPTIMISTIC_ETHERSCAN_API_KEY: string | undefined;
  POLYGONSCAN_API_KEY: string | undefined;
  MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY: number | undefined;
  MAXIMUM_NUMBER_OF_THREADS: number | undefined;
  MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH: number | undefined;
  ZERO_ADDRESS: string | undefined;
}

interface Config {
  ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK: number;
  POLYGON_RABBIT_HOLE_STARTING_BLOCK: number;
  OPTIMISM_RABBIT_HOLE_STARTING_BLOCK: number;
  ETHERSCAN_URL: string | undefined;
  OPTIMISTIC_ETHERSCAN_URL: string | undefined;
  POLYGONSCAN_URL: string | undefined;
  ETHERSCAN_API_KEY: string;
  OPTIMISTIC_ETHERSCAN_API_KEY: string;
  POLYGONSCAN_API_KEY: string;
  MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY: number;
  MAXIMUM_NUMBER_OF_THREADS: number;
  MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH: number;
  ZERO_ADDRESS: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK: process.env
      .ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK
      ? Number(process.env.ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK)
      : undefined,
    POLYGON_RABBIT_HOLE_STARTING_BLOCK: process.env
      .POLYGON_RABBIT_HOLE_STARTING_BLOCK
      ? Number(process.env.POLYGON_RABBIT_HOLE_STARTING_BLOCK)
      : undefined,
    OPTIMISM_RABBIT_HOLE_STARTING_BLOCK: process.env
      .OPTIMISM_RABBIT_HOLE_STARTING_BLOCK
      ? Number(process.env.OPTIMISM_RABBIT_HOLE_STARTING_BLOCK)
      : undefined,
    ETHERSCAN_URL: process.env.ETHERSCAN_URL
      ? process.env.ETHERSCAN_URL
      : undefined,
    OPTIMISTIC_ETHERSCAN_URL: process.env.OPTIMISTIC_ETHERSCAN_URL
      ? process.env.OPTIMISTIC_ETHERSCAN_URL
      : undefined,
    POLYGONSCAN_URL: process.env.POLYGONSCAN_URL
      ? process.env.POLYGONSCAN_URL
      : undefined,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY
      ? process.env.ETHERSCAN_API_KEY
      : undefined,
    OPTIMISTIC_ETHERSCAN_API_KEY: process.env.OPTIMISTIC_ETHERSCAN_API_KEY
      ? process.env.OPTIMISTIC_ETHERSCAN_API_KEY
      : undefined,
    POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY
      ? process.env.POLYGONSCAN_API_KEY
      : undefined,
    MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY: process.env
      .MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY
      ? Number(process.env.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY)
      : undefined,
    MAXIMUM_NUMBER_OF_THREADS: process.env.MAXIMUM_NUMBER_OF_THREADS
      ? Number(process.env.MAXIMUM_NUMBER_OF_THREADS)
      : undefined,
    MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH: process.env
      .MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH
      ? Number(process.env.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH)
      : undefined,
    ZERO_ADDRESS: process.env.ZERO_ADDRESS
      ? process.env.ZERO_ADDRESS
      : undefined,
  };
};

const getConfigByNetwork = (network: string): any => {
  let URL;
  let API_KEY;
  let MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
  let MAXIMUM_NUMBER_OF_THREADS;
  let MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
  let STARTING_BLOCK;
  let ZERO_ADDRESS;

  const networkBasedConfig = getConfig();

  switch (network) {
    case 'optimism':
      (URL = networkBasedConfig.OPTIMISTIC_ETHERSCAN_URL),
        (API_KEY = networkBasedConfig.OPTIMISTIC_ETHERSCAN_API_KEY);
      MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY =
        networkBasedConfig.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
      MAXIMUM_NUMBER_OF_THREADS = networkBasedConfig.MAXIMUM_NUMBER_OF_THREADS;
      MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH =
        networkBasedConfig.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
      STARTING_BLOCK = networkBasedConfig.OPTIMISM_RABBIT_HOLE_STARTING_BLOCK;
      ZERO_ADDRESS = networkBasedConfig.ZERO_ADDRESS;
      break;
    case 'ethereum':
      URL = networkBasedConfig.ETHERSCAN_URL;
      API_KEY = networkBasedConfig.ETHERSCAN_API_KEY;
      MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY =
        networkBasedConfig.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
      networkBasedConfig.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
      MAXIMUM_NUMBER_OF_THREADS = networkBasedConfig.MAXIMUM_NUMBER_OF_THREADS;
      MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH =
        networkBasedConfig.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
      STARTING_BLOCK =
        networkBasedConfig.ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK;
      ZERO_ADDRESS = networkBasedConfig.ZERO_ADDRESS;
      break;
    case 'polygon':
      URL = networkBasedConfig.POLYGONSCAN_URL;
      API_KEY = networkBasedConfig.POLYGONSCAN_API_KEY;
      MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY =
        networkBasedConfig.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
      networkBasedConfig.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
      MAXIMUM_NUMBER_OF_THREADS = networkBasedConfig.MAXIMUM_NUMBER_OF_THREADS;
      MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH =
        networkBasedConfig.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
      STARTING_BLOCK = networkBasedConfig.POLYGON_RABBIT_HOLE_STARTING_BLOCK;
      ZERO_ADDRESS = networkBasedConfig.ZERO_ADDRESS;
      break;
  }
  return {
    URL,
    API_KEY,
    MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY,
    MAXIMUM_NUMBER_OF_THREADS,
    MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH,
    STARTING_BLOCK,
    ZERO_ADDRESS,
  };
};

export default getConfigByNetwork;

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as unknown as Config;
};
