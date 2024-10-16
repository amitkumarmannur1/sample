// Function to dynamically generate event blocks
function createEventBlock(eventId, eventTitle, textId, imageFilenames) {
    const container = document.getElementById('albumContainer');

    // Create the text block
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');

    const heading = document.createElement('h2');
    heading.textContent = eventTitle;
    textDiv.appendChild(heading);

    const paragraph = document.createElement('p');
    paragraph.id = textId;
    textDiv.appendChild(paragraph);

    // Append text block to container
    container.appendChild(textDiv);

    // Create the book div
    const bookId = `book${eventId}`;
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');
    bookDiv.id = bookId;

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');

    // Create media items
    imageFilenames.forEach((filename, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');
        if (index === 0) mediaItem.classList.add('active');  // Set first image as active

        const img = document.createElement('img');
        img.src = filename;
        img.alt = `${eventTitle} photo ${index + 1}`;
        mediaItem.appendChild(img);

        mediaContainer.appendChild(mediaItem);
    });

    // Append media container to book
    bookDiv.appendChild(mediaContainer);

    // Create click areas
    const clickAreaLeft = document.createElement('div');
    clickAreaLeft.classList.add('click-area', 'left');
    clickAreaLeft.setAttribute('onclick', `prevMedia('${bookId}')`);
    bookDiv.appendChild(clickAreaLeft);

    const clickAreaRight = document.createElement('div');
    clickAreaRight.classList.add('click-area', 'right');
    clickAreaRight.setAttribute('onclick', `nextMedia('${bookId}')`);
    bookDiv.appendChild(clickAreaRight);

    // Append book to container
    container.appendChild(bookDiv);

    // Create and append dots
    const dotsDiv = document.createElement('div');
    dotsDiv.classList.add('dots');
    dotsDiv.id = `dots${eventId}`;
    container.appendChild(dotsDiv);

    // Setup the book for media rotation and dot navigation
    setupBook(bookId);
}

// Setup function for media carousel
function setupBook(bookId) {
    const book = document.getElementById(bookId);
    const mediaItems = book.getElementsByClassName('media-item');
    const dots = document.getElementById(`dots${bookId.slice(-1)}`);
    let currentItem = 0;

    // Create dots
    for (let i = 0; i < mediaItems.length; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dots.appendChild(dot);
    }

    function updateBook() {
        for (let i = 0; i < mediaItems.length; i++) {
            mediaItems[i].classList.remove('active');
            dots.children[i].classList.remove('active');
        }
        mediaItems[currentItem].classList.add('active');
        dots.children[currentItem].classList.add('active');

        // Play video if it's a video element
        const activeMedia = mediaItems[currentItem].children[0];
        if (activeMedia.tagName === 'VIDEO') {
            activeMedia.play();
        }
    }

    window[`nextMedia_${bookId}`] = function() {
        currentItem = (currentItem + 1) % mediaItems.length;
        updateBook();
    };

    window[`prevMedia_${bookId}`] = function() {
        currentItem = (currentItem - 1 + mediaItems.length) % mediaItems.length;
        updateBook();
    };

    // Automatically rotate every 3 seconds
    setInterval(() => {
        window[`nextMedia_${bookId}`]();
    }, 3000);

    updateBook();
}
function loadTextFromJson(sectionId, elementId) {
    fetch('texts/content.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById(elementId).textContent = data[sectionId];
        })
        .catch(error => console.error('Error loading text:', error));
}
// On page load, generate all the event blocks
window.onload = function() {
    const eventsData = [
        {
            eventId: 1,
            eventTitle: 'First Days',
            textId: 'firstDaysText',
            images: [
                'PXL_20240802_040414000.PORTRAIT.jpg',
                'PXL_20240801_223932447.RAW-01.MP.COVER.jpg',
                'PXL_20240801_225544162.RAW-01.COVER.jpg'
            ]
        },
        {
            eventId: 2,
            eventTitle: 'People whom I first met',
            textId: 'firstmet',
            images: [
                'PXL_20240802_043504040.RAW-01.MP.COVER.jpg',
                'PXL_20240802_023205459.RAW-01.COVER.jpg'
            ]
        },{
                      eventId: 5,
                      eventTitle: 'my hospital days',
                      textId: 'myhospital',
                      images: [
                          'PXL_20240803_164428058.PORTRAIT.jpg',
                          'PXL_20240803_164508328.RAW-01.COVER.jpg'
                      ]
                  },{
                                          eventId: 4,
                                          eventTitle: 'my hospital days',
                                          textId: 'myhospital1',
                                          images: [
                                              'PXL_20240803_164428058.PORTRAIT.jpg',
                                              'PXL_20240803_164508328.RAW-01.COVER.jpg'
                                          ]
                                      },{
                                                             eventId: 8,
                                                             eventTitle: 'my hospital days',
                                                             textId: 'myhospital2',
                                                             images: [
                                                                 'PXL_20240803_164428058.PORTRAIT.jpg',
                                                                 'PXL_20240803_164508328.RAW-01.COVER.jpg'
                                                             ]
                                                         }
        // Add more events here as needed
    ];

    // Loop through and create each event block dynamically
    eventsData.forEach(event => {
        createEventBlock(event.eventId, event.eventTitle, event.textId, event.images);
    });

    // Load the text content from JSON for each event
    loadTextFromJson('1', 'firstDaysText');
    loadTextFromJson('2', 'firstmet');
    loadTextFromJson('5', 'myhome');
    loadTextFromJson('8', 'myhospital1');
    loadTextFromJson('3', 'myhospital');
};
