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
exports.adminMiddleware = exports.adminCommand = void 0;
const backendless_1 = __importDefault(require("backendless"));
const utils_1 = require("../utils/utils");
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
// Define the "admin" command
exports.adminCommand = {
    command: 'admin',
    description: 'Add or remove admin permissions from a user',
    isAdminCommand: true,
    handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const messageText = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || '';
        const args = messageText.split(' ');
        if (args.length < 3) {
            yield ctx.reply('Please provide a Telegram ID or username and a boolean value (true or false) as parameters.');
            return;
        }
        let query;
        if (/^\d+$/.test(args[1])) {
            const telegramId = args[1];
            query = backendless_1.default.DataQueryBuilder.create().setWhereClause(`telegramId='${telegramId}'`);
        }
        else {
            const telegramUsername = args[1];
            query = backendless_1.default.DataQueryBuilder.create().setWhereClause(`telegramUsername='${telegramUsername}'`);
        }
        const isAdmin = args[2] === 'true';
        try {
            // Find the user in the "rpw_users" table
            const result = yield backendless_1.default.Data.of('rpw_users').find(query);
            if (result.length === 0) {
                throw new Error(`User not found in "rpw_users" table`);
            }
            const rpwUser = result[0];
            rpwUser.isAdmin = isAdmin;
            // Save the updated user object in Backendless
            yield backendless_1.default.Data.of('rpw_users').save(rpwUser);
            const adminStatus = isAdmin ? 'added to' : 'removed from';
            yield ctx.reply(`User ${rpwUser.telegramUsername || 'Unknown User'} (ID: ${rpwUser.telegramId}) has been ${adminStatus} the list of admins.`);
        }
        catch (error) {
            console.error(`Error updating admin status: ${error}`);
            yield ctx.reply(`Sorry, there was an error updating admin status for user. Error: ${error}`);
        }
    }),
};
// Define a middleware to handle the "admin" command
const adminMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    if ((_c = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.startsWith('/admin')) {
        if (yield (0, utils_1.isAdmin)((_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id)) {
            yield exports.adminCommand.handler(ctx);
        }
        else {
            yield ctx.reply('Sorry, only admins are allowed to use this command.');
        }
    }
    else {
        yield next();
    }
});
exports.adminMiddleware = adminMiddleware;
