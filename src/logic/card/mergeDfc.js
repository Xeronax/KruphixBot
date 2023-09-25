/*
    mergeDfc.js — A script to merge the front and back faces of a double-faced card into a single image
*/
const mergeImages = require('merge-images');
const axios = require('axios');
const fs = require('fs');
const { Canvas, Image } = require('canvas');
const { getImage } = require('../../server');
//const sharp = require('sharp');


module.exports = {

    merge: async function(frontImageUrl, backImageUrl) {

        const frontPath = await downloadImage(frontImageUrl);
        const backPath = await downloadImage(backImageUrl);
        const mergedImageFilePath = await mergeFaces(frontPath, backPath);

        return getImage(mergedImageFilePath);

    }

}

async function mergeFaces( frontPath, backPath ) {

    const dimensions = await getDimensions(frontPath, backPath);

    return mergeImages([ 

        { src: frontPath, x: 0, y: 0 },
        { src: backPath, x: dimensions.front.width, y: 0 }

    ], {

        Canvas: Canvas,
        Image: Image,
        width: (dimensions.front.width + dimensions.back.width),
        height: (Math.max(dimensions.front.height, dimensions.back.height))

    })
    .then(b64 => {

        const base64Data = b64.replace(/^data:image\/png;base64,/, '');
        const bufferData = Buffer.from(base64Data, 'base64');
        const outputFilePath = `${'./src/imageDump/'}${(Math.random()).toString().replace(/\./, '')}.png`;

        fs.unlink(frontPath, err => {

            if(err) throw err;

        })
        fs.unlink(backPath, err => {

            if(err) throw err;

        })

        return new Promise((resolve, reject) => {

            fs.writeFile(outputFilePath, bufferData, 'binary', err => {

                if(err) {
    
                    console.error(`${err.message}\n${err.stack}`);
                    reject(err);
    
                } else {
                    
                    console.log(`Merged image saved @ ${outputFilePath}`);

                    setTimeout(function() {

                        try {

                            fs.unlink(outputFilePath, err => {

                                console.log(`Deleted ${outputFilePath}`);
    
                            })

                        } catch(err) {

                            console.error(`${err}\n${err.stack}`);

                        }

                    }, 600000);
                    
                    resolve(outputFilePath.replace(/.\/src\/imageDump\//, ''));
    
                }

            })

        })

    })
    .catch(err => {
        
        console.error(`Error occured while merging the images: ${err.message}\n${err.stack}`);
        return null;

    })
}

async function downloadImage(url) {

    const filePath = `./src/imageDump/${Math.random().toString().replace(/\./, '')}.png`;

    console.log(url)
    const response = await axios({

        method: 'GET',
        url: url,
        responseType: 'stream'

    })
        
    if(response.status != 200) return null;

    return new Promise((resolve, reject) => {

        response.data.pipe(fs.createWriteStream(filePath))
        .on('finish', () => {

            resolve(filePath);

        })
        .on('error', err => {

            console.error(`${err.message}\n${err.stack}`);

            reject(err);

        })

    })

}

async function getDimensions(frontImagePath, backImagePath) {

    const frontMetaData = await sharp(frontImagePath).metadata();
    const backMetaData = await sharp(backImagePath).metadata();
    const front = {

        width: frontMetaData.width,
        height:  frontMetaData.height

    }
    const back = {

        width: backMetaData.width,
        height: backMetaData.height,

    }
    
    return { front, back };
    
}