import { Middleware } from 'grammy';
import Backendless from 'backendless';
import { MyContext } from '../types/types';
import { isAdmin } from '../utils/utils';
import { RpwUser } from '../types/types';

Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

export const statsMiddleware: Middleware<MyContext> = async (ctx: MyContext, next) => {
    if (await isAdmin(ctx.from?.id)) {
      console.log('User is admin, sending stats');
      const query = Backendless.DataQueryBuilder.create();
      query.setProperties(['telegramId', 'telegramUsername', 'number_calls']);
  
      const result = await Backendless.Data.of('rpw_users').find<RpwUser>(query);
      console.log(`Found ${result.length} users`);
      const message = result.reduce((acc, user) => {
        acc += `*${user.telegramUsername || 'Unknown User'}*: ${user.number_calls}\n`;
        return acc;
      }, '*Number of users and links pasted*\n\n');
  
      await ctx.reply('```' + message + '```', { parse_mode: 'MarkdownV2' });
    }
  
    await next();
  };
  