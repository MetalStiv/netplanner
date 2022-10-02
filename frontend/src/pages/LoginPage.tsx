import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate()
    return (
        <React.Fragment>
            <button onClick={() => navigate('/home')}>Go to home page</button>
        </React.Fragment>
    );
}

export default LoginPage;
