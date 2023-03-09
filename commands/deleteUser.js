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
exports.deleteUserMiddleware = void 0;
const backendless_1 = __importDefault(require("backendless"));
const utils_1 = require("../utils/utils");
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
const deleteUserMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Only allow admins to delete users
    if (yield (0, utils_1.isAdmin)((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id)) {
        const messageText = ((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text) || '';
        const args = messageText.split(' ');
        if (args.length < 2) {
            yield ctx.reply('Please provide a Telegram username as a parameter.');
            return;
        }
        const telegramUsername = args[1];
        try {
            const query = backendless_1.default.DataQueryBuilder.create().setWhereClause(`telegramUsername='${telegramUsername}'`);
            const result = yield backendless_1.default.Data.of('rpw_users').find(query);
            if (result.length === 0) {
                throw new Error(`User ${telegramUsername} not found in "rpw_users" table`);
            }
            const rpwUser = result[0];
            yield backendless_1.default.Data.of('rpw_users').remove(rpwUser);
            yield ctx.reply(`User ${telegramUsername} (ID: ${rpwUser.telegramId}) has been deleted from the "rpw_users" table.`);
        }
        catch (error) {
            console.error(`Error deleting user: ${error}`);
            yield ctx.reply(`Sorry, there was an error deleting user ${telegramUsername}.`);
        }
    }
    yield next();
});
exports.deleteUserMiddleware = deleteUserMiddleware;
