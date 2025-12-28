import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

const fallbackMessages = {
    title: 'Книги',
    signIn: 'Увійти',
    signOut: 'Вийти',
};

function IntlProvider({ children, messages: propMessages }) {
    const messages = propMessages && Object.keys(propMessages).length > 0
        ? propMessages
        : fallbackMessages;

    return (
        <ReactIntlProvider
            locale="uk-UA"
            defaultLocale="uk-UA"
            messages={messages}
        >
            {children}
        </ReactIntlProvider>
    );
}

export default IntlProvider;