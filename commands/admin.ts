import { Middleware } from 'grammy';
import Backendless from 'backendless';
import { MyContext } from '../types/types';
import { isAdmin } from '../utils/utils';
import { RpwUser } from '../types/types';

Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

// Define the "admin" command
export const adminCommand = {
  command: 'admin',
  description: 'Add or remove admin permissions from a user',
  isAdminCommand: true,
  handler: async (ctx: MyContext) => {
    const messageText = ctx.message?.text || '';
    const args = messageText.split(' ');
    if (args.length < 3) {
      await ctx.reply('Please provide a Telegram ID or username and a boolean value (true or false) as parameters.');
      return;
    }
    let query;
    if (/^\d+$/.test(args[1])) {
      const telegramId = args[1];
      query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramId='${telegramId}'`);
    } else {
      const telegramUsername = args[1];
      query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramUsername='${telegramUsername}'`);
    }
    const isAdmin = args[2] === 'true';

    try {
      // Find the user in the "rpw_users" table
      const result = await Backendless.Data.of('rpw_users').find<RpwUser>(query);

      if (result.length === 0) {
        throw new Error(`User not found in "rpw_users" table`);
      }

      const rpwUser = result[0];
      rpwUser.isAdmin = isAdmin;

      // Save the updated user object in Backendless
      await Backendless.Data.of('rpw_users').save(rpwUser);

      const adminStatus = isAdmin ? 'added to' : 'removed from';
      await ctx.reply(`User ${rpwUser.telegramUsername || 'Unknown User'} (ID: ${rpwUser.telegramId}) has been ${adminStatus} the list of admins.`);
    } catch (error) {
      console.error(`Error updating admin status: ${error}`);
      await ctx.reply(`Sorry, there was an error updating admin status for user. Error: ${error}`);
    }
  },
};

// Define a middleware to handle the "admin" command
export const adminMiddleware: Middleware<MyContext> = async (ctx, next) => {
  if (ctx.message?.text?.startsWith('/admin')) {
    if (await isAdmin(ctx.from?.id)) {
      await adminCommand.handler(ctx);
    } else {
      await ctx.reply('Sorry, only admins are allowed to use this command.');
    }
  } else {
    await next();
  }
};
