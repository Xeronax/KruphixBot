const Scryfall = require('../utils/scry');
const styles = require("./styles").getStyles();
const { formatCard } = require('../utils/format');

let setData;
Scryfall.requestSets().then(data => {

    setData = data.map(set => {

        return {

            name: set.name,
            code: set.code,
            date: new Date(set.released_at),
            set_type: set.set_type,
            value: 0,

        }

    })

});

const chartTypeFunction = {

    //pie: createPieChart,
    scatter: createScatterDataset,

}

module.exports = {

    createDataSet: async function(chartType, data) {

        const promiseArray = [];
        const queries = data;

        for(let query of queries) {

            promiseArray.push(Scryfall.requestSearch(query.syntax).then(data => query.data = data).catch(error => { console.log(`No results found for ${query.syntax}`)}));

        }

        await Promise.all(promiseArray);

        for(let query of queries) {

            query.data = formatCard(query.data);

        }

        return chartTypeFunction[chartType](queries);

    }
}

function createScatterDataset(queryArray) {

    let dataConfig = {

        datasets: [],
        labels: []

    };

    let index = 0, minYear = 0, maxYear = 0;

    queryArray.forEach(query => {

        let data = [];
        const filteredDataset = query.data.filter(card => card.date.getTime() < Date.now());

        filteredDataset.forEach(card => {

            const indexOfPreexistingDataPoint = data.findIndex(dataPoint => dataPoint.x?.getTime() == new Date(card.date).getTime());
            if(indexOfPreexistingDataPoint < 0) {
    
                data.push({
    
                    x: new Date(card.date),
                    y: 1
    
                })
    
            } else {
    
                data[indexOfPreexistingDataPoint].y++;
    
            }

            if(minYear == 0) minYear = card.date.getFullYear();
            if(card.date.getFullYear() < minYear) minYear = card.date.getFullYear();
            if(card.date.getFullYear() > maxYear) maxYear = card.date.getFullYear();
    
        })

        data.push(...setData.filter(set => (
            set.date.getFullYear() >= minYear && 
            set.date.getFullYear() <= maxYear && 
            set.date.getTime() < Date.now() &&
            (set.set_type == "core" || set.set_type == "expansion") &&
            !data.some(dataPoint => set.date.getTime() === dataPoint.x.getTime()))).map(set => 
            {

                return {
                    x: set.date,
                    y: 0
                };

            })
        )

        data.sort((a, b) => a.x - b.x);

        const dataset = {

            label: query.name,
            data: data,
            borderColor: styles[index].borderColor,
            radius: styles[index].radius,
            
        }

        dataConfig.datasets.push(dataset);
        dataConfig.datasets.push({

            type: "line",
            label: `${dataset.label} Trend Line`,
            borderColor: dataset.borderColor,
            data: createBestFitLine(data),
            radius: 0,
            order: 1

        });

        index++;

        return dataset;

    });

    for(let i = minYear; i <= maxYear; i++) {

        dataConfig.labels.push(new Date(`${i}-01-01 00:00:00`));

    }

    return dataConfig;
    
}

function createBestFitLine(data) {

    let numEntries = data.length, sumX = 0, sumY = 0;
    const sumXY = () => {

        let sum = 0;
        data.forEach(coordinate => {sum += (coordinate.x.getTime() * coordinate.y)})

        return sum;

    }

    const sumXtimesSumY = () => {

        data.forEach(coordinate => { 
            sumX += (coordinate.x.getTime())
            sumY += (coordinate.y)
        });

        return sumX*sumY;
    }

    const sumXsquared = () => { 

        let sum = 0;

        data.forEach(coordinate => { sum += Math.pow(coordinate.x.getTime(), 2)});

        return sum;

    }

    const sumSquaredX = () => {

        let sum = 0;
        data.forEach(coordinate => { sum += coordinate.x.getTime()});
        return sum * sum;

    }

    const slope = ((numEntries * sumXY()) - sumXtimesSumY())/((numEntries * sumXsquared()) - sumSquaredX());
    //sumX and sumY depend on the above line running, probably garbage code but whatever
    const b = (sumY - (slope * sumX))/numEntries;

    const bestFitLine = data.map(coordinate => [coordinate.x, (coordinate.x * slope) + b]);

    return bestFitLine;

}

function CreatePieDataset(queryArray) {

    let dataConfig = {

        datasets: [],
        labels: []

    };

    let index = 0;

    function checkDuplicate(card) {

        
    }

    queryArray.forEach(query => {

        let data = [];

        query.forEach(card => {

            
        })
        const dataset = {

            label: query.name,
            data: data,
            borderColor: styles[index].borderColor,
            radius: styles[index].radius,
            
        }

        dataConfig.datasets.push(dataset);
        dataConfig.datasets.push({

            type: "line",
            label: `${dataset.label} Trend Line`,
            borderColor: dataset.borderColor,
            data: createBestFitLine(data),
            radius: 0,
            order: 1

        });

        index++;

        return dataset;

    });

    for(let i = minYear; i <= maxYear; i++) {

        dataConfig.labels.push(new Date(`${i}-01-01 00:00:00`));

    }

    return dataConfig;
    
}
