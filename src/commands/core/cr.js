/*
    /cr command, pull a ruling from AcademyRuins and display it for the user
*/
// Import required modules and components
const { SlashCommandBuilder } = require('discord.js')
const { displayRule } = require('../../logic/cr/rules.js')


module.exports = {


    data: new SlashCommandBuilder()
        .setName('cr')
        .setDescription('Finds a Magic the Gathering ruling.')
        .addStringOption(option =>
            option
                .setName('rule')
                .setDescription('Insert the ruling you would like to search for')
                .setRequired(true)),


        async execute(interaction) {

            await displayRule(interaction, interaction.client);
            
    }

}