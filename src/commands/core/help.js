const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs')

const helpMessage = fs.readFile('../../logic/help.txt').then(result => {

    return result;

})

module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a comprehensive list of Kruphix Bot\'s commands.'),
    
    async execute(interaction) {

        interaction.user.send(helpMessage);

    }

}

