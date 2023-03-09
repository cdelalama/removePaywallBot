import { Middleware, Context } from 'grammy';

// Define a list of authorized users
const allowedUserIds = [process.env.carlosTelegramID, process.env.rocioTelegramID, process.env.rodrigoTelegramID, process.env.eliTelegramID];

export const checkUserMiddleware: Middleware<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;
  if (userId && allowedUserIds.includes(userId.toString())) {
    // User is allowed, continue to the next middleware
    await next();
  } else {
    // User is not allowed, send an error message and do not continue
    await ctx.reply('Sorry, you are not authorized to use this bot.');
  }
};