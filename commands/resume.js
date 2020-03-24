module.exports = {
    name: 'resume',
    description: 'Resumes playback (if it is paused).',
    async execute(msg, args) {
        let streamDispatcher = msg.client.music.dispatcher;
        if (streamDispatcher !== null) {
            if (streamDispatcher.paused) {
                streamDispatcher.resume();
            } else {
                msg.channel.send("Playback is not paused.");
            }
        }
    }
}