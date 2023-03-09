import { Middleware, InlineKeyboard, SessionFlavor } from 'grammy';
import { MyContext, SessionData } from '../types';
import { rpwUsersTable } from '../commands/addUser';
import Backendless from 'backendless';
import dotenv from 'dotenv';
import { RpwUser } from '../types';

dotenv.config();
Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

export const checkUrlMiddleware: Middleware<MyContext & SessionFlavor<SessionData>> = async (ctx, next) => {
  if (ctx && ctx.chat && ctx.message && ctx.message.text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatches = urlRegex.exec(ctx.message.text);
    if (urlMatches) {
      ctx.session.url = urlMatches[0];

      // Increment the number of calls for the user
      try {
        const userId = ctx.from?.id?.toString();
        if (!userId) {
          throw new Error('User ID not found in context');
        }

        // Increment the 'number_calls' property in Backendless
        const query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramId='${userId}'`);
        const result = await Backendless.Data.of('rpw_users').find(query);
        if (result.length === 0) {
          throw new Error('User not found in "rpw_users" table');
        }
        const rpwUser = result[0] as RpwUser;;
        rpwUser.number_calls = (rpwUser.number_calls ?? 0) + 1;
        await rpwUsersTable.save(rpwUser);
      } catch (error) {
        console.error(`Error incrementing number of calls: ${error}`);
      }

      const options = new InlineKeyboard().text('Remove Paywall', '1');
      await ctx.api.sendMessage(ctx.chat.id, 'Url detected. Click button to remove paywall:', { reply_markup: options });
      return;
    }
  }
  await next();
};
