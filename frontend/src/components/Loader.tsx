import React from 'react';
import "./loader.scss";


const Loader: React.FC = () => {    
    
    return (
        <>
            <div className="modal">
                <div className="loader-container">
                    <div className="lds-dual-ring"></div>
                </div>
            </div>
        </>
    )
}

export default Loader;