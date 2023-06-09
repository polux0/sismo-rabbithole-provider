declare namespace NodeJS {
  interface ProcessEnv {
    ETHEREUM_MAINNET_RABBIT_HOLE_STARTING_BLOCK: string;
    POLYGON_RABBIT_HOLE_STARTING_BLOCK: string;
    OPTIMISM_RABBIT_HOLE_STARTING_BLOCK: string;
    ETHERSCAN_API_KEY: string;
    OPTIMISTIC_ETHERSCAN_API_KEY: string;
    POLYGONSCAN_API_KEY: string;
    MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY: string;
    MAXIMUM_NUMBER_OF_THREADS: string;
    MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH: string;
  }
}
