/*
    mergeDfc.js — A script to merge the front and back faces of a double-faced card into a single image
*/
const mergeImages = require('merge-images');
const axios = require('axios');
const fs = require('fs');
const { Canvas, Image } = require('canvas');
const { getImage } = require('../../server')


module.exports = {

    merge: async function(front, back) {

        const frontPath = await downloadImage(front.imageUrl, front.name);
        const backPath = await downloadImage(back.imageUrl, back.name);

        return await mergeFaces(frontPath, backPath);

    }

}

async function downloadImage(url, cardName) {

    const filePath = `./src/imageDump/${cardName.replace(/ /g, '_')}.png`;

    const response = await axios({

        method: 'GET',
        url: url,
        responseType: 'stream'

    })
        
    if(response.status != 200) return null;

    return new Promise((resolve, reject) => {

        response.data.pipe(fs.createWriteStream(filePath))
        .on('finish', () => {

            console.log("Image downloaded successfully.");

            resolve(filePath);

        })
        .on('error', err => {

            console.error(`${err.message}\n${err.stack}`);

            reject(err);

        })

    })

}

async function mergeFaces( frontPath, backPath ) {

    return mergeImages([ 

        { src: frontPath, x: 0, y: 0 },
        { src: backPath, x: 488, y: 0 }

    ], {

        Canvas: Canvas,
        Image: Image,
        width: 976,
        height: 680

    })
    .then(b64 => {

        const base64Data = b64.replace(/^data:image\/png;base64,/, '');
        const bufferData = Buffer.from(base64Data, 'base64');

        const outputFilePath = `.\/src\/imageDump\/${frontPath.replace(/.\/src\/imageDump\//, '').replace(/\.png/, '')}-${backPath.replace(/.\/src\/imageDump\//, '')}`;
        console.log(outputFilePath);

        return new Promise((resolve, reject) => {

            fs.writeFile(outputFilePath, bufferData, 'binary', err => {

                if(err) {
    
                    console.error(`${err.message}\n${err.stack}`);
                    reject(err);
    
                } else {
                    
                    console.log("Merged image saved!");
                    
                    resolve(getImage(outputFilePath.replace(/.\/src\/imageDump\//, '')));
    
                }
                
            })

        })

    })
    .catch(err => {
        
        console.error(`Error occured while merging the images: ${err.message}\n${err.stack}`);
        return null;

    })
}