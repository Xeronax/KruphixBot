/*
    displayCard.js
    This script is a wrapper function for format.js and cardEmbed.js to make code a lil cleaner
*/

const { formatCard } = require('../utils/format.js');
const { embedCard } = require('../utils/cardEmbed.js');



module.exports = {

    displayCard: async function(cardArray, index) {

        const formattedCard = formatCard(cardArray, index);
        return embedCard(formattedCard);
        
    }

}