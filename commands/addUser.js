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
exports.addUserCommand = exports.getUserIdFromUsername = exports.rpwUsersTable = void 0;
const backendless_1 = __importDefault(require("backendless"));
const grammy_1 = require("grammy"); //import { Chat } from 'grammy';
//import { GrammyError } from '@grammyjs/errors';
// Initialize Backendless
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
// Define the "rpw_users" table in Backendless
exports.rpwUsersTable = backendless_1.default.Data.of('rpw_users');
function getUserIdFromUsername(ctx, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chat = yield ctx.api.getChat(username);
            if (chat.type === 'private') {
                return chat.id.toString();
            }
            else {
                throw new Error(`Username ${username} does not belong to a private chat.`);
            }
        }
        catch (e) {
            if (e) {
                throw new Error(`Failed to get chat for username ${username}: ${e.description}`);
            }
            else {
                throw new Error(`Unexpected error while getting chat for username ${username}: ${e}`);
            }
        }
    });
}
exports.getUserIdFromUsername = getUserIdFromUsername;
const bot = new grammy_1.Bot(process.env.TelegramToken);
function getUsernameById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chat = yield bot.api.getChat(id);
            if (chat.type === 'private') {
                return chat.username;
            }
            else {
                console.log('Provided ID is not a user ID');
            }
        }
        catch (error) {
            if (error instanceof grammy_1.GrammyError) {
                console.log(`Failed to get chat: ${error.description}`);
            }
            else {
                console.log(`Failed to get chat: ${error}`);
            }
        }
    });
}
// Define the "adduser" command
exports.addUserCommand = {
    command: 'adduser',
    handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const messageText = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || '';
        const args = messageText.split(' ');
        if (args.length < 2) {
            yield ctx.reply('Please provide a Telegram username as a parameter.');
            //const username = await getUsernameById(165997059)
            //console.log(`Username: ${username}`)
            return;
        }
        const telegramUsername = args[1];
        try {
            const telegramId = yield getUserIdFromUsername(ctx, telegramUsername);
            const username = yield getUsernameById(parseInt(telegramId));
            const rpwUser = {
                telegramId: telegramId,
                telegramUsername: username,
            };
            yield exports.rpwUsersTable.save(rpwUser);
            yield ctx.reply(`User ${telegramUsername} (ID: ${telegramId}) added to the "rpw_users" table.`);
        }
        catch (e) {
            console.error(`Error adding user: ${e}`);
            yield ctx.reply('Sorry, there was an error adding the user.');
        }
    }),
};
