/*
    displayCard.js
    This script is a wrapper function for format.js and cardEmbed.js to make code a lil cleaner
*/
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow } = require('discord.js')
const { formatCard } = require('../utils/format.js');
const { embedCard } = require('../utils/cardEmbed.js');


// Build action row for card navigation
const buildActionRow = (len, flags = {}) => {
    
    let row = new ActionRowBuilder()

    if(len > 1) {
        row
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevCard')
                .setLabel('<-')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextCard')
                .setLabel('->')
                .setStyle(ButtonStyle.Secondary)
        )

    }

    row.addComponents(

        new ButtonBuilder()
            .setCustomId('fullImage')
            .setEmoji('🔍')
            .setStyle(ButtonStyle.Secondary)

    )

    return row; 
    
}

module.exports = {

    displayCard: async function(interaction, { cardArray = null, index = 0, flags = {} }, client) {

        if(Array.isArray(cardArray)) {

            const formattedCards = formatCard(cardArray);
            const row = buildActionRow(cardArray.length);

            const mappedState = client.createState(formattedCards);
            mappedState.hits = cardArray.length;
            mappedState.state.embed = embedCard(formattedCards[index], { hits: mappedState.state.hits });

            await interaction.reply({

                embeds: mappedState.state.embed,
                components: [row],
                fetchReply: true
                
            });
    
            let msg = await interaction.fetchReply();
            client.replaceState(mappedState.tempID, msg.id)

        } else {

            const mappedState = client.messageStates.get(interaction.message.id);
            const row = buildActionRow(mappedState.cards.length);
            
            if(mappedState.image) {

                mappedState.embed = embedCard(mappedState.cards[mappedState.currentIndex], { hits: mappedState.hits, image: true });

            } else {

                //Create a new embed if there isn't one (nextCard/prevCard)
                mappedState.embed = mappedState.embed ?? embedCard(mappedState.cards[mappedState.currentIndex], { hits: mappedState.hits });

            }

            await interaction.editReply({

                embeds: mappedState.embed,
                components: [row],

            });

        }

    }

}