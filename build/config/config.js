"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
// Parsing the env file.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, './config/config.env') });
// Loading process.env as ENV interface
var getConfig = function () {
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
var getConfigByNetwork = function (network) {
    var URL;
    var API_KEY;
    var MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY;
    var MAXIMUM_NUMBER_OF_THREADS;
    var MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH;
    var STARTING_BLOCK;
    var ZERO_ADDRESS;
    var networkBasedConfig = getConfig();
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
        URL: URL,
        API_KEY: API_KEY,
        MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY: MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY,
        MAXIMUM_NUMBER_OF_THREADS: MAXIMUM_NUMBER_OF_THREADS,
        MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH: MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH,
        STARTING_BLOCK: STARTING_BLOCK,
        ZERO_ADDRESS: ZERO_ADDRESS,
    };
};
exports.default = getConfigByNetwork;
// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.
var getSanitzedConfig = function (config) {
    for (var _i = 0, _a = Object.entries(config); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value === undefined) {
            throw new Error("Missing key ".concat(key, " in config.env"));
        }
    }
    return config;
};
