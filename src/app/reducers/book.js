import {
    REQUEST_BOOK,
    RECEIVE_BOOK,
    RECEIVE_BOOKS,
    REQUEST_BOOKS
} from '../constants/actionTypes';

const initialState = {
    book: null,
    books: [],
    isFetching: false,
};

export default function bookReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_BOOK:
            return {
                ...state,
                isFetching: true,
                book: null,
            };

        case RECEIVE_BOOK:
            return {
                ...state,
                isFetching: false,
                book: action.payload,
            };

        case REQUEST_BOOKS:
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVE_BOOKS:
            console.log('RECEIVE_BOOKS payload:', action.payload);

            let newBooks = [];

            if (Array.isArray(action.payload)) {
                newBooks = action.payload;
            } else if (action.payload && action.payload.list && Array.isArray(action.payload.list)) {
                newBooks = action.payload.list;
            }

            return {
                ...state,
                isFetching: false,
                books: newBooks,
            };

        default:
            return state;
    }
}