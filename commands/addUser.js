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
exports.addUserCommand = void 0;
const backendless_1 = __importDefault(require("backendless"));
// Initialize Backendless
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
// Define the "rpw_users" table in Backendless
const rpwUsersTable = backendless_1.default.Data.of('rpw_users');
// Define the "adduser" command
exports.addUserCommand = {
    command: 'adduser',
    handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const messageText = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || '';
        const args = messageText.split(' ');
        if (args.length < 2) {
            yield ctx.reply('Please provide a Telegram username as a parameter.');
            return;
        }
        const telegramUsername = args[1];
        try {
            const chat = yield ctx.api.getChat(telegramUsername);
            if (chat) {
                const rpwUser = {
                    telegramId: chat.id.toString(),
                    telegramUsername: telegramUsername,
                };
                yield rpwUsersTable.save(rpwUser);
                yield ctx.reply(`User ${telegramUsername} added to the "rpw_users" table.`);
            }
        }
        catch (e) {
            console.error(`Error adding user: ${e}`);
            yield ctx.reply('Sorry, there was an error adding the user.');
        }
    }),
};
