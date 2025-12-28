import DetailsPage from 'pages/details';
import React from 'react';

import PageContainer from './components/PageContainer';

const Details = (props) => {
    return (
        <PageContainer>
            <DetailsPage {...props} />
        </PageContainer>
    );
};

export default Details;