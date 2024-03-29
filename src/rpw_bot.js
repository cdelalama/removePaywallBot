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
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const checkUser_1 = require("../middleware/checkUser");
const checkUrl_1 = require("../middleware/checkUrl");
const addUser_1 = require("../commands/addUser");
const authorizeShare_1 = __importDefault(require("../middleware/authorizeShare"));
const stats_1 = require("../commands/stats");
const help_1 = require("../commands/help");
const deleteUser_1 = require("../commands/deleteUser");
const admin_1 = require("../commands/admin"); // Import the new command and middleware
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.TelegramToken);
// Define the initial session value.
function initial() {
    return { url: undefined };
}
// Install session middleware with the initial session value.
bot.use((0, grammy_1.session)({ initial }));
bot.use(checkUser_1.checkUserMiddleware);
bot.use(checkUrl_1.checkUrlMiddleware);
bot.use(authorizeShare_1.default);
bot.use(help_1.helpMiddleware);
bot.use(admin_1.adminMiddleware);
// Handle the callback query for the "1" button
bot.on('callback_query:data', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.session.url) {
        // Modify the URL by always prepending "amp."
        const modifiedUrl = ctx.session.url.replace(/^https?:\/\/(www\.)?/, 'https://amp.');
        const finalUrl = `https://12ft.io/${modifiedUrl}`;
        yield ctx.reply(`Paywall removed. Here's the URL: ${finalUrl}`);
        delete ctx.session.url; // Remove the URL from the session data
    }
    else {
        yield ctx.reply('No URL was detected.');
    }
}));
// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
bot.command(addUser_1.addUserCommand.command, addUser_1.addUserCommand.handler);
bot.command(stats_1.statsCommand.command, stats_1.statsCommand.handler);
bot.command(deleteUser_1.deleteUserCommand.command, deleteUser_1.deleteUserCommand.handler);
bot.command(admin_1.adminCommand.command, admin_1.adminCommand.handler);
// Start the bot.
bot.api.deleteWebhook();
bot.start();
