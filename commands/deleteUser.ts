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
      await ctx.reply('Please provide a Telegram username as a parameter.');
      return;
    }
    const telegramUsername = args[1];
    try {
        
        const query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramUsername='${telegramUsername}'`);
        const result = await Backendless.Data.of('rpw_users').find<RpwUser>(query);


      if (result.length === 0) {
        throw new Error(`User ${telegramUsername} not found in "rpw_users" table`);
      }

      const rpwUser = result[0];
      await Backendless.Data.of('rpw_users').remove(rpwUser);

      await ctx.reply(`User ${telegramUsername} (ID: ${rpwUser.telegramId}) has been deleted from the "rpw_users" table.`);
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      await ctx.reply(`Sorry, there was an error deleting user ${telegramUsername}.`);
    }
  }
  await next();
};
