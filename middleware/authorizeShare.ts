import { Middleware } from 'grammy';
import Backendless from 'backendless';
import { MyContext } from '../types/types';

// Initialize Backendless
Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

const authorizeShareMiddleware: Middleware<MyContext> = async (ctx, next) => {
  const isAuthorized = ctx.from?.username === 'cdelalama'; // Only allow authorized user to share messages
  const isForwarded = !!ctx.message?.forward_from; // Check if the message is a forwarded message

  if (isAuthorized && isForwarded) {
    const forwardedFrom = ctx.message?.forward_from;

    if (forwardedFrom) {
      try {
        // Retrieve the username and ID of the forwarded message owner
        let userId: string;
        let username: string | undefined;

        if (forwardedFrom.id) {
          // Get user ID from the forwarded message owner
          userId = forwardedFrom.id.toString();
        } else if (forwardedFrom.username) {
          // Get user ID from the forwarded message owner's username
          const userInfo = await ctx.api.getChat(forwardedFrom.username);
          userId = userInfo.id.toString();
        } else {
          throw new Error('User ID not found');
        }

        if (forwardedFrom.username) {
          // Get username from the forwarded message owner's username
          username = forwardedFrom.username;
        } else {
          // Get username from the chat info
          const chatId = ctx.chat?.id;
          if (typeof chatId === 'string' || typeof chatId === 'number') {
            const chatMember = await ctx.api.getChatMember(chatId, forwardedFrom.id);
            username = chatMember.user.username;
          } else {
            throw new Error('Invalid chat ID');
          }
        }

        // Save the user's information to the Backendless "rpw_users" table
        const rpwUser = {
          telegramId: userId,
          telegramUsername: username,
        };
        await Backendless.Data.of('rpw_users').save(rpwUser);

        // Send a confirmation message to the user
        await ctx.reply(`User ${username} (ID: ${userId}) added to the "rpw_users" table.`);
      } catch (error) {
        console.error(`Error adding user: ${error}`);
        await ctx.reply('Sorry, there was an error adding the user.');
      }
    }
  } else {
    await next();
  }
};

export default authorizeShareMiddleware;
