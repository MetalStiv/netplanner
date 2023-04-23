import React from 'react';
import { useTransition, animated } from 'react-spring';
import "./alertDialog.scss";

interface IAlertDialogProps {
    btnText: string,
    text: string,
    isShown: boolean,
    onClose: () => void
}

const AlertDialog: React.FC<IAlertDialogProps> = ({ btnText, text, isShown, onClose}) => {    
    const transition = useTransition(isShown, {
        from: {
            x: 0, 
            y: 800, 
            opacity: 0,
            config: {
                duration: 200
            }
        },
        enter: {
            x: 0, 
            y: 0, 
            opacity: 1,
            config: {
                duration: 200
            }
        },
        leave: {
            x: 0, 
            y: 800, 
            opacity: 0,
            config: {
                duration: 200
            }
        }
    });

    const closeModal = () => {
        onClose();
    }
    
    return (
        <>
            {
                isShown ?
                    transition((style, item) => 
                        item &&
                        <div className="modal">
                            <div className="container">
                                <animated.div style={style} className="panel">
                                    <div>{text}</div>
                                    <div className="btn-group">
                                        <button onClick={closeModal} className="btn-close">
                                            {btnText}
                                        </button>
                                    </div> 
                                </animated.div>
                            </div>
                        </div>
                    )
                : ''
            }
        </>
    )
}

export default AlertDialog;