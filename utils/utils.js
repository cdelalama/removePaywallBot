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
exports.isAdmin = void 0;
const backendless_1 = __importDefault(require("backendless"));
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
function isAdmin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            return false;
        }
        try {
            const query = backendless_1.default.DataQueryBuilder.create().setWhereClause(`telegramId='${userId}'`);
            const result = yield backendless_1.default.Data.of('rpw_users').find(query);
            if (result.length === 0) {
                throw new Error(`User with Telegram ID ${userId} not found in "rpw_users" table`);
            }
            const rpwUser = result[0];
            console.log(`User ${rpwUser.telegramUsername} is admin: ${rpwUser.isAdmin}`);
            return rpwUser.isAdmin === true;
        }
        catch (error) {
            console.error(`Error checking if user is admin: ${error}`);
            return false;
        }
    });
}
exports.isAdmin = isAdmin;
