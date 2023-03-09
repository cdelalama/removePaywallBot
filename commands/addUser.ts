import Backendless from 'backendless';
import dotenv from 'dotenv';
import { MyContext } from '../types';
import { Bot, GrammyError } from 'grammy'//import { Chat } from 'grammy';
//import { GrammyError } from '@grammyjs/errors';




// Initialize Backendless
Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

// Define the "rpw_users" table in Backendless
const rpwUsersTable = Backendless.Data.of('rpw_users');

export async function getUserIdFromUsername(ctx: MyContext, username: string): Promise<string> {
    try {
      const chat = await ctx.api.getChat(username);
      if (chat.type === 'private') {
        return chat.id.toString();
      } else {
        throw new Error(`Username ${username} does not belong to a private chat.`);
      }
    } catch (e:any) {
      if (e) {
        throw new Error(`Failed to get chat for username ${username}: ${e.description}`);
      } else {
        throw new Error(`Unexpected error while getting chat for username ${username}: ${e}`);
      }
    }
  }
  const bot = new Bot<MyContext>(process.env.TelegramToken!);
    async function getUsernameById(id: number): Promise<string | undefined> {
    try {
      const chat = await bot.api.getChat(id)
      if (chat.type === 'private') {
        return chat.username
      } else {
        console.log('Provided ID is not a user ID')
      }
    } catch (error) {
      if (error instanceof GrammyError) {
        console.log(`Failed to get chat: ${error.description}`)
      } else {
        console.log(`Failed to get chat: ${error}`)
      }
    }
  }
// Define the "adduser" command
export const addUserCommand = {
    command: 'adduser',
    handler: async (ctx: MyContext) => {
      const messageText = ctx.message?.text || '';
      const args = messageText.split(' ');
      if (args.length < 2) {
        await ctx.reply('Please provide a Telegram username as a parameter.');
        //const username = await getUsernameById(165997059)
        //console.log(`Username: ${username}`)
        return;
      }
      const telegramUsername = args[1];
      try {
        const telegramId = await getUserIdFromUsername(ctx, telegramUsername);
        const username = await getUsernameById(parseInt(telegramId))
        const rpwUser = {
          telegramId: telegramId,
          telegramUsername: username,
        };


        await rpwUsersTable.save(rpwUser);
        await ctx.reply(`User ${telegramUsername} (ID: ${telegramId}) added to the "rpw_users" table.`);
      } catch (e) {
        console.error(`Error adding user: ${e}`);
        await ctx.reply('Sorry, there was an error adding the user.');
      }
    },
  };
