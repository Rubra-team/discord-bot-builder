const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

let bot = null;

function startBot(configPath) {
    if (!fs.existsSync(configPath)) {
        throw new Error("Configuration file not found");
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const { prefix, token } = config;

    if (!prefix || !token) {
        throw new Error("Invalid configuration file");
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });

    client.on('messageCreate', message => {
        if (message.content === `${prefix}hello`) {
            message.channel.send(`Hello! My prefix is ${prefix}`);
        }
    });

    client.login(token).catch(err => {
        console.error('Failed to login:', err);
    });

    bot = client;
}

function stopBot() {
    if (bot) {
        bot.destroy();
        bot = null;
        console.log('Bot stopped');
    }
}


module.exports = { startBot, stopBot };
