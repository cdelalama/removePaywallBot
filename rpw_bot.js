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
const checkUser_1 = require("./middleware/checkUser");
const checkUrl_1 = require("./middleware/checkUrl");
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
// Handle the callback query for the "1" button
bot.on('callback_query:data', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.session.url) {
        // Modify the URL by appending "https://12ft.io/" to it
        const modifiedUrl = `https://12ft.io/${ctx.session.url.replace('www', 'amp')}`;
        yield ctx.reply(`Paywall removed. Here's the URL: ${modifiedUrl}`);
        delete ctx.session.url; // Remove the URL from the session data
    }
    else {
        yield ctx.reply('No URL was detected.');
    }
}));
// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
// Handle other messages.
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (!urlRegex.test(((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || '')) {
        yield ctx.reply('Got another message!!!');
    }
}));
// Start the bot.
bot.api.deleteWebhook();
bot.start();
