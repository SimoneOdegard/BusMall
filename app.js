'use strict';

const allImageSectionTag = document.getElementById('all-items');
const leftItemImageTag = document.getElementById('left-item-img');
const middleItemImageTag = document.getElementById('middle-item-img');
const rightItemImageTag = document.getElementById('right-item-img');
const leftItemHeaderTag = document.getElementById('left-item-text');
const middleItemHeaderTag = document.getElementById('middle-item-text');
const rightItemHeaderTag = document.getElementById('right-item-text');

const maxClicks = 26;
let totalClicks = 0;

function Picture (caption, url) {
    this.caption = caption;
    this.url = url;
    this.clickCounter = 0;
    this.shownCounter = 0;

    Picture.all.push(this);
};
                
Picture.all = [];
new Picture ('bag', './img/bag.jpg');
new Picture ('banana', './img/banana.jpg');
new Picture ('bathroom', './img/bathroom.jpg');
new Picture ('boots', './img/boots.jpg');
new Picture ('breakfast', './img/breakfast.jpg');
new Picture ('bubblegum', './img/bubblegum.jpg');
new Picture ('chair', './img/chair.jpg');
new Picture ('cthulhu', './img/cthulhu.jpg');
new Picture ('dog-duck', './img/dog-duck.jpg');
new Picture ('dragon', './img/dragon.jpg');
new Picture ('pen', './img/pen.jpg');
new Picture ('pet-sweep', './img/pet-sweep.jpg');
new Picture ('scissors', './img/scissors.jpg');
new Picture ('shark', './img/shark.jpg');
new Picture ('sweep', './img/sweep.png');
new Picture ('tauntaun', './img/tauntaun.jpg');
new Picture ('unicorn', './img/unicorn.jpg');
new Picture ('usb', './img/usb.gif');
new Picture ('water-can', './img/water-can.jpg');
new Picture ('wine-glass', './img/wine-glass.jpg');

let leftImageObject = null;
let middleImageObject = null;
let rightImageObject = null; 

function pickNewItems(){
    shuffle(Picture.all);
    leftImageObject = Picture.all[0];
    middleImageObject = Picture.all[1];
    rightImageObject = Picture.all[2];

    leftImageObject.shownCounter += 1;
    middleImageObject.shownCounter += 1;
    rightImageObject.shownCounter += 1;

    renderNewItems();

    totalClicks += 1;
}

function renderNewItems(){
    leftItemImageTag.src = leftImageObject.url;
    leftItemImageTag.alt = leftImageObject.caption;
    leftItemHeaderTag.textContent = leftImageObject.caption;

    middleItemImageTag.src = middleImageObject.url;
    middleItemImageTag.alt = middleImageObject.caption;
    middleItemHeaderTag.textContent = middleImageObject.caption;

    rightItemImageTag.src = rightImageObject.url;
    rightItemImageTag.alt = rightImageObject.caption;
    rightItemHeaderTag.textContent = rightImageObject.caption;
}

function imageClickHandler(event){
    if (totalClicks <= maxClicks){    
        const clickedId = event.target.id;
        if(clickedId === 'left-item-img'){
            leftImageObject.clickCounter += 1;
        } else if(clickedId == 'middle-item-img'){
            middleImageObject.clickCounter += 1;
        } else if (clickedId == 'right-item-img'){
            rightImageObject.clickCounter += 1;
        }
        pickNewItems();
    }
    if (totalClicks === maxClicks){
        allImageSectionTag.removeEventListener('click', imageClickHandler);
        alert('Enough clicking');
        renderLikes();
    }
}



function renderLikes(){
    const likesListElem = document.getElementById('item-likes');
    likesListElem.innerHTML = '';
    for (let i = 0; i < Picture.all.length; i++){
        const itemPicture = Picture.all[i];
        const itemPictureElem = document.createElement('li');
        likesListElem.appendChild(itemPictureElem);
        itemPictureElem.textContent = itemPicture.caption + ' : ' + itemPicture.clickCounter;

    }
}

/* fisher yates style shuffle
https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
*/

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
}

allImageSectionTag.addEventListener('click', imageClickHandler);

renderLikes();
pickNewItems();