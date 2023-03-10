# Remove Paywall Telegram Bot

This is a Telegram bot that removes paywalls from articles posted by users. It works by detecting URLs in messages sent to the bot, and then retrieving the content of those pages using a headless browser (Puppeteer). If the page contains a paywall, the bot attempts to remove it and sends the content of the article back to the user.

## Features

- Detects URLs in messages sent to the bot
- Attempts to remove paywalls from the content
- Sends the content of the article back to the user
- Maintains a count of the number of times a user has called the bot
- Admin users can view stats about users and links pasted
- Admin users can add and delete authorized users

## Installation

1. Clone this repository
2. Install the required dependencies by running `npm install`
3. Create a `.env` file based on the provided `.env.example` file
4. Run the bot by executing `npm start`

## Usage

1. Start a chat with the bot by searching for it on Telegram
2. Send a message containing a URL
3. The bot will attempt to remove any paywall and send the content of the article back to you

## Commands

- `/help`: Shows a list of available commands
- `/stats`: Shows stats about users and links pasted (admin only)
- `/adduser`: Adds an authorized user to the "rpw_users" table (admin only)
- `/deleteuser`: Deletes an authorized user from the "rpw_users" table (admin only)

## Middleware

- `checkUrlMiddleware`: Middleware that detects URLs in messages sent to the bot and increments the user's number of calls
- `checkUserMiddleware`: Middleware that checks if the user is authorized to use the bot (admin only)
- `helpMiddleware`: Middleware that intercepts the `/help` command and displays a list of available commands

## Backendless Data Structure

The bot uses [Backendless](https://backendless.com/) to store user data. The data is stored in a table called "rpw_users" and has the following fields:

| Field           | Type    | Description                                    |
|----------------|---------|------------------------------------------------|
| objectId       | String  | Unique identifier for the object               |
| telegramId     | String  | Telegram ID of the user                        |
| telegramUsername | String  | Telegram username of the user                  |
| number_calls   | Integer | Number of times the user has called the bot     |
| isAdmin        | Boolean | Whether the user is an admin or not             |
| created        | Date    | Timestamp of when the object was created        |
| updated        | Date    | Timestamp of when the object was last updated   |

Note that telegramUsername is an optional field, since not all users may have a username associated with their account

## Technologies Used

- Node.js
- Telegram GrammY framework
- Backendless

## Contributing

If you find any bugs or have suggestions for new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
