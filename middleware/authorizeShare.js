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
const backendless_1 = __importDefault(require("backendless"));
// Initialize Backendless
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
const authorizeShareMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const isAuthorized = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username) === 'cdelalama'; // Only allow authorized user to share messages
    const isForwarded = !!((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.forward_from); // Check if the message is a forwarded message
    if (isAuthorized && isForwarded) {
        const forwardedFrom = (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.forward_from;
        if (forwardedFrom) {
            try {
                // Retrieve the username and ID of the forwarded message owner
                let userId;
                let username;
                if (forwardedFrom.id) {
                    // Get user ID from the forwarded message owner
                    userId = forwardedFrom.id.toString();
                }
                else if (forwardedFrom.username) {
                    // Get user ID from the forwarded message owner's username
                    const userInfo = yield ctx.api.getChat(forwardedFrom.username);
                    userId = userInfo.id.toString();
                }
                else {
                    throw new Error('User ID not found');
                }
                if (forwardedFrom.username) {
                    // Get username from the forwarded message owner's username
                    username = forwardedFrom.username;
                }
                else {
                    // Get username from the chat info
                    const chatId = (_d = ctx.chat) === null || _d === void 0 ? void 0 : _d.id;
                    if (typeof chatId === 'string' || typeof chatId === 'number') {
                        const chatMember = yield ctx.api.getChatMember(chatId, forwardedFrom.id);
                        username = chatMember.user.username;
                    }
                    else {
                        throw new Error('Invalid chat ID');
                    }
                }
                // Save the user's information to the Backendless "rpw_users" table
                const rpwUser = {
                    telegramId: userId,
                    telegramUsername: username,
                };
                yield backendless_1.default.Data.of('rpw_users').save(rpwUser);
                // Send a confirmation message to the user
                yield ctx.reply(`User ${username} (ID: ${userId}) added to the "rpw_users" table.`);
            }
            catch (error) {
                console.error(`Error adding user: ${error}`);
                yield ctx.reply('Sorry, there was an error adding the user.');
            }
        }
    }
    else {
        yield next();
    }
});
exports.default = authorizeShareMiddleware;
