// Function to dynamically generate event blocks
function createEventBlock(eventId, eventTitle, content, imageFilenames) {
    const container = document.getElementById('albumContainer');

    // Create the text block
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');

    const heading = document.createElement('h2');
    heading.textContent = eventTitle || `Event ${eventId}`;
    textDiv.appendChild(heading);

    const paragraph = document.createElement('p');
    paragraph.textContent = content;
    textDiv.appendChild(paragraph);

    // Append text block to container
    container.appendChild(textDiv);

    // Only create book and dots if there are photos
    if (imageFilenames && imageFilenames.length > 0) {
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
            img.alt = `${eventTitle || `Event ${eventId}`} photo ${index + 1}`;
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

// Load all content from JSON
function loadContentFromJson() {
    fetch('texts/content.json')
        .then(response => response.json())
        .then(data => {
            data.entries.forEach(entry => {
                createEventBlock(entry.index, entry.eventTitle, entry.content, entry.photos);
            });
        })
        .catch(error => console.error('Error loading content:', error));
}

// On page load, load all content
window.onload = function() {
    loadContentFromJson();
};
