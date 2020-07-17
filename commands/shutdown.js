module.exports = {
    name: 'shutdown',
    description: 'Shut down the bot.',
    execute(msg, args) {
        console.log(`Shut down by command from ${msg.member.user.tag}.`);
        msg.client.destroy();
    }
}