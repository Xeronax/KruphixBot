/*
    /Card command, pull a card from Scryfall and display it for the user
*/
// Import required modules and components
const { SlashCommandBuilder } = require('discord.js')
const Scryfall = require("../../utils/scry.js");
const { displayCard } = require('../../utils/displayCard.js');

// Fetch card information from the Scryfall API
const fetchCard = async (query) => {
    return await Scryfall.searchName(query)
}
// Exported module
module.exports = {
    // Define slash command
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Finds a magic the gathering card with the specified name.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Insert the card name or Scryfall syntax you would like to search for')
                .setRequired(true)),

    // Define execute method which is called when slash command is used
    async execute(interaction) {

        const requestedName = interaction.options.getString('query');
        const cards = await fetchCard(requestedName);

        if(Array.isArray(cards)) {

            displayCard(interaction, {cardArray: cards, index: 0}, interaction.client);

        } else {

            await interaction.reply("No cards were found with those search parameters.")

        }
    },
}