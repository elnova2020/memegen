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

        if (meme.lines[meme.selectedLineIdx]) drawText(meme.lines[meme.selectedLineIdx], true);
    }

}

function onGalleryMenu() {
    if (!gGalleryDisplayed) {
        document.querySelector('.memgen-container').style.display = 'none';
        document.querySelector('.gallery').style.display = 'grid';
    }

    document.querySelector('.gallery-btn').classList.toggle('pressed');
}


function onClickChangeStrokeColor(elBtn) {
    elBtn.querySelector('input').click();
}

function onClickChangeFillColor(elBtn) {
    elBtn.querySelector('input').click();
}

function onAddText() {

    const elInputText = document.querySelector('input[name=mem-text]');
    
    if (elInputText.value) {
        const text = elInputText.value;
        addTextToMeme(text, gCurFont, gDefaultFont, gCanvas.height);
        
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

    // const meme = getMemeForDisplay();

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
    meme.lines[meme.selectedLineIdx].align = align;

    renderCanvas();
}

function onDeleteText() {
    
    deleteText();
    renderCanvas();
}

function onMoveTextUp() {

    const meme = getMemeForDisplay();
    meme.lines[meme.selectedLineIdx].y -= 10;
    renderCanvas();
}

function onMoveTextDown() {
    const meme = getMemeForDisplay();
    meme.lines[meme.selectedLineIdx].y += 10;
    renderCanvas();
}

var gUpDownDir = 1;

function onChangeSelectedLine() {
    const meme = getMemeForDisplay();

    if (meme.lines.length === 0 || meme.lines.length === 1) return;

    if (meme.selectedLineIdx === 0) {
        gUpDownDir = 1;
    }

    if (meme.selectedLineIdx === meme.lines.length - 1) {
        gUpDownDir = -1;
    }

    if ( gUpDownDir === 1 ) meme.selectedLineIdx++;
    else meme.selectedLineIdx--;

    renderCanvas();
}

function onChangeFillColor(value) {

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

function onDownloadMeme(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
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

function drawText(line, marked=false) {

    const font = (line.font) ? line.font : (gCurFont.name) ? gCurFont.name : gDefaultFont.name;
    const size = (line.size) ? line.size : (gCurFont.size) ? gCurFont.size :  gDefaultFont.size;

    gCtx.font = `${size}px ${font}`;
    console.log('Font --- ', gCtx.font);
    const text_width = gCtx.measureText(line.txt).width;

    console.log('line.x beconstfore alignment ', line.x );

    switch (line.align) {

        case 'right':
            line.x = gCanvas.width - text_width - 20;
            break;

        case 'left':
            line.x = 20;
            break;

        case 'center':
            line.x = parseInt(gCanvas.width/2) - parseInt(text_width/2);
            break;
    }

    if ( marked ) drawRect(line.x - 15, line.y + 10, text_width+30, -line.size-10);

    gCtx.lineWidth = '1.5';
    gCtx.strokeStyle = (line.stroke) ? line.stroke : (gCurFont.stroke) ? gCurFont.stroke : gDefaultFont.stroke;
    gCtx.fillStyle = (line.color) ? line.color : (gCurFont.color) ? gCurFont.color : gDefaultFont.color;
    
    gCtx.textAlign = 'left';

    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);

}

function drawRect(x, y, width, height) {

    gCtx.beginPath()
    gCtx.strokeStyle = 'white';
    gCtx.rect(x, y, width, height);
    gCtx.stroke() ;

    gCtx.fillStyle = 'rgba(226, 210, 210, 0.287)';
    gCtx.fillRect(x, y, width, height);

}

// function onMouseMove(event){
//     // console.log(event);
// }