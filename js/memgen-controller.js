'use strict'
var gCanvas;
var gCtx;

const gDefaultFont = {
    name: 'Impact',
    size: 80,
    color: 'white',
    stroke: 'black'
};

var gCurFont = {
    name: null,
    size: null,
    color: null,
    stroke: null
}

var gGalleryDisplayed;
var gMarkSelected = true;

function onInit() {

    renderGallery();
    gGalleryDisplayed = true;
}

function renderGallery(keyword = '') {

    renderKeywords();

    const imgs = getImagesByKeyword(keyword);

    const strHTMLs = [];

    imgs.forEach(img => {
        strHTMLs.push(`<img class="grid-item" data-img="${img.id}" src="${img.url}" alt="" onclick="onChooseImage(this)">`);
    });

    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

function onFilterImages(keyword) {

    if (keyword) addRateToKeayword(keyword);

    document.querySelector('.search-input').value = keyword;
    renderGallery(keyword);

}

function renderKeywords() {

    const keywords = getKeywords();

    console.log('Keywords ...', keywords);

    let strHTMLs = [];

    for ( var key in keywords ) {
        strHTMLs.push(`<div class="keyword" onclick="onFilterImages('${key}')">${key}</div>`);
    }

    document.querySelector('.keywords').innerHTML = strHTMLs.join('');

    const elKwds = document.querySelectorAll('.keyword');

    elKwds.forEach(elKwd => {

        let text = elKwd.innerText;
        console.log('El keyword text ', text);
        console.log('Rate is ', keywords[elKwd.innerText]);
        elKwd.style.fontSize = keywords[elKwd.innerText] + 'px';
    });

}

function initMemeGenEditor() {

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

        if (gMarkSelected && meme.lines[meme.selectedLineIdx]) drawText(meme.lines[meme.selectedLineIdx], true);

        // gMarkSelected = true;

        gMeme.stickers.forEach(stck => {
            const img = new Image();
            img.src = stck.url;
            img.onload = () => {
                gCtx.drawImage(img, stck.x, stck.y, 75, 75);
            }

        });
    }

}

function onGalleryMenu() {
    if (!gGalleryDisplayed) {
        document.querySelector('.memgen-container').style.display = 'none';
        document.querySelector('.gallery-layout').style.display = 'block';
    }

    document.querySelector('.gallery-btn').classList.toggle('pressed');
}


function onClickChangeStrokeColor(elBtn) {
    elBtn.querySelector('input').click();
}

function onClickChangeFillColor(elBtn) {
    elBtn.querySelector('input').click();
}

function onAddText(event = null) {

    console.log('Event ', event);
    if ( (event.type === 'keydown' && event.key === 'Enter') || (event.type === 'click')) {

        const elInputText = document.querySelector('input[name=mem-text]');

        if (elInputText.value) {
            const text = elInputText.value;
            addTextToMeme(text, gCanvas.height);
            renderCanvas();
        }
    }

}

function onChooseImage(el) {

    console.log('Click on image...', el);
    console.log('imgeId from dataset...', el.dataset.img);
    document.querySelector('.memgen-container').style.display = 'flex';
    document.querySelector('.gallery-layout').style.display = 'none';
    chooseMeme(el.dataset.img);

    gGalleryDisplayed = false;
    document.querySelector('.gallery-btn').classList.toggle('pressed');
    document.querySelector('input[name=mem-text]').focus();
    initMemeGenEditor();
}

function onSetFont(font) {

    const meme = getMemeForDisplay();

    if (meme.lines.length > 0) {
        meme.lines[meme.selectedLineIdx].font = font;
    }

    gCurFont.name = font;

    renderCanvas();

}

