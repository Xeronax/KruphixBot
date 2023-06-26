const axios = require('axios')
const scryfallApi = 'https://api.scryfall.com'

module.exports = {

    searchName: async function (query) {

        try {

            const response = await axios.get(`${scryfallApi}/cards/search`, {
                params: {

                  q: query,

                },
            });
            
            return response.data.data;

        } catch(error) {

            console.error('An error occured while fetching the card: ', error);
            return null
            
        };
    
    }

}


