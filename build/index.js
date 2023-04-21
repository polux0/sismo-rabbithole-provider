"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var helper_1 = __importDefault(require("./helper"));
var config_1 = __importDefault(require("./config/config"));
var fs_1 = __importDefault(require("fs"));
// strategy:
// move everything necessary to config ( enviornment variables ) ✓
// move logic from IIFE to function ✓
// research factory in order to be able to choose right variables for right provider ( mainnet, optimism, polygon ) ✓
// collect starting blocks for polygon & ethereum mainnet ✓
// return value of function that query holders must return type fetchedData
// move get latest block to `helper.ts`
// optimism
var optimismQuestId = '423399b4-a891-4d60-b4b2-afdc7a9be85b';
// polygon
var polygonQuestId = '21d47899-5ea3-4046-b19c-138eaff9e271';
// ethereum
var ethereumQuestId = '216b83da-6053-4ef5-aeaf-850d337d0b68';
var _a = (0, config_1.default)('ethereum'), URL = _a.URL, API_KEY = _a.API_KEY, MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY = _a.MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY, MAXIMUM_NUMBER_OF_THREADS = _a.MAXIMUM_NUMBER_OF_THREADS, MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH = _a.MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH, STARTING_BLOCK = _a.STARTING_BLOCK, ZERO_ADDRESS = _a.ZERO_ADDRESS;
function queryQuestTokenHolders(fromBlock, toBlock, questId, offset) {
    return __awaiter(this, void 0, void 0, function () {
        var response, fetchedData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(URL, "/api?module=logs&action=getLogs&address=0x52629961f71c1c2564c5aa22372cb1b9fa9eba3e&topic=0xa9e09a39b54248cb5161a8bad4e544f88b8aa2da99e7c425846bece6703cc1fc&data=").concat((0, helper_1.default)(questId), "&fromBlock=").concat(fromBlock, "&toBlock=").concat(toBlock, "&page=1&offset=").concat(offset !== null && offset !== void 0 ? offset : MAXIMUM_NUMBER_OF_BLOCKS_TO_FETCH, "&apikey=").concat(API_KEY),
                            method: 'get',
                        })];
                case 1:
                    response = (_a.sent()).data;
                    fetchedData = {};
                    if (response.result) {
                        fetchedData = response.result.reduce(function (accumulator, transaction) {
                            var address = transaction.topics[1]
                                ? transaction.topics[1].replace('000000000000000000000000', '')
                                : ZERO_ADDRESS;
                            if (address in accumulator) {
                                accumulator[address] = Number(accumulator[address]) + 1;
                            }
                            else {
                                accumulator[address] = 1;
                            }
                            return accumulator;
                        }, {});
                    }
                    console.log('fetchedData: ', fetchedData);
                    return [2 /*return*/, fetchedData !== null && fetchedData !== void 0 ? fetchedData : []];
                case 2:
                    error_1 = _a.sent();
                    console.log('`getAllQuestHolders` threw an error: ', error_1);
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLatestBlock() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(URL, "/api?module=proxy&action=eth_blockNumber&apikey=").concat(API_KEY),
                            method: 'get',
                        })];
                case 1:
                    response = (_a.sent()).data;
                    return [2 /*return*/, Number(BigInt(response.result).toString())];
                case 2:
                    error_2 = _a.sent();
                    console.log('`getLatestBlock` threw an error: ', error_2);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function queryQuestTokenHoldersWithThreads(questId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var fromBlock, toBlock, blockRange, maximumIterationIncrement, startBlock, endBlock, promises, index, addresses, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    fromBlock = STARTING_BLOCK;
                    return [4 /*yield*/, getLatestBlock()];
                case 1:
                    toBlock = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : 89495952;
                    blockRange = toBlock - fromBlock;
                    maximumIterationIncrement = blockRange / MAXIMUM_NUMBER_OF_THREADS;
                    startBlock = fromBlock;
                    endBlock = startBlock + maximumIterationIncrement;
                    promises = [];
                    _b.label = 2;
                case 2:
                    for (index = 0; index < MAXIMUM_NUMBER_OF_THREADS; index++) {
                        promises.push(queryQuestTokenHolders(startBlock, endBlock, questId));
                        startBlock = endBlock;
                        endBlock += Number(maximumIterationIncrement);
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            return setTimeout(resolve, MINIMUM_TIMEOUT_FOR_FREE_TIER_API_KEY);
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    if (endBlock < toBlock) return [3 /*break*/, 2];
                    _b.label = 5;
                case 5: return [4 /*yield*/, Promise.all(promises)];
                case 6:
                    addresses = (_b.sent()).flat();
                    return [2 /*return*/, addresses];
                case 7:
                    error_3 = _b.sent();
                    console.log('`queryQuestTokenHoldersWithThreads` threw an error: ', error_3);
                    return [2 /*return*/, []];
                case 8: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var aggregatedHolders, aggregatedHoldersSanitized;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('enviornment variables: ', URL, API_KEY);
                return [4 /*yield*/, queryQuestTokenHoldersWithThreads(optimismQuestId)];
            case 1:
                aggregatedHolders = _a.sent();
                aggregatedHoldersSanitized = aggregatedHolders.filter(function (address) { return address.length <= 42 && address !== ZERO_ADDRESS; });
                try {
                    fs_1.default.writeFileSync('/home/equinox/Desktop/development/rabbithole-provider/src/tests/test.txt', JSON.stringify(aggregatedHoldersSanitized));
                    // file written successfully
                }
                catch (err) {
                    console.error(err);
                }
                return [2 /*return*/];
        }
    });
}); })();
