import { Bot, Middleware, Context, InlineKeyboard, session, SessionFlavor } from 'grammy';
import dotenv from 'dotenv';
import { MyContext, SessionData } from './types';
import { checkUserMiddleware } from './middleware/checkUser';
import { checkUrlMiddleware } from './middleware/checkUrl';
import { addUserCommand } from './commands/addUser';
import authorizeShareMiddleware from './middleware/authorizeShare'; // Import the new middleware function



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


// Handle the callback query for the "1" button
bot.on('callback_query:data', async (ctx) => {
  if (ctx.session.url) {
    // Modify the URL by appending "https://12ft.io/" to it
    const modifiedUrl = `https://12ft.io/${ctx.session.url.replace('www', 'amp')}`;
    await ctx.reply(`Paywall removed. Here's the URL: ${modifiedUrl}`);
    delete ctx.session.url; // Remove the URL from the session data
  } else {
    await ctx.reply('No URL was detected.');
  }
});

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
/*
// Handle other messages.
bot.on('message', async (ctx) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (!urlRegex.test(ctx.message?.text || '')) {
    await ctx.reply('Got another message!!!');
  }
});
*/

bot.command(addUserCommand.command, addUserCommand.handler);

// Start the bot.
bot.api.deleteWebhook();
bot.start();
