module.exports = {

    getStyles: function(chartType) {

        return styles;

    }

}

const styles = [

    { borderColor: "rgba(255, 0, 0, 1)", backgroundColor: "rgba(255, 200, 200, 0.5)" },
    { borderColor: "rgba(0, 0, 255, 1)", backgroundColor: "rgba(200, 200, 255, 0.5)" },
    { borderColor: "rgba(0, 128, 0, 1)", backgroundColor: "rgba(200, 255, 200, 0.5)" },
    { borderColor: "rgba(255, 255, 0, 1)", backgroundColor: "rgba(255, 255, 200, 0.5)" },
    { borderColor: "rgba(128, 0, 128, 1)", backgroundColor: "rgba(230, 200, 230, 0.5)" },
    { borderColor: "rgba(255, 165, 0, 1)", backgroundColor: "rgba(255, 225, 200, 0.5)" },
    { borderColor: "rgba(0, 128, 128, 1)", backgroundColor: "rgba(200, 255, 255, 0.5)" },
    { borderColor: "rgba(139, 69, 19, 1)", backgroundColor: "rgba(245, 222, 179, 0.5)" },
    { borderColor: "rgba(255, 105, 180, 1)", backgroundColor: "rgba(255, 220, 240, 0.5)" },
    { borderColor: "rgba(128, 128, 128, 1)", backgroundColor: "rgba(230, 230, 230, 0.5)" }

]
    .map(style => { return {
                borderColor: style.borderColor,  
                backgroundColor: style.backgroundColor,
                radius: 4,
                tension: 0.1,
                borderJoinStyle: "round"
            }
        });