function onChangeFontSize(diff) {
    const meme = getMemeForDisplay();

    if (meme.lines.length > 0) {
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

    if (gUpDownDir === 1) meme.selectedLineIdx++;
    else meme.selectedLineIdx--;

    gMarkSelected = true;
    renderCanvas();
}

function onChangeFillColor(value) {

    const meme = getMemeForDisplay();

    if (meme.lines.length > 0) meme.lines[meme.selectedLineIdx].color = value;

    gCurFont.color = value;

    renderCanvas();
}

function onChangeStrokeColor(value) {

    const meme = getMemeForDisplay();

    if (meme.lines.length > 0) meme.lines[meme.selectedLineIdx].stroke = value;

    gCurFont.stroke = value;

    renderCanvas();

}

function onDownloadMeme(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function drawText(line, marked = false) {

    const font = (line.font) ? line.font : gDefaultFont.name;
    const size = (line.size) ? line.size : gDefaultFont.size;

    gCtx.font = `${size}px ${font}`;
    console.log('Font --- ', gCtx.font);
    const text_width = gCtx.measureText(line.txt).width;
    line.textWidth = text_width;

    switch (line.align) {

        case 'right':
            line.x = gCanvas.width - text_width - 20;
            break;

        case 'left':
            line.x = 20;
            break;

        case 'center':
            line.x = parseInt(gCanvas.width / 2) - parseInt(text_width / 2);
            break;

        default:

            break;
    }

    if (marked) drawRect(line.x - 15, line.y + 10, text_width + 30, -line.size - 10);

    gCtx.lineWidth = '3';

    // gCtx.strokeStyle = (line.stroke) ? line.stroke : (gCurFont.stroke) ? gCurFont.stroke : gDefaultFont.stroke;
    // gCtx.fillStyle = (line.color) ? line.color : (gCurFont.color) ? gCurFont.color : gDefaultFont.color;

    gCtx.strokeStyle = line.stroke;
    gCtx.fillStyle = line.color;

    gCtx.textAlign = 'left';

    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);

}

function drawRect(x, y, width, height) {

    gCtx.beginPath()
    gCtx.strokeStyle = 'white';
    gCtx.rect(x, y, width, height);
    gCtx.stroke();

    gCtx.fillStyle = 'rgba(226, 210, 210, 0.287)';
    gCtx.fillRect(x, y, width, height);

}

var gStickerSelected = false;

var gDraggableLine = null;
var gDraggableLineIdx;
var gDraggableSticker = null;
var gDraggableStickerIdx;

function onCanvasClick(event) {

    console.log('Click event', event);
    let { offsetX, offsetY } = event;
    const meme = getMemeForDisplay();

    let idx = -1;
    let clickedLine = meme.lines.find(line => {
        idx++;
        return offsetX >= line.x && offsetX <= line.x + line.textWidth
            && offsetY >= line.y - line.size && offsetY < line.y;
    });
    
    console.log('clicked line', clickedLine);
    console.log('not clicked line', !clickedLine);

    if (!clickedLine) {
        
        gMarkSelected = false;

    }

    renderCanvas();

}

var gTime = 0;

function onCanvasMouseDown(event) {
    console.log('Mouse down', event);

    gTime = Date.now();
    let { offsetX, offsetY } = event;
    const meme = getMemeForDisplay();

    let idx = -1;
    let clickedLine = meme.lines.find(line => {
        idx++;
        return offsetX >= line.x && offsetX <= line.x + line.textWidth
            && offsetY >= line.y - line.size && offsetY < line.y;
    });

    if (clickedLine) {
        console.log('clicked line ', clickedLine);
        gDraggableLine = clickedLine;
        gDraggableLineIdx = idx;
        meme.selectedLineIdx = idx;
        meme.selectedItem = 'line';
        clickedLine.align = 'none';
        document.querySelector('.draw-area').style.cursor = 'grabbing';

        gMarkSelected = true;
        return;
    }

    if (gStickerSelected) { //sticker just added to meme
        const meme = getMemeForDisplay();
        meme.stickers[meme.selectedStickerIdx];
        meme.stickers[meme.selectedStickerIdx].x = offsetX;
        meme.stickers[meme.selectedStickerIdx].y = offsetY;
        gStickerSelected = false;
        document.querySelector('.selected').classList.toggle('selected');
    } else { //dragging existing sticker

        let sIdx = -1;
        let clickedSticker = meme.stickers.find(sticker => {
            sIdx++;
            return offsetX >= sticker.x && offsetX <= sticker.x + 75
                && offsetY >= sticker.y && offsetY < sticker.y + 75;
        });

        if (clickedSticker) {
            console.log('SET ALL DATA TO STICKER...');
            gDraggableSticker = clickedSticker;
            gDraggableStickerIdx = sIdx;
            meme.selectedStickerIdx = sIdx;
            meme.selectedItem = 'sticker';
            document.querySelector('.draw-area').style.cursor = 'grabbing';
            return;
        }
    }

}

function onCanvasMouseUp(event) {
    console.log('CANVAS Mouse up ', event);
    document.querySelector('.draw-area').style.cursor = 'default';
    
    // gMarkSelected = false;

    if (Date.now() - gTime < 500) {
        gDraggableLine = null;
        gDraggableSticker = null;
        return;
    }

    if (gDraggableLine) {
        const meme = getMemeForDisplay();
        var { offsetX, offsetY } = event;
        meme.lines[gDraggableLineIdx].x = offsetX;
        meme.lines[gDraggableLineIdx].y = offsetY;

        renderCanvas();

        gDraggableLine = null;
        gDraggableLineIdx = null;
        return;
    }

    if (gDraggableSticker) {
        const meme = getMemeForDisplay();
        var { offsetX, offsetY } = event;
        meme.stickers[gDraggableStickerIdx].x = offsetX;
        meme.stickers[gDraggableStickerIdx].y = offsetY;

        renderCanvas();
        gDraggableSticker = null;
        gDraggableStickerIdx = null;
    }

}

function onCanvasMouseMove(event) {
    // console.log('Mouse move ', event);
    if (gDraggableLine) {
        const meme = getMemeForDisplay();
        var { offsetX, offsetY } = event;
        meme.lines[gDraggableLineIdx].x = offsetX;
        meme.lines[gDraggableLineIdx].y = offsetY;

        renderCanvas();

    }

    if (gDraggableSticker) {

        const meme = getMemeForDisplay();
        var { offsetX, offsetY } = event;
        meme.stickers[gDraggableStickerIdx].x = offsetX;
        meme.stickers[gDraggableStickerIdx].y = offsetY;

        renderCanvas();
    }
}

function onAddSticker(elImg) {

    gStickerSelected = true;

    addSticker(elImg.src);

    elImg.classList.toggle('selected');
}

var gStickerImgSrc;

function drag(event, imgSrc) {

    console.log('Drag event', drag);
    event.dataTransfer.setData("text/plain", event.target.id);

    gStickerImgSrc = imgSrc;

    var img = new Image();
    img.src = imgSrc;
    event.dataTransfer.setDragImage(img, 75, 75);
}

function drop(event){
    console.log('Drop event', event);
    event.preventDefault();
    
    const img = new Image();
    img.src = gStickerImgSrc;
    img.onload = () => {
        gCtx.drawImage(img, event.offsetX, event.offsetY, 75, 75);
    }

    addSticker(img.src, event.offsetX, event.offsetY );
    gStickerImgSrc = null;

}

function allowDrop(event) {
    event.preventDefault();
}