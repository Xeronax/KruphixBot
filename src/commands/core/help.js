const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises

let helpMessage = '';
fs.readFile('./src/logic/help.txt', 'utf-8')
    .then(content => {

        helpMessage = content;

    })
    .catch(error => {

        console.error(`Error reading help text: ${error.message}\n${error.stack}`);

    })

module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a comprehensive list of Kruphix Bot\'s features.'),
    
    async execute(interaction) {

        await interaction.reply({

            content: helpMessage,
            ephemeral: true,

        });

    }

}

