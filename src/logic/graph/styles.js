module.exports = {

    getStyles: function() {

        return styles;

    }

}

const styles = [

    { borderColor: "rgba(255, 0, 0, 1)" },
    { borderColor: "rgba(0, 0, 255, 1)" },
    { borderColor: "rgba(0, 128, 0, 1)" },
    { borderColor: "rgba(255, 255, 0, 1)" },
    { borderColor: "rgba(128, 0, 128, 1)" },
    { borderColor: "rgba(255, 165, 0, 1)" },
    { borderColor: "rgba(0, 128, 128, 1)" },
    { borderColor: "rgba(139, 69, 19, 1)" },
    { borderColor: "rgba(255, 105, 180, 1)" },
    { borderColor: "rgba(128, 128, 128, 1)" },

]
.map(style => { return {
            borderColor: style.borderColor,  
            radius: 4,
            tension: 0.1,
            borderJoinStyle: "round"
        }
    });