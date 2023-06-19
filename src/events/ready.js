const { Events } = require('discord.js');

module.exports = {

    name: Events.ClientReady,

    async execute(client) {

        console.log(`Logged in as ${client.user.tag}`)
        
    }
}