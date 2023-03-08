import { Middleware, InlineKeyboard, SessionFlavor } from 'grammy';
import { MyContext, SessionData } from '../types';

export const checkUrlMiddleware: Middleware<MyContext & SessionFlavor<SessionData>> = async (ctx, next) => {
  if (ctx && ctx.chat && ctx.message && ctx.message.text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatches = urlRegex.exec(ctx.message.text);
    if (urlMatches) {
      ctx.session.url = urlMatches[0];
      const options = new InlineKeyboard().text('Remove Paywall', '1');
      await ctx.api.sendMessage(ctx.chat.id, 'Url detected. Click button to remove paywall:', { reply_markup: options });
      return;
    }
  }
  await next();
};
