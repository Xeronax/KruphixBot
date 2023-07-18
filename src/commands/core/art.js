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
            const cards = await Scryfall.requestSearch(requestedName);
    
            if(Array.isArray(cards)) {
    
                displayCard(interaction, { cardArray: cards,  flags: { imageCrop: true }  }, interaction.client);
    
            } else {
    
                await interaction.reply("No cards were found with those search parameters.")
    
            }

        }
        
}