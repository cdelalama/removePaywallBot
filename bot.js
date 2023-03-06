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
//import { Session } from 'grammy/out/platform';
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiToken = process.env.TelegramToken;
const carlosTelegramID = process.env.carlosTelegramID;
try {
    // Define a list of authorized users
    const allowedUserIds = [carlosTelegramID];
    const bot = new grammy_1.Bot(apiToken);
    // Define the initial session value.
    function initial() {
        return { url: undefined };
    }
    // Install session middleware with the initial session value.
    bot.use((0, grammy_1.session)({ initial }));
    // Create a middleware function that checks if the user ID is in the allowed list
    const checkUserMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
        if (userId && allowedUserIds.includes(userId.toString())) {
            // User is allowed, continue to the next middleware
            yield next();
        }
        else {
            // User is not allowed, send an error message and do not continue
            yield ctx.reply('Sorry, you are not authorized to use this bot.');
        }
    });
    bot.use(checkUserMiddleware);
    // Create a middleware function that checks if the user's message contains a URL
    const checkUrlMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (ctx && ctx.chat && ctx.message && ctx.message.text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urlMatches = urlRegex.exec(ctx.message.text);
            if (urlMatches) {
                ctx.session.url = urlMatches[0];
                const options = new grammy_1.InlineKeyboard().text('Option 1', '1').text('Option 2', '2');
                yield bot.api.sendMessage(ctx.chat.id, 'Select an option:', { reply_markup: options });
                return;
            }
        }
        yield next();
    });
    // Add the middleware function to the bot
    bot.use(checkUrlMiddleware);
    // Handle the callback query for the "1" button
    bot.on('callback_query:data', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (ctx.session.url) {
            yield ctx.reply(`You selected Option 1 with URL: ${ctx.session.url}`);
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
        var _b;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (!urlRegex.test(((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text) || '')) {
            yield ctx.reply('Got another message!');
        }
    }));
    // Start the bot.
    bot.start();
}
catch (error) {
    console.error(error);
}
