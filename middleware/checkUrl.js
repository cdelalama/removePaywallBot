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
exports.checkUrlMiddleware = void 0;
const grammy_1 = require("grammy");
const addUser_1 = require("../commands/addUser");
const backendless_1 = __importDefault(require("backendless"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
const checkUrlMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (ctx && ctx.chat && ctx.message && ctx.message.text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlMatches = urlRegex.exec(ctx.message.text);
        if (urlMatches) {
            ctx.session.url = urlMatches[0];
            // Increment the number of calls for the user
            try {
                const userId = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString();
                if (!userId) {
                    throw new Error('User ID not found in context');
                }
                // Increment the 'number_calls' property in Backendless
                const query = backendless_1.default.DataQueryBuilder.create().setWhereClause(`telegramId='${userId}'`);
                const result = yield backendless_1.default.Data.of('rpw_users').find(query);
                if (result.length === 0) {
                    throw new Error('User not found in "rpw_users" table');
                }
                const rpwUser = result[0];
                ;
                rpwUser.number_calls = ((_c = rpwUser.number_calls) !== null && _c !== void 0 ? _c : 0) + 1;
                yield addUser_1.rpwUsersTable.save(rpwUser);
            }
            catch (error) {
                console.error(`Error incrementing number of calls: ${error}`);
            }
            const options = new grammy_1.InlineKeyboard().text('Remove Paywall', '1');
            yield ctx.api.sendMessage(ctx.chat.id, 'Url detected. Click button to remove paywall:', { reply_markup: options });
            return;
        }
    }
    yield next();
});
exports.checkUrlMiddleware = checkUrlMiddleware;
