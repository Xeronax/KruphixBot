const { SlashCommandBuilder } = require('discord.js');
const Scryfall = require('../../logic/utils/scry');
const { displayCard } = require('../../logic/card/displayCard')

module.exports = {

    data: new SlashCommandBuilder()
            .setName('art')
            .setDescription('Displays full art for the requested card')
            .addStringOption(option => 
                option
                    .setName('query')
                    .setDescription('Insert the card name or Scryfall syntax you would like to search for')
                    .setRequired(true)
            ),


        async execute(interaction) {

            const requestedName = interaction.options.getString('query');
    
            try {

                const cards = await Scryfall.requestSearch(requestedName);
    
                displayCard(interaction, { cardArray: cards,  flags: { imageCrop: true }  }, interaction.client);
    
            } catch(err) {

                displayCard(interaction, { cardArray: err.response ?? null, flags: { fail: true, imageCrop: true } }, interaction.client)
    
            }

        }
        
}