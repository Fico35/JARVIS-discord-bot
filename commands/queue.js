module.exports = {
    name: 'queue',
    description: 'Shows the current queue of songs.',
    execute(msg, args) {
        var trackList = "```";
        for (var i in msg.client.music.queue) {
            trackList += `[${i}] - ${msg.client.music.queue[i].name}\n`;
        }
        if (trackList == "```") {
            trackList = "The queue is currently empty.";
        } else {
            trackList += "```";
        }
        msg.channel.send(trackList);
    }
}