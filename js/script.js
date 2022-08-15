const books = [];
let booksFilter = [];
let e = [];
let search = '';
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const textBookTitle = document.createElement('h2');
    textBookTitle.innerText = bookObject.title;

    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = 'Penulis : ' + bookObject.author;

    const textBookYear = document.createElement('p');
    textBookYear.innerText = 'Tahun : ' + bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textBookTitle, textBookAuthor, textBookYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('undo-button');

        uncompletedButton.addEventListener('click', function () {
            moveToUncompletedFromCompleted(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');

        editButton.addEventListener('click', function () {
            editBook(bookObject.id)
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id)
        });

        container.append(uncompletedButton, editButton, trashButton);
    } else {
        const completedButton = document.createElement('button');
        completedButton.classList.add('check-button');

        completedButton.addEventListener('click', function () {
            moveToComplatedFromUnCompleted(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');

        editButton.addEventListener('click', function () {
            editBook(bookObject.id)
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id)
        });

        container.append(completedButton, editButton, trashButton);
    }

    return container;
}

function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveToComplatedFromUnCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveToUncompletedFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook(bookId) {
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook() {
    const searchBookTitle = document.getElementById('searchBookTitle').value;

    search = searchBookTitle;
    booksFilter = books.filter(function (book) {
        return book.title.toLowerCase().includes(search.toLowerCase());
    })
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    const submitSearch = document.getElementById('searchBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    submitSearch.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    var snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';
    setTimeout(function () {
        snackbar.className = snackbar.className.replace('show', '');
    }, 1500);
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    if (search == '') {
        e = books;
    } else {
        e = booksFilter;
    }
    
    for (const bookItem of e) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});