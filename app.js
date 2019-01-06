// Book Class: Represents a Book
class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        /* const StoredBooks = [
            {
                title: 'Тайные виды на гору Фудзи',
                author: 'Виктор Пелевин',
                isbn: '978-5-04-098435-0'
            },
            {
                title: 'КайноЗой',
                author: 'Сергей Лукьяненко',
                isbn: '978-5-17-112584-4'
            },
            {
                title: 'Происхождение',
                author: 'Дэн Браун',
                isbn: '978-5-17-106150-0'
            }
        ]; */

        const books = Store.getBooks();
        if (books){
            books.forEach((book) => UI.addBookToList(book));
        }
    }

    static addBookToList(book) {
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

    static deleteBook(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        var inputs = document.querySelector('#book-form').getElementsByTagName('input');
        for (var i=0;i<inputs.length;i++){
            if (inputs[i].type.toLowerCase() === 'text') inputs[i].value = '';
            };
        }

    static showAlerts(message, className){
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
}
//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('myLibrary') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('myLibrary'));
        }
        return books;
    }
    
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        try {
            localStorage.setItem('myLibrary', JSON.stringify(books));
        } catch (error) {
            if (error == QUOTA_EXCEEDED_ERR) {
                UI.showAlerts('Not enough spase to add book', 'danger')
            } else {
                UI.showAlerts('Unexpected error', 'danger')
            }
            
        }
    }
    
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book,index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
            
        })

        localStorage.setItem('myLibrary', JSON.stringify(books))
    }

}
document.addEventListener('DOMContentLoaded', UI.displayBooks)

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
        UI.showAlerts('Please fill in all fields','danger');
    }
    else {
        //Instansiate Book
        const book = new Book(title,author,isbn);

        //Add Book to UI
        UI.addBookToList(book);

        //Add Book to store
        Store.addBook(book);

        //Show success message
        UI.showAlerts('Book successfully added','success');
        
        //Clear fields
        UI.clearFields();


    }
})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    
    //Remove Book from UI
    UI.deleteBook(e.target);
    
    //Remove Book from the Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlerts('Book successfully deleted','warning');
})