/*
    Scry.js — A script that helps handle requests in fifo order at a rate of 1 request per 100 ms
*/

const axios = require('axios')
const scryfallApi = 'https://api.scryfall.com'

const queue = [];

module.exports = {

    requestSearch: async function (input) {

        return new Promise((resolve, reject) => {

            queue.push({

                query: input,
                resolve: resolve,
                reject: reject

            });

        });

    }

}

setInterval( async () => {

    let request = queue.shift();
    if(!request) return;

    try {

        const response = await axios.get(`${scryfallApi}/cards/search`, {
            params: {

              q: request.query,

            },
        });
        
        if(response.data.data) {

            request.resolve(response.data.data);

        } else {

            request.reject(new Error("Scryfall found no results matching that query."));

        }

    } catch(error) {

        console.error('An error occured while fetching the card: ', error);
        
    };

}, 100);