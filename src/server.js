/*
	#Image hosting for double-faced cards#
	If you would like to create a server on your machine to host images for embeds,
	allowing support for displaying both sides of a DFC, you can optionally provide a PORT
	variable in your .env file.
	This is still very experimental, i'm not a good enough coder to have yet implemented any
	needed security features. This is running on a VM on the cloud so use with caution.
*/
const express = require('express');

const port = process.env.PORT;
const ip = process.env.HOST_IP;

if(port) { 
    
    startServer(); 

} else {

    console.log('-------------------------------------\n');
    console.log('No port defined. Kruphix Bot will use default display.');
    console.log('\n-------------------------------------');

}

module.exports = {

    getImage: function(name) {

        if(!port) return null;

        const imagePath = `http://${ip}:${port}/imageDump/${name}`;
        console.log(`Grabbing imagePath from: ${imagePath}`);

        return imagePath;

    }
    
}

function startServer(){

    const app = express();
    app.use('/imageDump', express.static(__dirname + '/imageDump'));
    console.log(`Establishing ${__dirname} with '/imageDump`);
    app.listen(port, () => console.log(`Server running on port ${port}`));

}