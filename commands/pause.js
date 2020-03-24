module.exports = {
    name: 'pause',
    description: 'Pauses playback.',
    async execute(msg, args) {
        let streamDispatcher = msg.client.music.dispatcher;
        if (streamDispatcher !== null) {
            if (!streamDispatcher.paused) {
                streamDispatcher.pause();
            } else {
                msg.channel.send("Playback is already paused.");
            }
        }
    }
}