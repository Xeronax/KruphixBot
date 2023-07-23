const { SlashCommandBuilder } = require('discord.js')
const { requestSearch } = require("../../logic/utils/scry.js");
const { displayCard } = require('../../logic/card/displayCard.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription('Find various prices for cards.')
        .addUserOption(option => 
            option
                .setName('query')
                .setDescription('The card you want the price of')
                .setRequired(true)

        ),

    async execute(interaction) {

        let response, requestedName;

        try {

            requestedName = interaction.options.getString('query');
            response = await requestSearch(requestedName);
            //console.log(response);
    
            displayCard(interaction, { cardArray: response, flags: { price: true } }, interaction.client);

        } catch(err) {

            displayCard(interaction, { cardArray: err.response ?? null, flags: { fail: true, price: true } }, interaction.client)

        }

    }
    
}