import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate()
    return (
        <React.Fragment>
            <button onClick={() => navigate('../project')}>To project X</button>
        </React.Fragment>
    );
}

export default HomePage;
