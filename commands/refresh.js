module.exports = {
    name: 'refresh',
    description: 'Refreshes the bot config, commands and logs in again.',
    execute(msg, args) {
        var bot = msg.client;
        // reload config
        bot.config = require('../config.json');
        const fs = require('fs');
        const Discord = require('discord.js');
        // read and set up commands
        bot.commands = new Discord.Collection();
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            bot.commands.set(command.name, command);
        }
        // re-log
        //bot.login(bot.config.token);
    }
}