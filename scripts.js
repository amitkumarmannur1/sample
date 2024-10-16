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

function nextMedia(bookId) {
    window[`nextMedia_${bookId}`]();
}

function prevMedia(bookId) {
    window[`prevMedia_${bookId}`]();
}

// Setup all books
setupBook('book1');
setupBook('book2');
