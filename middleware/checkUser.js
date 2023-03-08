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
exports.checkUserMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Define a list of authorized users
const allowedUserIds = [process.env.carlosTelegramID, process.env.rocioTelegramID, process.env.rodrigoTelegramID, process.env.eliTelegramID];
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
exports.checkUserMiddleware = checkUserMiddleware;
