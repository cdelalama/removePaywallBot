import { Bot, Middleware, Context, InlineKeyboard, session, SessionFlavor } from 'grammy';
import dotenv from 'dotenv';
dotenv.config();

// Define the shape of our session.
interface SessionData {
  url?: string;
}

// Flavor the context type to include sessions.
type MyContext = Context & SessionFlavor<SessionData>;

// Define a list of authorized users
const allowedUserIds = [process.env.carlosTelegramID, process.env.rocioTelegramID];

const bot = new Bot<MyContext>(process.env.TelegramToken!);

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
      const options = new InlineKeyboard().text('Remove Paywall', '1');
      await bot.api.sendMessage(ctx.chat.id, 'Url detected. Click button to remove paywall:', { reply_markup: options });
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
    // Modify the URL by appending "https://12ft.io/" to it
    const modifiedUrl = `https://12ft.io/${ctx.session.url.replace('www', 'amp')}`;
    await ctx.reply(`Paywall removed. Here's the URL: ${modifiedUrl}`);
    delete ctx.session.url; // Remove the URL from the session data
  } else {
    await ctx.reply('No URL was detected.');
  }
});

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome!! Up and running.'));

// Handle other messages.
bot.on('message', async (ctx) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (!urlRegex.test(ctx.message?.text || '')) {
    await ctx.reply('Got another message!');
  }
});

// Start the bot.
bot.start();
