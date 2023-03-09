import { Bot, Context, InlineKeyboard, SessionFlavor } from 'grammy';

// Define the shape of our session.
interface SessionData {
    url?: string;
  }
  
  // Flavor the context type to include sessions.
  type MyContext = Context & SessionFlavor<SessionData>;
const bot = new Bot<MyContext>(process.env.TelegramToken!);
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

export default checkUrlMiddleware;