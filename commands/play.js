const ytdl = require('ytdl-core');
const ytse = require('youtube-search');

module.exports = {
    name: 'play',
    description: 'Plays a You Tube video.',
    async execute(msg, args) {
        if (!msg.member.voiceChannel) {
            // user who sent message is not in a voice channel
            msg.channel.send(`You need to join a voice channel first!`);
            return;
        }

        var bot = msg.client;
        var url = "";
        if (args[0].startsWith("http://") || args[0].startsWith("https://")) {
            url = args[0];
            if (!ytdl.validateURL(url)) {
                // invalid link
                msg.channel.send(`Link "${url}" is not a valid video link.`);
                return;
            }
        } else {
            var searchWord = args.join(' ');
            const APIresult = await ytse(searchWord, {maxResults: 1, key: bot.config.ytApiKey, type:"video"}).catch(console.error);
            if (APIresult != null) {
                url = APIresult.results[0].link;
            } else {
                msg.channel.send(`There has been an error while searching for the video.`);
                return;
            }
        }
        
        // video exists and link is valid
        if (bot.activeConnection === null) {
            // bot is not connected to any channel
            bot.activeConnection = await msg.member.voiceChannel.join().catch(console.error);
        } else {
            // bot is connected to a channel
            if (bot.timeouts.disconnect != null) {
                // the timer for disconnecting is running
                clearTimeout(bot.timeouts.disconnect);  // stop timer
                bot.timeouts.disconnect = null; // clear reference to timer
            }
        }
        const trackInfo = await ytdl.getBasicInfo(url).catch(console.error);    // get track info
        // save track to queue
        bot.music.queue.push({name:trackInfo.title, url:url});
        if (bot.music.dispatcher === null) {
            // start audio playback
            bot.music.dispatcher = bot.activeConnection.playStream(ytdl(url, {quality:"highestaudio", filter:"audioonly", highWaterMark: 1<<25}));
            bot.user.setActivity(trackInfo.title);
            bot.music.dispatcher.on("end", function() {endOfTrack(bot);});
        }
    }
}

function endOfTrack(bot) {
    bot.music.queue.shift(); // remove current track from queue
    if (bot.music.queue.length > 0) {
        delete bot.music.dispatcher;
        bot.music.dispatcher = bot.activeConnection.playStream(ytdl(bot.music.queue[0].url, {quality:"highestaudio", filter:"audioonly", highWaterMark: 1<<25}));
        bot.user.setActivity(bot.music.queue[0].name);
        bot.music.dispatcher.on("end", function() {endOfTrack(bot);});
    } else {
        // queue is empty
        bot.music.dispatcher = null;
        bot.user.setActivity("");
        // set timer to disconnect
        bot.timeouts.disconnect = setTimeout(function() {
            bot.activeConnection.disconnect();
            delete bot.activeConnection;
            bot.activeConnection = null;
            bot.timeouts.disconnect = null;
        }, bot.config.voiceTimeout);
    }
}