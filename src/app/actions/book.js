import axios from 'axios';
import config from 'config';
import storage, { keys } from 'misc/storage';
import {
    ERROR_SIGN_UP,
    RECEIVE_USER,
    REQUEST_SIGN_OUT,
    REQUEST_SIGN_UP,
    REQUEST_USER,
    SUCCESS_SIGN_IN,
    SUCCESS_SIGN_UP,
    REQUEST_BOOK,
    RECEIVE_BOOK,
    REQUEST_BOOKS,
    RECEIVE_BOOKS
    
} from '../constants/actionTypes';

const receiveBook = (book) => ({
    payload: book,
    type: RECEIVE_BOOK,
});

const requestBook = (book) => ({
    type: REQUEST_BOOK,
    payload: book,
});

const requestBooks = (books) => ({
    type: REQUEST_BOOKS,
    payload: books,
});

const receiveBooks = (books) => ({
    type: RECEIVE_BOOKS,
    payload: books,
});

const getBook = (id) => {
    const {
        BOOK_SERVICE,
    } = config;
    return axios.get(`${BOOK_SERVICE}/api/books/${id}`);
};

const getBooks = () => {
    const {
        BOOK_SERVICE,
    } = config;
    return axios.get(`${BOOK_SERVICE}/api/books`);
};

const createBookRequest = (bookData) => {
    const { BOOK_SERVICE } = config;
    return axios.post(`${BOOK_SERVICE}/api/books`, bookData, {
        headers: { 'Content-Type': 'application/json' }
    });
};

const deleteBookRequest = (id) => {
    const { BOOK_SERVICE } = config;
    return axios.delete(`${BOOK_SERVICE}/api/books/${id}`);
};

const updateBookRequest = (id, bookData) => {
    const { BOOK_SERVICE } = config;
    return axios.put(`${BOOK_SERVICE}/api/books/${id}`, bookData, {
        headers: { 'Content-Type': 'application/json' }
    });
};

const fetchBook = (id) => (dispatch) => {
    dispatch(requestBook());

    return getBook(id)
        .then((dataOrResponse) => {
            const book = dataOrResponse?.data || dataOrResponse;

            if (book && book.id) {
                dispatch(receiveBook(book));
            } else {
                dispatch(receiveBook(null));
            }
        })
        .catch((error) => {
            dispatch(receiveBook(null));
        });
};

const fetchBooks = (books) => (dispatch) => {
    dispatch(requestBooks(books));

    return getBooks()
        .then((books) => {
            dispatch(receiveBooks(books));
        })
        .catch((error) => {
            dispatch(receiveBooks([]));
        });
};

const getFilteredBooksList = (filters) => {
    const { BOOK_SERVICE } = config;
    return axios.post(`${BOOK_SERVICE}/api/books/_list`, filters, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const fetchFilteredBooksList = (filters) => (dispatch) => {
    dispatch({ type: REQUEST_BOOKS });

    return getFilteredBooksList(filters)
        .then((response) => {
            let data = response;

            if (response && response.data !== undefined) {
                data = response.data;
            }
            dispatch(receiveBooks(data));
        })
        .catch((error) => {
            dispatch(receiveBooks({ list: [], totalPages: 0, totalElements: 0, currentPage: 0, size: 10 }));
        });
};

export const createBook = (bookData) => (dispatch) => {
    return createBookRequest(bookData)
        .then((response) => {
            const newBookId = response.id;
            return newBookId;
        })
        .catch((error) => {
            throw error;
        });
};

export const updateBook = (id, bookData) => (dispatch) => {
    return updateBookRequest(id, bookData)
        .then(() => {
        })
        .catch((error) => {
            throw error;
        });
};


export const deleteBook = (id) => (dispatch) => {
    return deleteBookRequest(id)
        .then(() => {
            dispatch(fetchBooks());
        })
        .catch((error) => {
            throw error;
        });
};

// const fetchBooks = (books) => (dispatch) => {
//     dispatch(requestBooks(books));
//     const allBooks = []
//
//     return getBooks()
//         .then((books) => {
//             dispatch(receiveBooks(books));
//         })
//         .catch((error) => {
//             dispatch(receiveBooks([]));
//         });
// };

const exportFunctions = {
    fetchBook,
    fetchBooks,
    fetchFilteredBooksList,
    createBook,
    updateBook,
    deleteBook,
};

export default exportFunctions;