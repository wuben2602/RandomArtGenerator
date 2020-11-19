//randart.js
/********************************* GLOBAL VARIABLES  *********************************/
glo_palette = []
glo_palette_rgb = []
glo_canvas_width = 750
glo_canvas_height = 600
glo_number_colors = 5

/********************************* DRAWING FUNCTION *********************************/

//
function Generate() {

    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = "#ebedef";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("Generating...");
    //drawing ~~~
    dataObj = getFormData()
    let order = [];

    // get rectangle
    if (dataObj.recdraw) {
        if (dataObj.recfill) {
            rect = ["rect", dataObj.recnum, true];
        }
        else {
            rect = ["rect", dataObj.recnum, false];
        }
    }
    else {
        rect = [];
    }
    order.push(rect);

    // get circle
    if (dataObj.cirdraw) {
        if (dataObj.cirfill) {
            cir = ["cir", dataObj.cirnum, dataObj.cirsize, true];
        }
        else {
            cir = ["cir", dataObj.cirnum, dataObj.cirsize, false];
        }
    }
    else {
        cir = [];
    }
    order.push(cir)

    // get polygon
    if (dataObj.poldraw) {
        if (dataObj.polfill) {
            pol = ["pol", dataObj.polnum, dataObj.polside, true];
        }
        else {
            pol = ["pol", dataObj.polnum, dataObj.polside, false];
        }
    }
    else {
        pol = [];
    }
    order.push(pol)

    // GENERATING BACKGROUND ~~~~~~~~~~~~~~~~~

    // background
    if (dataObj.bg11) {
        PSolid();
    }
    else if (dataObj.bg12) {
        RPixelbyPixel();
    }
    else if (dataObj.bg13) {
        PInOrder()
    }
    else { }

    // RANDOMLY GENERATE SHAPES
    shuffle(order);
    while (Array.isArray(order) && order.length) {
        let element = order.pop();
        switch (element[0]) {
            case "rect":
                console.log("rect");
                RRectangles(element[1], element[2]);
                break;
            case "cir":
                console.log("cir");
                RCircles(element[1], element[2], element[3]);
                break;
            case "pol":
                console.log("pol");
                RIrregularPolygons(element[1], element[2], element[3]);
                break;
        }
    }


}

/********************************* UTILITY FUNCTIONS *********************************/

/* function is not used...
function getDimensions() {
    console.log("getting Dimensions...");
    let canvas = document.getElementsByClassName("drawing")[0];
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let dimensions = [width, height];
    return dimensions
}
*/

/* function is not used...
function resizeCanvas(width, height) {
    let canvas = document.getElementById("canvas");
    console.log(width, height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}
*/

//
function changePaletteWindow() {
    let color_boxes = document.getElementsByClassName("palette-display");
    for (let i = 0; i < 5; i++) {
        let ctx = color_boxes[i].getContext("2d");
        let fill = "#" + glo_palette[i][0].toString(16) + glo_palette[i][1].toString(16) + glo_palette[i][2].toString(16);
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        glo_palette[i] = fill
    }
}

// color palettes using Colormind.io -> 5 colors (AJAX)
function generatePalette() {

    let data = {
        model: "default",
        //input: [[44, 43, 44], [90, 83, 82], "N", "N", "N"]
    }
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            let palette = JSON.parse(request.responseText).result;
            console.log("Got palette...")
            glo_palette = [...palette];
            glo_palette_rgb = [...palette];
            changePaletteWindow()
        };
    }
    request.open('POST', "http://colormind.io/api/", true);
    request.send(JSON.stringify(data));
}
function getFormData() {
    let elements = document.getElementById("form-options").elements;
    let obj = [];
    for (let i = 0; i < elements.length; i++) {
        let item = elements.item(i);
        if (item.type == 'checkbox') {
            obj[item.name] = item.checked;
        }
        else if (item.type == 'radio') {
            obj[item.name + i] = item.checked;
        }
        else {
            obj[item.name] = (item.value == '') ? 0 : item.value;
        }
    }
    return (obj);
}

