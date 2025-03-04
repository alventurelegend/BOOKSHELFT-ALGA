document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const searchBookForm = document.getElementById("searchBook");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
  
    const STORAGE_KEY = "BOOKS_APPS";
    let editingBookId = null; // Variabel untuk menyimpan ID buku yang sedang diedit
  
    function saveData() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  
    function loadData() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        books = JSON.parse(data);
      } else {
        books = [];
        saveData();
      }
    }
  
    function makeBookElement(book) {
      const bookElement = document.createElement("div");
      bookElement.dataset.bookid = book.id;
      bookElement.dataset.testid = "bookItem";
  
      const titleElement = document.createElement("h3");
      titleElement.dataset.testid = "bookItemTitle";
      titleElement.textContent = book.title;
  
      const authorElement = document.createElement("p");
      authorElement.dataset.testid = "bookItemAuthor";
      authorElement.textContent = `Penulis: ${book.author}`;
  
      const yearElement = document.createElement("p");
      yearElement.dataset.testid = "bookItemYear";
      yearElement.textContent = `Tahun: ${book.year}`;
  
      const buttonContainer = document.createElement("div");
  
      const completeButton = document.createElement("button");
      completeButton.dataset.testid = "bookItemIsCompleteButton";
      completeButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
      completeButton.addEventListener("click", function () {
        book.isComplete = !book.isComplete;
        renderBookList();
        saveData();
      });
  
      const deleteButton = document.createElement("button");
      deleteButton.dataset.testid = "bookItemDeleteButton";
      deleteButton.textContent = "Hapus Buku";
      deleteButton.addEventListener("click", function () {
        books = books.filter((b) => b.id !== book.id);
        renderBookList();
        saveData();
      });
  
      const editButton = document.createElement("button");
      editButton.dataset.testid = "bookItemEditButton";
      editButton.textContent = "Edit Buku";
      editButton.addEventListener("click", function () {
        editingBookId = book.id;
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;
        document.getElementById("bookFormSubmit").textContent = "Simpan Perubahan";
      });
  
      buttonContainer.appendChild(completeButton);
      buttonContainer.appendChild(deleteButton);
      buttonContainer.appendChild(editButton);
  
      bookElement.appendChild(titleElement);
      bookElement.appendChild(authorElement);
      bookElement.appendChild(yearElement);
      bookElement.appendChild(buttonContainer);
  
      return bookElement;
    }
  
    function renderBookList() {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
  
      books.forEach((book) => {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    }
  
    bookForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = parseInt(document.getElementById("bookFormYear").value);
      const isComplete = document.getElementById("bookFormIsComplete").checked;
  
      if (editingBookId) {
        // Edit buku yang ada
        const bookIndex = books.findIndex((book) => book.id === editingBookId);
        if (bookIndex !== -1) {
          books[bookIndex].title = title;
          books[bookIndex].author = author;
          books[bookIndex].year = year;
          books[bookIndex].isComplete = isComplete;
          editingBookId = null; // Reset ID buku yang sedang diedit
          document.getElementById("bookFormSubmit").textContent = "Masukkan Buku ke rak Belum selesai dibaca";
        }
      } else {
        // Tambah buku baru
        const newBook = {
          id: +new Date(),
          title,
          author,
          year,
          isComplete,
        };
        books.push(newBook);
      }
  
      renderBookList();
      saveData();
      bookForm.reset();
    });
  
    searchBookForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
      const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
  
      filteredBooks.forEach((book) => {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    });
  
    loadData();
    renderBookList();
  });
