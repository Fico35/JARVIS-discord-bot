const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.config = require('./config.json');
bot.activeConnection = null;
bot.music = {
    dispatcher: null,
    queue: []
};

// read and set up commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (!msg.content.startsWith(bot.config.prefix) || msg.author.bot) {
        // ignore messages without command prefix and from bots
        return;
    }

    const args = msg.content.slice(bot.config.prefix.length).split(/ +/); // temp solution, add suppot for ""
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) {
        msg.channel.send(`Unknown command. Try ${bot.config.prefix}help`);
        return;
    }

    try {
        bot.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.channel.send(`There was an error trying to execute "${msg.content}"`);
    }
});

bot.login(bot.config.token);