/*
    /Card command, pull a card from Scryfall and display it for the user
*/
// Import required modules and components
const { SlashCommandBuilder } = require('discord.js')
const Scryfall = require("../../logic/utils/scry.js");
const { displayCard } = require('../../logic/card/displayCard.js');

// Exported module
module.exports = {

    // Define slash command
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Finds a Magic the Gathering card with the specified name or Scryfall syntax.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Insert the card name or Scryfall syntax you would like to search for')
                .setRequired(true)),

    // Define execute method which is called when slash command is used
    async execute(interaction) {

        const requestedName = interaction.options.getString('query');
        const cards = await Scryfall.requestSearch(requestedName);

        if(Array.isArray(cards)) {

            displayCard(interaction, { cardArray: cards }, interaction.client);

        } else {

            await interaction.reply("No cards were found with those search parameters.")

        }

    },

}