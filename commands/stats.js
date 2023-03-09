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
exports.statsMiddleware = void 0;
const backendless_1 = __importDefault(require("backendless"));
const utils_1 = require("../utils/utils");
backendless_1.default.initApp(process.env.BackendlessAppId, process.env.BackendlessApiKey);
const statsMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (yield (0, utils_1.isAdmin)((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id)) {
        console.log('User is admin, sending stats');
        const query = backendless_1.default.DataQueryBuilder.create();
        query.setProperties(['telegramId', 'telegramUsername', 'number_calls', 'isAdmin']);
        const result = yield backendless_1.default.Data.of('rpw_users').find(query);
        console.log(`Found ${result.length} users`);
        const message = result.reduce((acc, user) => {
            acc += `*${user.telegramUsername || 'Unknown User'}*: ${user.number_calls} (Admin: ${user.isAdmin ? 'Yes' : 'No'})\n`;
            return acc;
        }, '*Number of users and links pasted*\n\n');
        yield ctx.reply('```' + message + '```', { parse_mode: 'MarkdownV2' });
    }
    yield next();
});
exports.statsMiddleware = statsMiddleware;
/*
import { Middleware } from 'grammy';
import Backendless from 'backendless';
import { MyContext } from '../types/types';
import { isAdmin } from '../utils/utils';
import { RpwUser } from '../types/types';

Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

export const statsMiddleware: Middleware<MyContext> = async (ctx: MyContext, next) => {
  const userId = ctx.from?.id;
  const isAdminUser = await isAdmin(userId);

  console.log(`User ${userId} is admin: ${isAdminUser}`);

  const query = Backendless.DataQueryBuilder.create();
  query.setProperties(['telegramId', 'telegramUsername', 'number_calls', 'isAdmin']);

  const result = await Backendless.Data.of<RpwUser>('rpw_users').find(query);
  console.log(`Found ${result.length} users`);
  const message = result.reduce((acc, user) => {
    acc += `*${user.telegramUsername || 'Unknown User'}*: ${user.number_calls} (Admin: ${user.isAdmin ? 'Yes' : 'No'})\n`;
    return acc;
  }, '*Number of users and links pasted*\n\n');

  await ctx.reply('```' + message + '```', { parse_mode: 'MarkdownV2' });

  await next();
};
*/ 
