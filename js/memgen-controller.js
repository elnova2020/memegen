'use strict'
var gCanvas;
var gCtx;

const gDefaultFont = {
    name: 'Impact',
    size: 40,
    color: 'white',
    stroke: 'black'
};

// var gCurFont = gDefaultFont;

var gCurFont = {
    name: null,
    size: null,
    color: null,
    stroke: null
}

var gText = null;

var gGalleryDisplayed;

function onInit() {
    
    renderGallery();
    gGalleryDisplayed = true;
}

function renderGallery() {

    const strHTMLs = [];

    for ( let i = 0; i < 18; i++ ){
        strHTMLs.push(`<img class="grid-item" data-img="${i+1}" src="img/${i+1}.jpg" alt="" onclick="onChooseImage(this)">`);
    }
    
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

function initMemeGenEditor(){

    if (!gCanvas) {
        gCanvas = document.querySelector('.draw-area');
        gCtx = gCanvas.getContext('2d');
    }

    renderCanvas();
}

function renderCanvas() {

    const meme = getMemeForDisplay();
    drawMemeImg(meme);
}

function drawMemeImg(meme) {

    const galleryImg = getImgOfMeme(meme);

    const img = new Image();
    img.src = galleryImg.url;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        meme.lines.forEach(line => {
            console.log('Line : ', line);
            drawText(line);
        });
    }

}

function onGalleryMenu() {
    if (!gGalleryDisplayed) {
        document.querySelector('.memgen-container').style.display = 'none';
        document.querySelector('.gallery').style.display = 'grid';
    }

    document.querySelector('.gallery-btn').classList.toggle('pressed');
}

function onAddText() {
    const elInputText = document.querySelector('input[name=mem-text]');
    
    if (elInputText.value) {
        gText = elInputText.value;
        addTextToMeme(gText, gCurFont, gDefaultFont);
        renderCanvas();
    }
}

function onChooseImage(el) {

    console.log('Click on image...', el);
    console.log('imgeId from dataset...', el.dataset.img);
    document.querySelector('.memgen-container').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'none';
    chooseMeme(el.dataset.img);
    
    gGalleryDisplayed = false;
    document.querySelector('.gallery-btn').classList.toggle('pressed');
    initMemeGenEditor();
}

function onSetFont(font) {

    const meme = getMemeForDisplay();

    // if ( meme.lines.length > 0 ) {
    //     meme.lines[meme.selectedLineIdx].font = font;
    // }

    gCurFont.name = font;
}

function onChangeFontSize(diff) {
    const meme = getMemeForDisplay();

    if ( meme.lines.length > 0 ) {
        meme.lines[meme.selectedLineIdx].size = meme.lines[meme.selectedLineIdx].size + diff;
        gCurFont.size = meme.lines[meme.selectedLineIdx].size;
    } else {
        gCurFont.size = gDefaultFont.size + diff;
    }

    
    renderCanvas();
}

function onSetTextAlign(align) {
    const meme = getMemeForDisplay();
    meme.lines[meme.selectedLineIdx].size = meme.lines[meme.selectedLineIdx].align = align;

    renderCanvas();
}

function onDeleteText() {
    
    deleteText();
    renderCanvas();
}

function onMoveTextUp() {

    const meme = getMemeForDisplay();
    meme.lines[meme.selectedLineIdx].y -= 10;

    markSelectedLine(meme.lines[meme.selectedLineIdx]);

    renderCanvas();
}

function onMoveTextDown() {
    const meme = getMemeForDisplay();
    meme.lines[meme.selectedLineIdx].y += 10;

    markSelectedLine(meme.lines[meme.selectedLineIdx]);

    renderCanvas();
}

var gUpDownDir = 1;

function onChangeSelectedLine() {
    const meme = getMemeForDisplay();

    if (meme.selectedLineIdx === 0) {
        gUpDownDir = 1;
    }

    if (meme.selectedLineIdx === meme.lines.length - 1) {
        gUpDownDir = -1;
    }

    if ( gUpDownDir === 1 ) meme.selectedLineIdx++;
    else meme.selectedLineIdx--;

}

function onChangeColor(value) {

    // const meme = getMemeForDisplay();

    // if ( meme.lines.length > 0 ) meme.lines[meme.selectedLineIdx].color = value;
    gCurFont.color = value;
    renderCanvas();
}

function onChangeStrokeColor(value) {

    // const meme = getMemeForDisplay();

    // if ( meme.lines.length > 0 ) meme.lines[meme.selectedLineIdx].stroke = value;

    gCurFont.stroke = value;

    renderCanvas();
}

// function drawText(event) {

//     const text = gText;
//     gCtx.lineWidth = '1.5'
//     // gCtx.strokeStyle = 'red'
//     // gCtx.fillStyle = 'white'
//     // gCtx.font = '40px Ariel'

//     const offsetX = event.offsetX
//     const offsetY = event.offsetY
//     console.log('offsetX', offsetX);
//     console.log('offsetY', offsetY);

//     gCtx.font = 'italic small-caps 900 40px serif';
//     gCtx.textAlign = 'center';
//     gCtx.fillText(text, offsetX, offsetY);
//     gCtx.strokeText(text, offsetX, offsetY);
// }

function drawText(line) {

    gCtx.lineWidth = '1.5'
    gCtx.strokeStyle = (line.stroke) ? line.stroke : (gCurFont.stroke) ? gCurFont.stroke : gDefaultFont.stroke;
    gCtx.fillStyle = (line.color) ? line.color : (gCurFont.color) ? gCurFont.color : gDefaultFont.color;
    const font = (line.font) ? line.font : (gCurFont.name) ? gCurFont.name : gDefaultFont.name;
    const size = (line.size) ? line.size : (gCurFont.size) ? gCurFont.size :  gDefaultFont.size;

    gCtx.font = `${size}px ${font}`;
    console.log('Font --- ', gCtx.font);

    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);

}

function markSelectedLine(line) {



}

function drawRect(x, y, width, height) {

    gCtx.beginPath()
    gCtx.strokeStyle = 'white';
    gCtx.rect(x, y, width, height);
    gCtx.stroke() ;

    // gCtx.fillStyle = 'orange'
    // gCtx.fillRect(x, y, 75, 150)

}

// function onMouseMove(event){
//     // console.log(event);
// }