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
const { createDataSet } = require('./createDataset');

const chartTypeFunction = {

    //pie: createPieChart,
    scatter: createScatterPlot,

}

module.exports = {

    graph: async function(chartType, dataset) {

        const path = await chartTypeFunction[chartType](dataset);
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



async function createScatterPlot(dataset) {

    const data = await createDataSet('scatter', dataset);
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
                    beginAtZero: true,
                },
            },
        },
        plugins: [plugin],  
    });

    const image = canvas.toBuffer();
    const name = `chart_${Math.random() * Math.pow(10, 17)}.png`;
    fs.writeFileSync(`./src/imageDump/${name}`, image);

    setTimeout(() => {

        fs.unlink(`./src/imageDump/${name}`, error => { console.error(error) });

    }, 1800000)

    return name;

}
