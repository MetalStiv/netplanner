import React from 'react';
import { useTransition, animated } from 'react-spring';
import "./confirmationDialog.scss";

interface IConfirmationDialogProps {
    showText: string,
    btnAcceptText: string,
    btnDeclineText: string,
    questionTextPartOne: string,
    questionTextPartTwo: string,
    questionTextPartThree: string,
    action: () => void
}

const ConfirmationDialog: React.FC<IConfirmationDialogProps> = ({ showText, btnAcceptText,
    btnDeclineText, questionTextPartOne, questionTextPartTwo, questionTextPartThree, action}) => {
    const [modalIsOpen, setIsOpen] = React.useState<boolean>(false);
    
    const transition = useTransition(modalIsOpen, {
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

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const accept = () => {
        action()
        closeModal()
    }
    
    return (
        <>
            <div onClick={openModal}>{showText}</div>
            {
                transition((style, item) => 
                    item &&
                    <div className="modal">
                        <div className="panel-container">
                            <animated.div style={style} className="panel">
                                <div>{questionTextPartOne+' '+questionTextPartTwo+' '+questionTextPartThree+'?'}</div>
                                <div className="btn-group">
                                    <button onClick={closeModal} className="btn-decline">
                                        {btnDeclineText}
                                    </button>
                                    <button onClick={accept} className="btn-accept">
                                        {btnAcceptText}
                                    </button>
                                </div> 
                            </animated.div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ConfirmationDialog;