// Book Class: Represents a Book
class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//Alerts
function showAlerts(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div,form);
    //Vanish in 3 seconds
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

//UI Class: Handle UI Tasks
class UI {
    constructor(books) {
        this.books = books;
    }

    displayBooks() {
        if (this.books){
            this.books.forEach((book) => this.addBookToList(book));
        }
    }

    addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;
        list.appendChild(row);
    }

    deleteBook(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        var inputs = document.querySelector('#book-form').getElementsByTagName('input');
        for (var i=0;i<inputs.length;i++){
            if (inputs[i].type.toLowerCase() === 'text') inputs[i].value = '';
            };
        }
};
//Store Class: Handles Storage
class Store {
    constructor (storage) {
        this.storage = storage;
    };
  
    getBooks() {
        let books;
        if (localStorage.getItem(this.storage) === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem(this.storage));
        }
        return books;
    }
    
    addBook(book) {
        const books = this.getBooks();
        books.push(book);
        try {
            localStorage.setItem(this.storage, JSON.stringify(books));
        } catch (error) {
            if (error == QUOTA_EXCEEDED_ERR) {
                showAlerts('Not enough spase to add book', 'danger')
            } else {
                showAlerts('Unexpected error', 'danger')
            }
            
        }
    }
    
    removeBook(isbn) {
        const books = this.getBooks();
        books.forEach((book,index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
            
        })
        localStorage.setItem(this.storage, JSON.stringify(books))
    }

}
var store = new Store ('myLibrary');
var ui = new UI(store.getBooks());
document.addEventListener('DOMContentLoaded',  e => ui.displayBooks(e));

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();    
    
    //Get from Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if (title === '' || author === '' || isbn === '') {
        showAlerts('Please fill in all fields','danger');
    }
    else {
        //Instansiate Book
        const book = new Book(title,author,isbn);

        //Add Book to UI
        ui.addBookToList(book);

        //Add Book to store
        store.addBook(book);

        //Show success message
        showAlerts('Book successfully added','success');
        
        //Clear fields
        ui.clearFields();


    }
})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    
    //Remove Book from UI
    ui.deleteBook(e.target);
    
    //Remove Book from the Store
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    showAlerts('Book successfully deleted','warning');
})