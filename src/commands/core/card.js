/*
    /Card command, pull a card from Scryfall and display it for the user
*/
const { SlashCommandBuilder } = require('discord.js')
const { requestSearch } = require("../../logic/utils/scry.js");
const { displayCard } = require('../../logic/card/displayCard.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Finds a Magic the Gathering card with the specified name or Scryfall syntax.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Insert the card name or Scryfall syntax you would like to search for.')
                .setRequired(true)),

    async execute(interaction) {

        let response, requestedName;

        try {

            requestedName = interaction.options.getString('query');
            response = await requestSearch(requestedName);
            //console.log(response);
    
            displayCard(interaction, { cardArray: response }, interaction.client);

        } catch(err) {

            displayCard(interaction, { cardArray: err.response ?? null, flags: { fail: true } }, interaction.client)

        }

    },

}