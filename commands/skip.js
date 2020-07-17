module.exports = {
    name: 'skip',
    description: 'Skips the currently playing audio stream.',
    execute(msg, args) {
        const bot = msg.client;
        bot.music.dispatcher.end();
    }
}