//cardPagination.js
const { Events } = require('discord.js')
const { displayCard } = require('../logic/card/displayCard.js')
const { displayRule } = require('../logic/cr/rules.js')

// Handle button interactions
async function handleButtonInteraction(interaction) {

    const client = interaction.client;

    console.log(`Got interaction from: ${interaction.message.id}`)

    // Confirm the state exists for the interaction
    if(!client.messageStates.has(interaction.message.id)) { return }

    console.log(`Handling button interaction for message id: ${interaction.message.id}`);

    // Get the state for the current interaction
    const state = client.messageStates.get(interaction.message.id);

    console.log('-----------Interaction User----------')
    console.log(interaction.user);
    // console.log('-----------State Author----------------')
    // console.log(state.author)

    //Confirm that the user creating the interaction is the owner of the message
    if(interaction.user.id != state.author.id) { return }

    console.log("--------\nInteraction passed auth check\n---------")

    // Defer the update so interaction does not fail due to timeout
    await interaction.deferUpdate();


    try {

        const data = state.data;

        console.log(interaction.customId)

        // Handle next and previous card interactions
        switch(interaction.customId) {

            case 'nextCard':
                // Update currentIndex to show the next card
                state.currentIndex = (state.currentIndex + 1) % data.length;
                state.embed = null;
                displayCard(interaction, {}, client);
                break;
            
            case 'prevCard':
                // Update currentIndex to show the previous card
                state.currentIndex = (state.currentIndex - 1 + data.length) % data.length //Add length to handle negative numbers
                state.embed = null;
                displayCard(interaction, {}, client);
                break;
            
            case 'fullImage':
                //Show full image for a card
                state.embed = null;
                state.image = !state.image;
                displayCard(interaction, {}, client);
                break;

            case 'scrollDown': 
                //Scroll down a ruling
                state.currentIndex++;
                displayRule(interaction, client);
                break;
            
            case 'scrollUp':
                //Scroll up a ruling
                state.currentIndex--;
                displayRule(interaction, client);
                break;
            
            case 'close':
                //Delete the message
                client.messageStates.delete(interaction.message.id);
                interaction.message.delete();
                break;

        };

    } catch(e) {

        console.error(`Button handling failed. Error: ${e.stack}`)

    }
    
}

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        if(!interaction.isButton()) return;

        await handleButtonInteraction(interaction)

    }

}