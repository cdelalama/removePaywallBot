import { Bot , Middleware, Context, Keyboard, InlineKeyboard,} from "grammy";
import dotenv from 'dotenv';
import validUrl from 'valid-url';
dotenv.config();

 

const apiToken = process.env.TelegramToken;
const carlosTelegramID= process.env.carlosTelegramID;

// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot(apiToken!); // <-- put your authentication token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Define a list of authorized users
const allowedUserIds = [carlosTelegramID];

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

/*

// Define a command handler that sends a message with a button
bot.command('url', async (ctx?: Context) => {
    if (ctx && ctx.chat) { // Add a type guard to check if ctx and ctx.chat are defined
      const replyMarkup = {
        keyboard: [
          [{ text: 'Enter URL', request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      };
      await bot.api.sendMessage(ctx.chat.id, 'Click the button to enter a URL:', {
        reply_markup: replyMarkup
      });
    }
  });
*/
// Define a middleware function that checks if the user's message contains a URL
const checkUrlMiddleware = async (ctx: Context, next: () => Promise<void>) => {
    if (ctx && ctx.chat && ctx.message && ctx.message.text) { // Add a type guard to check if ctx and its properties are defined
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (urlRegex.test(ctx.message.text)) {
        const options = new InlineKeyboard().text('Option 1', '1').text('Option 2', '2');
        await bot.api.sendMessage(ctx.chat.id, 'Select an option:', { reply_markup: options });
      }
    }
    await next();
  };
  
  // Add the middleware function to the bot
  bot.use(checkUrlMiddleware);
  


// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();