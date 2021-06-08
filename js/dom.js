const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList"
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList"
const BOOK_ITEMID = "itemId"
function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID)
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const textYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    const book = makeBooks(textTitle, textAuthor, textYear, isCompleted);
    const bookObject = composeBookObject(textTitle, textAuthor, textYear, isCompleted);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    if (isCompleted) {
        completedBookList.append(book);
    } else {
        uncompletedBookList.append(book);

    }
    updateDataToStorage();
}
function makeBooks(title, author, year, isCompleted) {
    const textTitle = document.createElement("h3")
    textTitle.innerText = title

    const textAuthor = document.createElement('p')
    textAuthor.innerHTML = "Penulis : " + author

    const textYear = document.createElement('p')
    textYear.innerHTML = "Tahun : " + year

    const buttonContainer = document.createElement("div")
    buttonContainer.classList.add("action")
    
    const article = document.createElement("article")
    article.classList.add("book_item")
    article.append(textTitle, textAuthor, textYear)
    if (isCompleted) {
        buttonContainer.append(
            createUndoButton(),
            createEraseButton()
        );
        article.append(buttonContainer)
    } else {
        buttonContainer.append(
            createFinishButton(),
            createEraseButton()
        );
        article.append(buttonContainer)
    }
    return article

}

function createButton(buttonTypeClass, eventListener, text) {
    const button = document.createElement("button");
    button.classList.add('button', buttonTypeClass);
    button.innerText = text
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function createFinishButton() {
    return createButton("finish-button", function (event) {
        addBookToComplete(event.target.parentElement.parentElement)
    }, "Selesai Dibaca")
}
function createEraseButton() {
    return createButton("erase-button", function (event) {
        document.getElementById('idModal').style.display = 'block'
        removeTaskFromCompleted(event.target.parentElement.parentElement)
    }, "Hapus Buku")
}
function removeTaskFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);


    document.getElementById('deleteBtn').addEventListener("click", function () {
        books.splice(bookPosition, 1);
        taskElement.remove();
        updateDataToStorage();
    })

}

function addBookToComplete(taskElement) {
    const textTitle = taskElement.querySelector(".book_item > h3").innerText
    const textAuthor = taskElement.querySelectorAll(".book_item > p")[0].innerText.replace('Penulis : ', '')
    const textYear = taskElement.querySelectorAll(".book_item > p")[1].innerText.replace('Tahun : ', '')


    const newBook = makeBooks(textTitle, textAuthor, textYear, true)

    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID)
    const book = findBook(taskElement[BOOK_ITEMID])
    book.isCompleted = true
    newBook[BOOK_ITEMID] = book.id

    listCompleted.insertBefore(newBook, listCompleted.firstElementChild)
    taskElement.remove()
    updateDataToStorage()

}

function undoBookfromCompleted(taskElement) {
    const textTitle = taskElement.querySelector(".book_item > h3").innerText
    const textAuthor = taskElement.querySelectorAll(".book_item > p")[0].innerText.replace('Penulis : ', '')
    const textYear = taskElement.querySelectorAll(".book_item > p")[1].innerText.replace('Tahun : ', '')

    const newBook = makeBooks(textTitle, textAuthor, textYear, false)

    const unlistCompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID)
    const book = findBook(taskElement[BOOK_ITEMID])
    book.isCompleted = false
    newBook[BOOK_ITEMID] = book.id

    unlistCompleted.appendChild(newBook)
    taskElement.remove()
    updateDataToStorage()
}

function createUndoButton() {
    return createButton("finish-button", function (event) {
        undoBookfromCompleted(event.target.parentElement.parentElement)
    }, "Belum Selesai Dibaca")
}
function searchBooks() {
    const textSearch = document.getElementById("searchBookTitle").value

    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID)
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID)

    let takes = books.filter((book) => {
        return book.title.includes(textSearch)
    })
    const sumCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID).childElementCount
    const sumUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID).childElementCount
    
    console.log(takes)
    let i = 0
    while (i < sumCompleted) {
        listCompleted.removeChild(listCompleted.lastElementChild)
        i++
    }
    i = 0;
    while (i < sumUncompleted) {
        listUncompleted.removeChild(listUncompleted.lastElementChild)
        i++
    }
    for (book of takes) {
        const newBook = makeBooks(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
        if (book.isCompleted) {
            listCompleted.append(newBook);
            console.log("completed : ", newBook)

        }
        if (book.isCompleted == false) {
            listUncompleted.append(newBook);
            console.log("uncompleted : ", newBook)

        }

    }


}
