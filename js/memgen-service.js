'use strict'

var gKeywords = { 'happy' : 12, 'funny': 1 };

var gImages = [ {id:1, url: 'img/1.jpg', keywords: ['happy']},
                {id:2, url: 'img/2.jpg', keywords: ['happy']},
                {id:3, url: 'img/3.jpg', keywords: ['happy']},
                {id:4, url: 'img/4.jpg', keywords: ['happy']},
                {id:5, url: 'img/5.jpg', keywords: ['happy']},
                {id:6, url: 'img/6.jpg', keywords: ['happy']},
                {id:7, url: 'img/7.jpg', keywords: ['happy']},
                {id:8, url: 'img/8.jpg', keywords: ['happy']},
                {id:9, url: 'img/9.jpg', keywords: ['happy']},
                {id:10, url: 'img/10.jpg', keywords: ['happy']},
                {id:11, url: 'img/11.jpg', keywords: ['happy']},
                {id:12, url: 'img/12.jpg', keywords: ['happy']},
                {id:13, url: 'img/13.jpg', keywords: ['happy']},
                {id:14, url: 'img/14.jpg', keywords: ['happy']},
                {id:15, url: 'img/15.jpg', keywords: ['happy']},
                {id:16, url: 'img/16.jpg', keywords: ['happy']},
                {id:17, url: 'img/17.jpg', keywords: ['happy']},
                {id:18, url: 'img/18.jpg', keywords: ['happy']}
            ];

var gMeme;

function getMemeForDisplay() {
    return gMeme;
}

function getImgOfMeme(meme) {
    
    return gImages.find(img=>img.id == meme.selectedImgId);
}

function addTextToMeme(text, curfont, deffont){

    let lastY = 0;

    if ( gMeme.lines.length !== 0 ) {
        lastY = gMeme.lines[gMeme.lines.length-1].y;
    } else {
        gMeme.selectedLineIdx = 0;
    }

    const line = {};
    line.txt = text;
    line.x = 100;
    line.y = lastY+50;
    line.font = (curfont.name) ? curfont.name : deffont.name;
    line.size = (curfont.size) ? curfont.size : deffont.size;
    line.color = (curfont.color) ? curfont.color : deffont.color;
    line.stroke = (curfont.stroke) ? curfont.stroke : deffont.stroke;

    gMeme.lines.push( line );

    gMeme.selectedLineIdx = gMeme.lines.length-1;
    
}

function chooseMeme(imageId) {
    
    gMeme = {
        selectedImgId: imageId,
        selectedLineIdx: -1,
        lines : []
    }
}

// gMeme = {
//     selectedImgId: imageId,
//     selectedLineIdx: -1,

//     lines : [
//         {
//             txt: "Hello !!!",
//             font: 'Impact',
//             size: 60,
//             align: 'left',
//             color: 'yellow',
//             stroke: 'green',
//             x: 200,
//             y: 200
//         }
//     ]
// }

function deleteText() {

    if (gMeme.lines.length > 0) gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    // if ( gMeme.selectedLineIdx > -1  ) gMeme.selectedLineIdx--;
}

