import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import Typography from 'components/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import actionsBook from "../../../app/actions/book";
import Button from 'components/Button';

function Default() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const originalBook = useSelector(state => state.book?.book);
    const isFetching = useSelector(state => state.book?.isFetching);

    const isCreating = id === 'new';
    const [isEditing, setIsEditing] = useState(isCreating);

    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        yearPublished: '',
        authorId: '',
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (id && id !== 'new') {
            dispatch(actionsBook.fetchBook(Number(id)));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (originalBook && !isCreating) {
            setFormData({
                title: originalBook.title || '',
                genre: originalBook.genre || '',
                yearPublished: originalBook.yearPublished?.toString() || '',
                authorId: originalBook.author?.id?.toString() || '',
            });
        }
    }, [originalBook, isCreating]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };

    const handleSave = () => {
        if (!formData.title.trim() || !formData.genre.trim() || !formData.yearPublished || !formData.authorId) {
            showMessage('Заповніть усі поля!', 'error');
            return;
        }

        const payload = {
            title: formData.title.trim(),
            genre: formData.genre.trim(),
            yearPublished: Number(formData.yearPublished),
            authorId: Number(formData.authorId),
        };

        let action;
        if (isCreating) {
            action = actionsBook.createBook(payload);
        } else {
            action = actionsBook.updateBook(Number(id), payload);
        }

        dispatch(action)
            .then((newId) => {
                showMessage(isCreating ? 'Книгу успішно створено!' : 'Книгу успішно відредаговано!', 'success');
                if (isCreating && newId) {
                    navigate(`/books/${newId}`);
                } else {
                    setIsEditing(false);
                    dispatch(actionsBook.fetchBook(Number(id)));
                }
            })
            .catch(() => {
                showMessage('Помилка при збереженні', 'error');
            });
    };

    const handleCancel = () => {
        if (isCreating) {
            navigate('/books');
        } else {
            setIsEditing(false);
            if (originalBook) {
                setFormData({
                    title: originalBook.title || '',
                    genre: originalBook.genre || '',
                    yearPublished: originalBook.yearPublished?.toString() || '',
                    authorId: originalBook.author?.id?.toString() || '',
                });
            }
        }
    };

    const handleBack = () => {
        navigate('/books');
    };

    return (
        <div style={{ padding: '20px' }}>
            {message.text && (
                <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    borderRadius: '6px',
                    border: '1px solid ' + (message.type === 'success' ? '#c3e6cb' : '#f5c6cb')
                }}>
                    {message.text}
                </div>
            )}

            <Button onClick={handleBack} style={{ marginBottom: '20px' }}>
                Назад до списку
            </Button>

            <Typography variant="h4" style={{ marginBottom: '30px' }}>
                {isCreating ? 'Створення нової книги' : 'Деталі книги'}
            </Typography>

            {isFetching && <Typography>Завантаження...</Typography>}

            {!isFetching && (
                <div style={{
                    maxWidth: '800px',
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    {!isEditing ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                <div>
                                    <Typography variant="h5" style={{ marginBottom: '20px' }}>
                                        {originalBook?.title || 'Без назви'}
                                    </Typography>
                                    <Typography style={{ marginBottom: '12px', color: '#495057' }}>
                                        Автор: {originalBook?.author?.firstName} {originalBook?.author?.lastName}
                                    </Typography>
                                    <Typography style={{ marginBottom: '12px', color: '#495057' }}>
                                        Жанр: {originalBook?.genre}
                                    </Typography>
                                    <Typography style={{ color: '#495057' }}>
                                        Рік видання: {originalBook?.yearPublished}
                                    </Typography>
                                </div>
                                <Button onClick={() => setIsEditing(true)}>
                                    Редагувати
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" style={{ marginBottom: '30px' }}>
                                {isCreating ? 'Нова книга' : 'Редагування книги'}
                            </Typography>

                            <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Назва книги *"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    placeholder="Жанр *"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    name="yearPublished"
                                    value={formData.yearPublished}
                                    onChange={handleChange}
                                    placeholder="Рік видання *"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    name="authorId"
                                    value={formData.authorId}
                                    onChange={handleChange}
                                    placeholder="ID автора *"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
                                <Button onClick={handleSave} variant="success">
                                    {isCreating ? 'Створити' : 'Зберегти'}
                                </Button>
                                <Button onClick={handleCancel} variant="secondary">
                                    Скасувати
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Default;