//cardPagination.js
const { Events } = require('discord.js')


    // // Handle button interactions
    // handleButtonInteraction: async function(interaction) {
    //     // Confirm the state exists for the interaction
    //     if(!messageStates.has(interaction.message.id)) { return }

    //     // Defer the update so interaction does not fail due to timeout
    //     await interaction.deferUpdate();

    //     console.log(`Handling button interaction for message id: ${interaction.message.id}`);

    //     // Get the state for the current interaction
    //     const state = getState(interaction.message.id);

    //     try {
    //         const cards = state.cards;

    //         // Handle next and previous card interactions
    //         switch(interaction.customId) {
    //             case 'nextCard':
    //                 // Update currentIndex to show the next card
    //                 state.currentIndex = (state.currentIndex + 1) % cards.length;
    //                 break;
                
    //             case 'prevCard':
    //                 // Update currentIndex to show the previous card
    //                 state.currentIndex = (state.currentIndex - 1 + cards.length) % cards.length //Add length to handle negative numbers
    //                 break;
    //         };

    //         const formattedCard = formatCard(cards, state.currentIndex);
    //         const embeddedCard = embedCard(formattedCard)
    //         // Update the reply with the current card information
    //         interaction.editReply({

    //             embeds: embeddedCard

    //         })
    //     } catch(e) {
    //         console.error(`Button handling failed. Error: ${e.stack}`)
    //     }
    // }


module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        if(!interaction.isButton()) return;

        await handleButtonInteraction(interaction)

    }
}