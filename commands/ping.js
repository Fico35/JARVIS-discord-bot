module.exports = {
    name: 'ping',
    description: 'Responds with "Pong!"',
    execute(msg, args) {
        msg.channel.send('Pong!');
    }
}