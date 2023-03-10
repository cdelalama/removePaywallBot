# Remove Paywall Telegram Bot

The Remove Paywall Telegram Bot is a Telegram bot that helps you bypass paywalls by detecting URLs in messages and providing a button to remove the paywall. It also includes features such as user authentication and user statistics.

## Features

- Detects URLs in messages and provides a button to remove the paywall
- User authentication: only authorized users can use the bot
- User statistics: keeps track of the number of calls for each user and provides stats for admins
- Admin commands: includes commands to add and delete users and view user stats
- Help command: provides a list of available commands

## Installation

1. Clone this repository: `git clone https://github.com/username/Remove-Paywall-Telegram-Bot.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   - `TelegramToken`: your Telegram bot token
   - `BackendlessAppId`: your Backendless App ID
   - `BackendlessApiKey`: your Backendless API Key
   - `adminUserIds`: a comma-separated list of user IDs that should have admin privileges
4. Start the bot: `npm start`

## Usage

Once the bot is running and authorized in your Telegram account, you can start using it by sending a message with a URL. If the URL is detected, the bot will send a message with a button to remove the paywall. Only authorized users can use the bot, and admins have access to additional commands to manage users and view stats.

Available commands:

- `/adduser <username>`: adds a user to the authorized user list (admin only)
- `/deleteuser <username or ID>`: deletes a user from the authorized user list (admin only)
- `/stats`: displays user statistics (admin only)
- `/help`: displays available commands

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
