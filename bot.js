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
dotenv_1.default.config();
const apiToken = process.env.TelegramToken;
const carlosTelegramID = process.env.carlosTelegramID;
// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new grammy_1.Bot(apiToken); // <-- put your authentication token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
// Define a list of authorized users
const allowedUserIds = [carlosTelegramID];
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
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start();
