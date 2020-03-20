const ytdl = require('ytdl-core');
const ytse = require('youtube-search');

module.exports = {
    name: 'play',
    description: 'Plays a You Tube video.',
    async execute(msg, args) {
        if (msg.member.voiceChannel) {
            var bot = msg.client;
            var url = "";
            if (args[0].startsWith("http://") || args[0].startsWith("https://")) {
                url = args[0];
            } else {
                var searchWord = args.join(' ');
                const APIresult = await ytse(searchWord, {maxResults: 1, key: bot.config.ytApiKey, type:"video"}).catch(console.error);
                if (APIresult != null) {
                    url = APIresult.results[0].link;
                } else {
                    msg.channel.send(`There has been an error while searching for the video. See console for error information.`);
                    return;
                }
            }
            
            if (ytdl.validateURL(url)) {
                // video exists and link is valid
                if (bot.activeConnection === null) {
                    bot.activeConnection = await msg.member.voiceChannel.join().catch(console.error);
                }
                const trackInfo = await ytdl.getBasicInfo(url).catch(console.error);
                // save track to queue
                bot.music.queue.push({name:trackInfo.title, url:url});
                if (bot.music.dispatcher === null) {
                    // start audio playback
                    bot.music.dispatcher = bot.activeConnection.playStream(ytdl(url, {quality:"highestaudio", filter:"audioonly"}));
                    bot.music.dispatcher.on("end", function() {endOfTrack(bot);});
                }
            } else {
                // invalid link
                msg.channel.send(`Link "${url}" is not valid.`);
                return;
            }
        } else {
            // user who sent message is not in a voice channel
            msg.channel.send(`You need to join a voice channel first!`);
            return;
        }
    }
}

function endOfTrack(bot) {
    bot.music.queue.shift(); // remove current track from queue
    if (bot.music.queue.length > 0) {
        bot.music.dispatcher = bot.activeConnection.playStream(ytdl(bot.music.queue[0].url, {quality:"highestaudio", filter:"audioonly"}));
        bot.music.dispatcher.on("end", function() {endOfTrack(bot);});
    } else {
        // queue is empty
        bot.music.dispatcher = null;
        bot.activeConnection.disconnect();
        bot.activeConnection = null;
    }
}