/*
    displayCard.js
    This script wraps each function together to display the card to the user
*/
const { formatCard } = require('../utils/format.js');
const { createEmbed } = require('../utils/embed.js');
const { buildActionRow } = require('../utils/rowBuilder.js')

module.exports = {
    //A function to format and embed a card, then display it to the user
    displayCard: async function(interaction, { cardArray = null, flags = {} }, client) {

        let embed, message, row, state;

        let editingMessage = !Array.isArray(cardArray)
        if(!editingMessage) {

            const formattedCards = formatCard(cardArray);

            row = buildActionRow(cardArray.length, flags);
            flags.hits = cardArray.length;
            embed = await createEmbed(formattedCards[0], flags);

            await interaction.reply({

                embeds: embed,
                components: [row],
                fetchReply: true
                
            });
    
            message = await interaction.fetchReply();

            state = client.stateHandler.createState(formattedCards, message);
            state.author = interaction?.user ?? null;

        } else {

            state = client.stateHandler.get(interaction.message.id);
            flags.hits = state.data.length;
            embed = await createEmbed(state.data[state.currentIndex], flags);
            row = buildActionRow(state.hits, flags);

            await interaction.editReply({

                embeds: embed,
                components: [row],

            });

        }

    }

}