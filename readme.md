Remove Paywall Telegram Bot
The Remove Paywall Telegram Bot is a bot that helps users bypass paywalls on news websites by detecting URLs in messages and providing a button to remove the paywall. The bot also provides stats about the number of times each user has used the bot.

Features
Automatically detects URLs in messages and provides a button to remove the paywall
Keeps track of the number of times each user has used the bot
Provides stats about the number of times each user has used the bot
Getting Started
To use the Remove Paywall Telegram Bot, follow these steps:

Clone the repository: git clone https://github.com/your-username/remove-paywall-telegram-bot.git
Install the dependencies: npm install
Create a .env file and add your Telegram bot token, Backendless app ID, and Backendless API key:
makefile
Copy code
TelegramToken=<your-telegram-bot-token>
BackendlessAppId=<your-backendless-app-id>
BackendlessApiKey=<your-backendless-api-key>
Start the bot: npm start
Commands
The following commands are available:

/start: Start the bot
/help: Show available commands
/adduser <username>: Add a user to the database (admin only)
/deleteuser <username or ID>: Delete a user from the database (admin only)
/stats: Show stats about users and links pasted (admin only)
Middleware
The following middleware functions are available:

checkUrlMiddleware: Checks if a message contains a URL and provides a button to remove the paywall
checkUserMiddleware: Checks if a user is authorized to use the bot (admin only)
helpMiddleware: Shows available commands when a user sends the /help command
Contributing
Contributions are welcome! Please read the contributing guidelines for more information.

License
This project is licensed under the MIT License.