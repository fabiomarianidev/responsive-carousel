const setCarouselSize = () => {
    // set the number of displayed elements based on the window size
    const windowWidth = document.documentElement.clientWidth;
    let carouselWidth = 1200;
    let numberOfImages = 3;

    if (windowWidth < 576) {
        carouselWidth = windowWidth * 0.9;
        numberOfImages = 1;
    } else if (windowWidth < 768) {
        carouselWidth = windowWidth * 0.9;
        numberOfImages = 2;
    } else if (windowWidth < 992) {
        carouselWidth = windowWidth * 0.9;
        numberOfImages = 3;
    } else if (windowWidth < 1200) {
        carouselWidth = windowWidth * 0.9;
        numberOfImages = 4;
    } else {
        carouselWidth = 1200;
        numberOfImages = 5;
    }

    return [
        carouselWidth,
        numberOfImages
    ]


}

const images = [
    "https://picsum.photos/600/400?random=1",
    "https://picsum.photos/600/400?random=2",
    "https://picsum.photos/600/400?random=3",
    "https://picsum.photos/600/400?random=4",
    "https://picsum.photos/600/400?random=5",
    "https://picsum.photos/600/400?random=6",
    "https://picsum.photos/600/400?random=7",
    "https://picsum.photos/600/400?random=8",
    "https://picsum.photos/600/400?random=9",    
]

const [carouselWidth, numberOfImages] = setCarouselSize();

document.documentElement.style.setProperty('--carousel-width', `${carouselWidth}px`);

const itemWidth = carouselWidth / numberOfImages;
document.documentElement.style.setProperty('--item-width', `${itemWidth}px`);

const carouselHeight = itemWidth * 2/3;
document.documentElement.style.setProperty('--carousel-height', `${carouselHeight}px`)

const rightLimit = (images.length - numberOfImages) * itemWidth; 

const checkLimits = () => { 
    //hides left-right buttons if the first or last image is reached
    if (position >= 0) {
        document.querySelector('.previous').classList.add('hidden');
    } else {
        document.querySelector('.previous').classList.remove('hidden');
    }
    if (position <= -rightLimit) {
        document.querySelector('.next').classList.add('hidden');
    } else {
        document.querySelector('.next').classList.remove('hidden');
    }
}

// previous/next buttons handlers
const handlePrev = () => {
    if(position < 0) {
        currentPosition = position + itemWidth;
        document.documentElement.style.setProperty('--position', `${currentPosition}px`);
        position = currentPosition;
        checkLimits();
    }
}

const handleNext = () => {
    if (position > -rightLimit) {
        currentPosition = position - itemWidth;
        document.documentElement.style.setProperty('--position', `${currentPosition}px`);
        position = currentPosition;
        checkLimits();
    }
}

// drag handlers
let isDragging = false;
let dragStart = null;
let position = 0;
let currentPosition = null; 

const handleDragStart = (evt) => {
    if (evt.touches) {evt = evt.touches[0]}; //if it is a touch event, use the first touch pointer 
    isDragging = true;
    dragStart = evt.clientX;
}

const handleDrag = (evt) => {
    if (isDragging) {
        if (evt.touches) { //if it is a touch event, use the first touch pointer
            evt.preventDefault(); //prevent browser back associated with swipe left
            evt = evt.touches[0];
        }; 
        let dragLength = evt.clientX - dragStart;
        currentPosition = position + dragLength;
        if (currentPosition > 0 ) {currentPosition = 0};
        if (currentPosition < -rightLimit) {currentPosition = -rightLimit};
        document.documentElement.style.setProperty('--position', `${currentPosition}px`)
    }
}

const handleDragEnd = (evt) => {
    // snaps the left edge of an element to the left edge of the container
    // if more than half of the element is visible, snaps to its left edge
    // otherwise, snaps to the next element
    const modulo = -currentPosition % itemWidth;
    if (modulo < itemWidth /2 ) {
        currentPosition = currentPosition + modulo;
    } else {
        currentPosition = currentPosition + modulo - itemWidth;
    }
    document.documentElement.style.setProperty('--position', `${currentPosition}px`);
    position = currentPosition;
    checkLimits();
    isDragging = false;
}


// load images into carousel. the carousel can work with element is added as a child of .carousel-filmstrip 


images.forEach ((item, index) => {
    const div = document.createElement('div');
    div.classList.add('item')
    const img = document.createElement('img');
    img.src=item;
    div.appendChild(img);
    document.querySelector(".carousel-filmstrip").appendChild(div);
})

// check if previous/next buttons need to be displayed
checkLimits();

//add event listeners for dragging
const carouselContainer = document.querySelector(".carousel-container");
//mouse events
carouselContainer.addEventListener('mousedown', handleDragStart, false);
carouselContainer.addEventListener('mousemove', handleDrag, false);
carouselContainer.addEventListener('mouseup', handleDragEnd, false);
//touch events
carouselContainer.addEventListener('touchstart', handleDragStart , false);
carouselContainer.addEventListener('touchmove', handleDrag, false);
carouselContainer.addEventListener('touchend', handleDragEnd, false);

//add event listener for previous/next buttons
document.querySelector('.previous').addEventListener('click', handlePrev, false);
document.querySelector('.next').addEventListener('click', handleNext, false);