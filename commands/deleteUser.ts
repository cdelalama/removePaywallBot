import { Middleware } from 'grammy';
import Backendless from 'backendless';
import { MyContext } from '../types/types';
import { isAdmin } from '../utils/utils';
import { RpwUser } from '../types/types';

Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

export const deleteUserMiddleware: Middleware<MyContext> = async (ctx, next) => {
    // Only allow admins to delete users
    if (await isAdmin(ctx.from?.id)) {
      const messageText = ctx.message?.text || '';
      const args = messageText.split(' ');
      if (args.length < 2) {
        await ctx.reply('Please provide a Telegram username or ID as a parameter.');
        return;
      }
      const input = args[1];
  
      try {
        let rpwUser: RpwUser | null = null;
  
        // Try to find the user by ID
        if (/^\d+$/.test(input)) {
          const telegramId = input;
          const query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramId='${telegramId}'`);
          const result = await Backendless.Data.of('rpw_users').find(query);
  
          if (result.length > 0) {
            rpwUser = result[0] as RpwUser;
          }
        }
        // If user not found by ID, try to find by username
        if (!rpwUser) {
          const telegramUsername = input;
          const query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramUsername='${telegramUsername}'`);
          const result = await Backendless.Data.of('rpw_users').find(query);
  
          if (result.length > 0) {
            rpwUser = result[0] as RpwUser;
          }
        }
  
        if (!rpwUser) {
          throw new Error(`User ${input} not found in "rpw_users" table`);
        }
  
        await Backendless.Data.of('rpw_users').remove(rpwUser);
  
        await ctx.reply(`User ${rpwUser.telegramUsername || 'Unknown User'} (ID: ${rpwUser.telegramId}) has been deleted from the "rpw_users" table.`);
      } catch (error) {
        console.error(`Error deleting user: ${error}`);
        await ctx.reply(`Sorry, there was an error deleting user ${input}.`);
      }
    }
    await next();
  };
  