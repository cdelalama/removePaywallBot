import { Middleware } from 'grammy';
import { MyContext } from '../types/types';
import { addUserCommand } from './addUser';
import { isAdmin } from '../utils/utils';
import { statsCommand } from './stats';
import { deleteUserCommand } from './deleteUser';

export const helpCommand = {
  command: 'help',
  handler: async (ctx: MyContext) => {
    const commands = [
      { name: addUserCommand.command, isAdmin: true },
      { name: statsCommand.command, isAdmin: true },
      { name: deleteUserCommand.command, isAdmin: true },
      // add more commands as needed
    ];

    const message = commands.reduce((acc, command) => {
      acc += `/${command.name} ${command.isAdmin ? '(admin only)' : ''}\n`;
      return acc;
    }, 'Available commands:\n\n');

    if (ctx.chat) {
        await ctx.api.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
      } else {
        console.log('Error: chat is undefined');
      }
        },
};

export const helpMiddleware: Middleware<MyContext> = async (ctx, next) => {
  if (ctx.message?.text === '/help') {
    await helpCommand.handler(ctx);
  } else {
    await next();
  }
};
