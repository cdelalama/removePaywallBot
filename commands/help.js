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
exports.helpMiddleware = exports.helpCommand = void 0;
const addUser_1 = require("./addUser");
const stats_1 = require("./stats");
const deleteUser_1 = require("./deleteUser");
exports.helpCommand = {
    command: 'help',
    handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const commands = [
            { name: addUser_1.addUserCommand.command, isAdmin: true },
            { name: stats_1.statsCommand.command, isAdmin: true },
            { name: deleteUser_1.deleteUserCommand.command, isAdmin: true },
            { name: exports.helpCommand.command, isAdmin: false },
            // add more commands as needed
        ];
        const message = commands.reduce((acc, command) => {
            acc += `/${command.name} ${command.isAdmin ? '(admin only)' : ''}\n`;
            return acc;
        }, 'Available commands:\n\n');
        if (ctx.chat) {
            yield ctx.api.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
        }
        else {
            console.log('Error: chat is undefined');
        }
    }),
};
const helpMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) === '/help') {
        yield exports.helpCommand.handler(ctx);
    }
    else {
        yield next();
    }
});
exports.helpMiddleware = helpMiddleware;
