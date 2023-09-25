
const { formatCard } = require('../utils/format');
const Scryfall = require('../utils/scry');
const { graph } = require('./scryChart.js');
const { createEmbed } = require("../utils/embed");
const { buildActionRow } = require("../utils/rowBuilder")

const normalizeString = "is:firstprinting -is:reprint -is:extra -is:promo -is:oversized game:paper (st:core or st:expansion)"

module.exports = {

    requestGraph: async function(interaction, client) {

        const constants = interaction.options.getString('constants');
        const independentVars = interaction.options.getString('independentvariables');
        const chartType = interaction.options.getString('charttype');
        const normalize = interaction.options.getBoolean('normalize') ?? true;
        const queriesAndNames = splitQuery(constants, independentVars, normalize);
        const promiseArray = [];

        for(let query of queriesAndNames) {

            promiseArray.push(Scryfall.requestSearch(query.syntax).then(data => query.data = data)).catch(error => { console.log(`No results found for ${query.syntax}`)});

        }

        await Promise.all(promiseArray);

        for(let query of queriesAndNames) {

            query.data = formatCard(query.data);
            console.log(`Length of ${query.name}: ${query.data.length}`);

        }

        let chartURL;
        try {

            chartURL = graph(chartType, queriesAndNames);
            const flags = { chart: true };
            const embed = await createEmbed(chartURL, flags);

            console.log(embed);
            
            interaction.reply({

                embeds: embed,
                components: [buildActionRow(0, flags)],
                fetchReply: true

            });

            const message = await interaction.fetchReply();

            const verbosityData = {

                url: chartURL,
                query: queriesAndNames

            }

            const state = client.stateHandler.createState(verbosityData, message);
            state.author = interaction?.user ?? null;

        } catch(error) {

            console.error(`${error.message}: ${error.stack}`);
            interaction.reply({
                
                embeds: createEmbed(null, { fail: true, chart: true }),
                ephemeral: true
                
            })
        } 

    }

}


function splitQuery(constants, independentVars, normalize) {

    independentVariableSplit = independentVars.split(/; ?/gi);

    const result = []

    for(let independentVariable of independentVariableSplit) {

        console.log(independentVariable)
        const input = {
            
            syntax: independentVariable.replace(/\[.*\]/g, ""),
            name: independentVariable.match(/\[.*\]/g)?.[0]?.replace(/[\[\]]/g, "") ?? independentVariable,

        }
        
        if(constants) input.syntax = `${input.syntax} ${constants}`;
        if(normalize) input.syntax = `${input.syntax} ${normalizeString}`;

        console.log(`Pushing ${input.name} and ${input.syntax}`);

        result.push(input);

    }

    return result;

}