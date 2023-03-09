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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserMiddleware = void 0;
const backendless_1 = __importDefault(require("backendless"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Backendless
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
// Define a middleware to check if the user is authorized to use the bot
const checkUserMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Get the user ID from the context
        const userId = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString();
        if (!userId) {
            throw new Error('User ID not found in context');
        }
        // Query the 'rpw_users' table in Backendless to check if the user is authorized
        const query = backendless_1.default.DataQueryBuilder.create().setWhereClause(`telegramId='${userId}'`);
        const result = yield backendless_1.default.Data.of('rpw_users').find(query);
        if (result.length === 0) {
            // User is not authorized, send an error message and do not continue
            yield ctx.reply('Sorry, you are not authorized to use this bot.');
            return;
        }
        // User is authorized, continue to the next middleware
        yield next();
    }
    catch (error) {
        console.error(`Error checking user: ${error}`);
        yield ctx.reply('Sorry, there was an error checking your authorization.');
    }
});
exports.checkUserMiddleware = checkUserMiddleware;
