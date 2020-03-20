module.exports = {
    name: 'stop',
    description: 'Stops any music playing.',
    execute(msg, args) {
        const bot = msg.client;
        bot.music.queue = [{stop:"stop"}];
        bot.music.dispatcher.end();
    }
}