/**
scryChart.js
This script handles the creation of charts and the handling of datasets thereof
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { createCanvas } = require('canvas');
const { getImage } = require('../../server');
const { Chart } = require('chart.js/auto');
const dateFns = require('chartjs-adapter-date-fns');
const Scryfall = require('../utils/scry');
const { getStyles } = require('./styles');

const chartTypeFunction = {

    //pie: createPieChart,
    scatter: createScatterPlot,

}

module.exports = {

    graph: function(chartType, dataset) {

        const path = chartTypeFunction[chartType](dataset);
        return getImage(path);

    }
    
}

const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
};

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

})


function createScatterPlot(dataset) {

    const data = createScatterDataset(dataset);
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {

        type:"scatter",
        data: {
            labels: data.labels,
            datasets: data.datasets,
        },
        options: {
            plugins: {
                customCanvasBackgroundColor: {
                    color: 'white',
                }
            },
            scales: {
                x: {
                    adapters: {
                        date: dateFns
                    },
                    type: 'time',
                    time: {
                        unit: 'year'
                    },

                },
                y: {
                    type: 'linear',
                },
            },
        },
        plugins: [plugin],  
    });


    console.log('Making image');
    const image = canvas.toBuffer();
    console.log('Writing image');

    const name = `chart_${Math.random()}.png`;
    fs.writeFileSync(`./src/imageDump/${name}`, image);

    setInterval(() => {

        fs.unlink(`./src/imageDump/${name}`, error => { });

    }, 600000)

    return name;

}

function createScatterDataset(queryArray) {

    const styles = getStyles();

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

    //console.log(dataConfig);

    return dataConfig;
    
}

function createBestFitLine(data) {

    let numEntries = data.length, sumX = 0, sumY = 0;
    const sumXY = () => {

        let sum = 0;
        data.forEach(coordinate => {sum += (coordinate.x.getTime() * coordinate.y)})

        return sum;

    }

    console.log(`sumXY: ${sumXY}`);

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
    const b = (sumY - (slope * sumX))/numEntries;

    const bestFitLine = data.map(coordinate => [coordinate.x, (coordinate.x * slope) + b]);

    console.log(`Slope: ${slope}\nb: ${b}`);

    console.log(bestFitLine);

    return bestFitLine;

}