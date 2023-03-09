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
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const bot = new grammy_1.Bot(process.env.TelegramToken);
// Create a middleware function that checks if the user's message contains a URL
const checkUrlMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx && ctx.chat && ctx.message && ctx.message.text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlMatches = urlRegex.exec(ctx.message.text);
        if (urlMatches) {
            ctx.session.url = urlMatches[0];
            const options = new grammy_1.InlineKeyboard().text('Remove Paywall', '1');
            yield bot.api.sendMessage(ctx.chat.id, 'Url detected. Click button to remove paywall:', { reply_markup: options });
            return;
        }
    }
    yield next();
});
exports.default = checkUrlMiddleware;
