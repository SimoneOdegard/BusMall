'use strict';

const productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass']

const allImageSectionTag = document.getElementById('all-items');
const leftItemImageTag = document.getElementById('left-item-img');
const middleItemImageTag = document.getElementById('middle-item-img');
const rightItemImageTag = document.getElementById('right-item-img');
const leftItemHeaderTag = document.getElementById('left-item-text');
const middleItemHeaderTag = document.getElementById('middle-item-text');
const rightItemHeaderTag = document.getElementById('right-item-text');
const viewResults = document.getElementById('results');
const viewChart = document.getElementById('chart');
const resultsSection = document.getElementById('item-likes');

const maxClicks = 26;
let totalClicks = 0;

let leftImageObject = null;
let middleImageObject = null;
let rightImageObject = null;

function Picture(caption, url) {
    this.caption = caption;
    this.url = url;
    this.clickCounter = 0;
    this.shownCounter = 0;

    Picture.all.push(this);
};

Picture.all = [];

function createProductsFromScratch() {
    for (let i = 0; i < productNames.length; i++) {
        const productName = productNames[i];
        new Picture(productName, './img/' + productName + '.jpg');
    }
}

function createProductsFromStorage(storedData) {
    const javaScriptImages = JSON.parse(storedData);
    for (let i = 0; i < javaScriptImages.length; i++) {
        const rawData = javaScriptImages[i];
        const newPictureInst = new Picture(rawData.caption, rawData.url);
        newPictureInst.clickCounter = rawData.clickCounter;
        newPictureInst.shownCounter = rawData.shownCounter;
    }
}

function createProducts(){
    // are we creating from scratch or from storage
    const storedData = localStorage.getItem('imageStorage');
    if (storedData === null){
        createProductsFromScratch();
    } else {
        createProductsFromStorage(storedData);
    }
}

function pickNewItems() {
    shuffle(Picture.all);

    const safeProducts = [];
    for (let i = 0; i < Picture.all.length; i++) {
        const product = Picture.all[i];
        if (product !== leftImageObject && 
            product !== middleImageObject && 
            product !== rightImageObject) {
                
            safeProducts.push(product);
            if (safeProducts.length === 3) {
                break;
            }
        }
    }

    leftImageObject = safeProducts[0];
    middleImageObject = safeProducts[1];
    rightImageObject = safeProducts[2];

    leftImageObject.shownCounter += 1;
    middleImageObject.shownCounter += 1;
    rightImageObject.shownCounter += 1;

    renderNewItems();

    totalClicks += 1;
}

function renderNewItems() {
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

function imageClickHandler(event) {
    if (totalClicks <= maxClicks) {
        const clickedId = event.target.id;
        if (clickedId === 'left-item-img') {
            leftImageObject.clickCounter += 1;
        } else if (clickedId == 'middle-item-img') {
            middleImageObject.clickCounter += 1;
        } else if (clickedId == 'right-item-img') {
            rightImageObject.clickCounter += 1;
        }
        pickNewItems();
    }
    if (totalClicks === maxClicks) {
        allImageSectionTag.removeEventListener('click', imageClickHandler);
        alert('Enough clicking');
        viewResults.style.display = 'block';
        viewChart.style.display = 'block';
        resultsSection.style.display = 'block';
        // step 1
        const JSONImages = JSON.stringify(Picture.all);
        console.log({JSONImages});

        // step 2
        localStorage.setItem('imageStorage', JSONImages);
    }
}

function resultsClickHandler(event){
    renderLikes();
    renderChart();
}

viewResults.addEventListener('click', resultsClickHandler);

function renderLikes() {
    const likesListElem = document.getElementById('item-likes');
    likesListElem.innerHTML = '';
    for (let i = 0; i < Picture.all.length; i++) {
        const itemPicture = Picture.all[i];
        const itemPictureElem = document.createElement('li');
        likesListElem.appendChild(itemPictureElem);
        itemPictureElem.textContent = itemPicture.caption + ' : ' + itemPicture.clickCounter + '/' + itemPicture.shownCounter;
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

function renderChart() {
    const clicks = [];
    const displayedCounter =[];
    for (let i = 0; i < Picture.all.length; i++){
        const voteCount = Picture.all[i].clickCounter;
        const timesVoted = Picture.all[i].shownCounter;
        clicks.push(voteCount);
        displayedCounter.push(timesVoted);
    }

    const ctx = document.getElementById('canvas').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Clicks',
                backgroundColor: 'rgb(54, 167, 211)',
                borderColor: 'rgb(54, 167, 211)',
                data: clicks,
            },
            {
                label: 'Displayed Counter',
                backgroundColor: 'rgb(253, 179, 195)',
                borderColor: 'rgb(253, 179, 195)',
                data: displayedCounter,
        }]
        },
        options: {}
    });
}

allImageSectionTag.addEventListener('click', imageClickHandler);

createProducts();
pickNewItems();

viewResults.style.display = 'none';
viewChart.style.display = 'none';
resultsSection.style.display = 'none';


// step 3
// const localStorageImages = localStorage.getItem('imageStorage');
// console.log({localStorageImages});

// // step 4
// const javaScriptImages = JSON.parse(localStorageImages);
// console.log({javaScriptImages});