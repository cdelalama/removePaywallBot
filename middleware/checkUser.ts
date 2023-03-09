import { Middleware } from 'grammy';
import Backendless from 'backendless';
import dotenv from 'dotenv';
import { MyContext } from '../types';

dotenv.config();

// Initialize Backendless
Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

// Define a middleware to check if the user is authorized to use the bot
export const checkUserMiddleware: Middleware<MyContext> = async (ctx, next) => {
  try {
    // Get the user ID from the context
    const userId = ctx.from?.id?.toString();
    if (!userId) {
      throw new Error('User ID not found in context');
    }

    // Query the 'rpw_users' table in Backendless to check if the user is authorized
    const query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramId='${userId}'`);
    const result = await Backendless.Data.of('rpw_users').find(query);

    if (result.length === 0) {
      // User is not authorized, send an error message and do not continue
      await ctx.reply('Sorry, you are not authorized to use this bot.');
      return;
    }

    // User is authorized, continue to the next middleware
    await next();
  } catch (error) {
    console.error(`Error checking user: ${error}`);
    await ctx.reply('Sorry, there was an error checking your authorization.');
  }
};
