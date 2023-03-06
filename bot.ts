import { Bot , Middleware, Context, Keyboard, InlineKeyboard,session, SessionFlavor } from "grammy";
//import { Session } from 'grammy/out/platform';

import dotenv from 'dotenv';
import validUrl from 'valid-url';
dotenv.config();

 

const apiToken = process.env.TelegramToken;
const carlosTelegramID= process.env.carlosTelegramID;
try {
    // Define the shape of our session.
    interface SessionData {
      url?: string;
    }
  
    // Flavor the context type to include sessions.
    type MyContext = Context & SessionFlavor<SessionData>;
  
    // Define a list of authorized users
    const allowedUserIds = [carlosTelegramID];
  
    const bot = new Bot<MyContext>(apiToken!);
  
// Define the shape of our session.
interface SessionData {
    url?: string;
  }
  
  // Define the initial session value.
  function initial(): SessionData {
    return { url: undefined };
  }
  
  // Install session middleware with the initial session value.
  bot.use(session({ initial }));
  
  
    // Create a middleware function that checks if the user ID is in the allowed list
    const checkUserMiddleware: Middleware<Context> = async (ctx, next) => {
      const userId = ctx.from?.id;
      if (userId && allowedUserIds.includes(userId.toString())) {
        // User is allowed, continue to the next middleware
        await next();
      } else {
        // User is not allowed, send an error message and do not continue
        await ctx.reply('Sorry, you are not authorized to use this bot.');
      }
    };
    bot.use(checkUserMiddleware);
  
    // Create a middleware function that checks if the user's message contains a URL
    const checkUrlMiddleware = async (ctx: MyContext, next: () => Promise<void>) => {
      if (ctx && ctx.chat && ctx.message && ctx.message.text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlMatches = urlRegex.exec(ctx.message.text);
        if (urlMatches) {
          ctx.session.url = urlMatches[0];
          const options = new InlineKeyboard().text('Option 1', '1').text('Option 2', '2');
          await bot.api.sendMessage(ctx.chat.id, 'Select an option:', { reply_markup: options });
          return;
        }
      }
      await next();
    };
  
    // Add the middleware function to the bot
    bot.use(checkUrlMiddleware);
  
    // Handle the callback query for the "1" button
    bot.on('callback_query:data', async (ctx) => {
      if (ctx.session.url) {
        await ctx.reply(`You selected Option 1 with URL: ${ctx.session.url}`);
        delete ctx.session.url; // Remove the URL from the session data
      } else {
        await ctx.reply('No URL was detected.');
      }
    });
  
    // Handle the /start command.
    bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
  
    // Handle other messages.
    bot.on('message', async (ctx) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (!urlRegex.test(ctx.message?.text || '')) {
        await ctx.reply('Got another message!');
      }
    });
  
    // Start the bot.
    bot.start();
  } catch (error) {
    console.error(error);
  }
  