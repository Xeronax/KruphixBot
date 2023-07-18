//Colors map, credit to Judgebot for values

const colors = new Map([

    ['W', 0xf8f6d8],
    ['U', 0xc1d7e9],
    ['B', 0x0d0f0f],
    ['R', 0xe49977],
    ['G', 0xa3c095],
    ['GOLD', 0xe0c96c],
    ['ARTIFACT', 0x90adbb],
    ['LAND', 0xaa8f84],
    ['NONE', 0xdad9de],

])

module.exports = getColor

function getColor(parsedCard = null) {

    let color;

    try {

        if(parsedCard == null) return colors.get('NONE');

        if(parsedCard.front) return getColor(parsedCard.front);


        if(!parsedCard.colors || parsedCard.colors.length == 0){

            color = colors.get('NONE');
            
            if(parsedCard.type_line.match("/artifact/gi")) {
    
                color = colors.get('ARTIFACT');
    
            }
            if(parsedCard.type_line.match("/land/gi")) {
    
                color = colors.get('LAND');
    
            }

            return color;
    
        } else if (parsedCard.colors.length > 1) {
    
            color = colors.get('GOLD');
    
        } else {
    
            color = colors.get(parsedCard.colors[0]);
    
        }
    
        return color;

    } catch(e)
    {

        console.error("Encountered error: ", e)
        return colors.get('NONE');

    }
    
}