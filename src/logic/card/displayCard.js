/*
    displayCard.js
    This script is a wrapper function for format.js and cardEmbed.js to make code a lil cleaner
*/
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow } = require('discord.js')
const { formatCard } = require('../utils/format.js');
const { createEmbed } = require('../utils/embed.js');

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

    let imageButton = new ButtonBuilder()
        .setCustomId('fullImage')
        .setStyle(ButtonStyle.Secondary)

    if(!flags.image){

        imageButton.setEmoji('🔍');

    } else {

        imageButton.setEmoji('📄');

    }

    row.addComponents(imageButton)

    row.addComponents(
        new ButtonBuilder()
            .setCustomId('close')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Secondary)
    )
 

    return row; 
    
}

module.exports = {

    displayCard: async function(interaction, { cardArray = null, flags = {} }, client) {

        if(Array.isArray(cardArray)) {

            const formattedCards = formatCard(cardArray);
            const row = buildActionRow(cardArray.length);

            const statePackage = client.createState(formattedCards);
            statePackage.state.hits = cardArray.length;
            statePackage.state.embed = createEmbed(formattedCards[index], { hits: statePackage.state.hits });

            await interaction.reply({

                embeds: statePackage.state.embed,
                components: [row],
                fetchReply: true
                
            });
    
            statePackage.state.message = await interaction.fetchReply();

            let newStatePackage = client.replaceState(statePackage.tempID);
            newStatePackage.state.author = interaction?.user ?? null;

        } else {

            const state = client.messageStates.get(interaction.message.id);
            let row;
            
            if(state.image) {

                state.embed = createEmbed(state.data[state.currentIndex], { hits: state.hits, image: true });
                row = buildActionRow(state.data.length, { image: true });

            } else {

                state.embed = state.embed ?? createEmbed(state.data[state.currentIndex], { hits: state.hits });
                row = buildActionRow(state.data.length);

            }

            await interaction.editReply({

                embeds: state.embed,
                components: [row],

            });

        }

    }

}