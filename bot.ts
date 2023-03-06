import { Bot , Middleware, Context} from "grammy";
import dotenv from 'dotenv'
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

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();