//
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/********************************* Shape Functions *********************************/

function RRectangles(number, filled = false) {
    let ctx = document.getElementById("canvas").getContext("2d");
    for (let i = 0; i < number - 1; i++) {
        ctx.beginPath();
        if (filled) {
            ctx.fillStyle = glo_palette[randInt(0, glo_number_colors)];
            ctx.fillRect(randInt(0, glo_canvas_width), randInt(0, glo_canvas_height), randInt(0, glo_canvas_width), randInt(0, glo_canvas_height));
        } else {
            ctx.strokeStyle = glo_palette[randInt(0, glo_number_colors)];
            ctx.rect(randInt(0, glo_canvas_width), randInt(0, glo_canvas_height), randInt(0, glo_canvas_width), randInt(0, glo_canvas_height));
            ctx.stroke();
        }
    }
}

// generates circles of certain size
function RCircles(number, max_size, filled = false) {
    let ctx = document.getElementById("canvas").getContext("2d");
    for (let i = 0; i < number - 1; i++) {
        ctx.beginPath();
        ctx.arc(randInt(0, glo_canvas_width), randInt(0, glo_canvas_height), randInt(0, max_size), 0, 2 * Math.PI);
        if (filled) {
            ctx.closePath();
            ctx.fillStyle = glo_palette[randInt(0, glo_number_colors)]
            ctx.fill();
        } else {
            ctx.strokeStyle = glo_palette[randInt(0, glo_number_colors)]
            ctx.stroke();
        }
    }
}

// generates irregular polygons of specified number of sides
function RIrregularPolygons(number, sides, filled = false) {
    let ctx = document.getElementById("canvas").getContext("2d");
    for (let i = 0; i < number - 1; i++) {
        ctx.strokeStyle = glo_palette[randInt(0, glo_number_colors)]
        ctx.beginPath();
        for (let j = 0; j < sides; j++) { ctx.lineTo(randInt(0, glo_canvas_width), randInt(0, glo_canvas_height)); }
        if (filled) {
            ctx.closePath();
            ctx.fillStyle = glo_palette[randInt(0, glo_number_colors)]
            ctx.fill();
        } else {
            ctx.closePath();
            ctx.strokeStyle = glo_palette[randInt(0, glo_number_colors)]
            ctx.stroke();
        }
    }
}

/********************************* Background Functions *********************************/

function RPixelbyPixel() {
    let ctx = document.getElementById("canvas").getContext("2d");
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixel = imgData.data;
    for (let i = 0; i < pixel.length; i += 4) {
        let color = glo_palette_rgb[randInt(0, 5)];
        pixel[i] = color[0];
        pixel[i + 1] = color[1];
        pixel[i + 2] = color[2];
    }
    ctx.putImageData(imgData, 0, 0);
    console.log("Rpixelbypixel");
}

function PInOrder() {
    let ctx = document.getElementById("canvas").getContext("2d");
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixel = imgData.data;
    let color_pick = 0;
    for (let i = 0; i < pixel.length; i += 4) {
        let color = glo_palette_rgb[color_pick];
        pixel[i] = color[0];
        pixel[i + 1] = color[1];
        pixel[i + 2] = color[2];
        color_pick = (color_pick + 1) % 5;
    }
    ctx.putImageData(imgData, 0, 0);
    console.log("PInOrder");
}
// not used
function PInReverse() {
    let ctx = document.getElementById("canvas").getContext("2d");
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixel = imgData.data;
    let color_pick = 0;
    for (let i = 0; i < pixel.length; i += 4) {
        let color = glo_palette_rgb[color_pick];
        pixel[i + 2] = color[0];
        pixel[i + 1] = color[1];
        pixel[i] = color[2];
        color_pick = (color_pick + 1) % 5;
    }
    ctx.putImageData(imgData, 0, 0);
    console.log("PInReverse");
}

function PSolid() {
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = glo_palette[randInt(0, glo_number_colors)];
    ctx.fillRect(0, 0, glo_canvas_width, glo_canvas_height);
}