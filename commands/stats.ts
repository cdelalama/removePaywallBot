import { Middleware } from 'grammy';
import Backendless from 'backendless';
import { MyContext } from '../types/types';
import { isAdmin } from '../utils/utils';
import { RpwUser } from '../types/types';

Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

export const statsCommand = {
  command: 'stats',
  description: 'Show stats about users and links pasted',
  isAdminCommand: true,
  handler: async (ctx: MyContext) => {
    console.log('User is admin, sending stats');
    const query = Backendless.DataQueryBuilder.create();
    query.setProperties(['telegramId', 'telegramUsername', 'number_calls', 'isAdmin']);

    const result = await Backendless.Data.of('rpw_users').find<RpwUser>(query);
    console.log(`Found ${result.length} users`);
    const message = result.reduce((acc, user) => {
      acc += `<code>${user.telegramUsername || 'Unknown User'}</code>: ${user.number_calls} (Admin: ${user.isAdmin ? 'Yes' : 'No'})\n`;
      return acc;
    }, '<b>Number of users and links pasted</b>\n\n');

    await ctx.reply(message, { parse_mode: 'HTML' });
  },
};
