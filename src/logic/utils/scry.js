/*
    Scry.js — A script that helps handle requests in fifo order at a rate of 1 request per 100 ms
*/

const axios = require('axios')
const scryfallApi = 'https://api.scryfall.com'

const queue = [];

module.exports = {

    requestSearch: async function (input, page = 1) {

        return new Promise((resolve, reject) => {

            queue.push({

                query: input,
                currentPage: page,
                url: 'cards/search',
                resolve: resolve,
                reject: reject

            });

        });

    },

    requestSets: async function() {

        return new Promise((resolve, reject) => {

            queue.push({

                url:'sets',
                resolve: resolve,
                reject: reject

            })
        })

    }

}

setInterval( async () => {

    if(queue.length < 1) return;
    let request = queue.shift();

    let currentPage = request.currentPage;
    const allData = []

    try {

        const response = await axios.get(`${scryfallApi}/${request.url}`, {

            params: {

              q: request.query,
              page: currentPage ?? 1,

            },

        });

        allData.push(...response.data.data);

        if(response.data.has_more) {

            currentPage++;
            allData.push(...(await module.exports.requestSearch(request.query, currentPage)))

        }
        
        request.resolve(allData);

    } catch(error) {

        //console.error('An error occured while fetching the card: ', error);
        request.reject(error);
        
    };

}, 100);