import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import { MyContext, SessionData } from '../types/types';
import { checkUserMiddleware } from '../middleware/checkUser';
import { checkUrlMiddleware } from '../middleware/checkUrl';
import { addUserCommand } from '../commands/addUser';
import authorizeShareMiddleware from '../middleware/authorizeShare'; 
import { statsCommand } from '../commands/stats';
import { helpMiddleware } from '../commands/help';
import { deleteUserCommand } from '../commands/deleteUser';
import { adminCommand, adminMiddleware } from '../commands/admin'; // Import the new command and middleware


dotenv.config();

const bot = new Bot<MyContext>(process.env.TelegramToken!);

// Define the initial session value.
function initial(): SessionData {
  return { url: undefined };
}

// Install session middleware with the initial session value.
bot.use(session({ initial }));
bot.use(checkUserMiddleware);
bot.use(checkUrlMiddleware);
bot.use(authorizeShareMiddleware); 
bot.use(helpMiddleware);
bot.use(adminMiddleware); 





// Handle the callback query for the "1" button
bot.on('callback_query:data', async (ctx) => {
  if (ctx.session.url) {
    // Modify the URL by always prepending "amp."
    const modifiedUrl = ctx.session.url.replace(/^https?:\/\/(www\.)?/, 'https://amp.');
    const finalUrl = `https://12ft.io/${modifiedUrl}`;
    await ctx.reply(`Paywall removed. Here's the URL: ${finalUrl}`);
    delete ctx.session.url; // Remove the URL from the session data
  } else {
    await ctx.reply('No URL was detected.');
  }
});


// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
bot.command(addUserCommand.command, addUserCommand.handler);
bot.command(statsCommand.command, statsCommand.handler);
bot.command(deleteUserCommand.command, deleteUserCommand.handler);
bot.command(adminCommand.command, adminCommand.handler);



// Start the bot.
bot.api.deleteWebhook();
bot.start();
