function printJSONToFile(jsonObject, fileName) {
    const fs = require('fs');
  
    // Convert the JSON object to a string with line breaks
    const jsonString = JSON.stringify(jsonObject, null, 2);
  
    // Write the string to a text file
    fs.writeFile(fileName, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('JSON data has been written to', fileName);
      }
    });
  }

