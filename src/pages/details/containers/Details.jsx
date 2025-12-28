import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import Typography from 'components/Typography';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import actionsBook from '../../../app/actions/book';
import Button from 'components/Button';
import Close from "../../../components/icons/Close";

function Details() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const rawBooks = useSelector(state => state.book.books || []);
    const isFetching = useSelector(state => state.book.isFetching || false);

    const [filters, setFilters] = useState({
        genre: '',
        authorId: '',
        yearPublished: '',
        page: 0,
        size: 2,
    });

    const totalBooks = Array.isArray(rawBooks) ? rawBooks : (rawBooks.list || []);
    const totalItems = totalBooks.length;
    const totalPages = Math.ceil(totalItems / filters.size);
    const startIndex = filters.page * filters.size;
    const currentBooks = totalBooks.slice(startIndex, startIndex + filters.size);

    const [deleteModal, setDeleteModal] = useState({ open: false, bookId: null, bookTitle: '' });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(actionsBook.fetchBooks());
    }, [dispatch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 0 }));
    };

    const handleApplyFilters = () => {
        const payload = {
            genre: filters.genre.trim() || null,
            authorId: filters.authorId ? Number(filters.authorId) : null,
            yearPublished: filters.yearPublished ? Number(filters.yearPublished) : null,
            page: filters.page,
            size: filters.size,
        };

        if (payload.genre || payload.authorId || payload.yearPublished) {
            dispatch(actionsBook.fetchFilteredBooksList(payload));
        } else {
            dispatch(actionsBook.fetchBooks());
        }
    };

    const handleClearFilters = () => {
        setFilters({
            genre: '',
            authorId: '',
            yearPublished: '',
            page: 0,
            size: 2,
        });
        dispatch(actionsBook.fetchBooks());
    };

    const goToPage = (page) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo(0, 0);
    };

    const handleDeleteClick = (e, book) => {
        e.stopPropagation();
        setDeleteModal({ open: true, bookId: book.id, bookTitle: book.title || `Книга ${book.id}` });
    };

    const confirmDelete = () => {
        dispatch(actionsBook.deleteBook(deleteModal.bookId))
            .then(() => {
                setToast({ type: 'success', message: `Книга "${deleteModal.bookTitle}" видалена` });
                setDeleteModal({ open: false });
                dispatch(actionsBook.fetchBooks());
                setTimeout(() => setToast(null), 3000);
            })
            .catch(() => {
                setToast({ type: 'error', message: 'Помилка при видаленні' });
                setTimeout(() => setToast(null), 3000);
            });
    };

    return (
        <div>
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '12px 20px',
                    backgroundColor: toast.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: toast.type === 'success' ? '#155724' : '#721c24',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000
                }}>
                    {toast.message}
                </div>
            )}

            <div style={{ textAlign: 'right', margin: '20px 0' }}>
                <Button onClick={() => navigate('/books/new')}>
                    + Додати книгу
                </Button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Жанр</label>
                        <input type="text" name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Roman" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">ID автора</label>
                        <input type="number" name="authorId" value={filters.authorId} onChange={handleFilterChange} placeholder="1" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Рік видання</label>
                        <input type="number" name="yearPublished" value={filters.yearPublished} onChange={handleFilterChange} placeholder="2024" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button onClick={handleClearFilters}>Очистити</Button>
                    <Button onClick={handleApplyFilters}>Застосувати фільтри</Button>
                </div>
            </div>

            <Typography variant="h4">Всі книги ({totalItems})</Typography>

            {isFetching && <Typography>Завантаження...</Typography>}

            {!isFetching && currentBooks.length === 0 && (
                <Typography color="error">Книги не знайдено</Typography>
            )}

            {!isFetching && currentBooks.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    {currentBooks.map(book => (
                        <div
                            key={book.id}
                            style={{
                                position: 'relative',
                                margin: '20px 0',
                                padding: '20px',
                                backgroundColor: '#f0f8ff',
                                borderRadius: '10px',
                                border: '1px solid #b0d4ff',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={() => navigate(`/books/${book.id}`)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f3ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                        >
                            <div
                                onClick={(e) => handleDeleteClick(e, book)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    cursor: 'pointer',
                                    opacity: 0,
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                <Close size={28} color="#dc3545" />
                            </div>

                            <style jsx>{`
                                div:hover > div[style*="position: absolute"] {
                                    opacity: 1 !important;
                                }
                            `}</style>

                            <Typography variant="h5">{book.title}</Typography>
                            <Typography>Автор: {book.authorName || `${book.author?.firstName} ${book.author?.lastName}`}</Typography>
                            <Typography>Жанр: {book.genre}</Typography>
                            <Typography>Рік видання: {book.yearPublished}</Typography>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div style={{
                    margin: '50px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <Button onClick={() => goToPage(0)} disabled={filters.page === 0}>Перша</Button>
                    <Button onClick={() => goToPage(filters.page - 1)} disabled={filters.page === 0}>Назад</Button>
                    <span>Сторінка <strong>{filters.page + 1}</strong> з <strong>{totalPages}</strong></span>
                    <Button onClick={() => goToPage(filters.page + 1)} disabled={filters.page === totalPages - 1}>Далі</Button>
                    <Button onClick={() => goToPage(totalPages - 1)} disabled={filters.page === totalPages - 1}>Остання</Button>
                </div>
            )}

            {deleteModal.open && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setDeleteModal({ open: false })}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }} onClick={(e) => e.stopPropagation()}>
                        <Typography variant="h6" style={{ marginBottom: '20px' }}>
                            Видалити книгу "{deleteModal.bookTitle}"?
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <Button onClick={confirmDelete}>Видалити</Button>
                            <Button onClick={() => setDeleteModal({ open: false })}>Скасувати</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Details;