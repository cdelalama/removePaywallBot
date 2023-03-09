import Backendless from 'backendless';
import dotenv from 'dotenv';
import { MyContext } from '../types';



// Initialize Backendless
Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

// Define the "rpw_users" table in Backendless
const rpwUsersTable = Backendless.Data.of('rpw_users');

// Define the "adduser" command
export const addUserCommand = {
  command: 'adduser',
  handler: async (ctx: MyContext) => {
    const messageText = ctx.message?.text || '';
    const args = messageText.split(' ');
    if (args.length < 2) {
      await ctx.reply('Please provide a Telegram username as a parameter.');
      return;
    }
    const telegramUsername = args[1];
    try {
      const chat = await ctx.api.getChat(telegramUsername);
      if (chat) {
        const rpwUser = {
          telegramId: chat.id.toString(),
          telegramUsername: telegramUsername,
        };
        await rpwUsersTable.save(rpwUser);
        await ctx.reply(`User ${telegramUsername} added to the "rpw_users" table.`);
      }
    } catch (e) {
      console.error(`Error adding user: ${e}`);
      await ctx.reply('Sorry, there was an error adding the user.');
    }
  },
};
