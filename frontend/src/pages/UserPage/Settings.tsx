import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
//import '../../styles/home/setting/index.scss';
import workImage from '../../assets/images/Work.svg';
import bookImage from '../../assets/images/book.svg';
import settingImage from '../../assets/images/Setting.svg';
import logoutImage from '../../assets/images/Logout.svg';
import icoImage from '../../assets/images/Ellipse.png';


const SettingPage: React.FC = () => {
    const navigate = useNavigate()


    return (
        <div id="settingPage">
            <div className="main">
                {/* <div className="leftMenu">
                </div>  */}
                <div className="settingMenu">

                    <div className="icoImage">
                        <img src={icoImage} alt='Icon' />
                    </div>

                </div>

            </div>
            {/* <div className="leftContent">
                <div className="iconUser">
                    <img src={icoImage} alt='Icon'/>
                </div>
                <div className="frame">
                    <div onClick={()=>navigate('/home')} className="rectangle_white">
                        <img src={workImage} alt='Work'/> 
                    </div>
                    <div className="rectangle_white">
                        <img src={bookImage} alt='Book'/> 
                    </div>    
                        
                    <div className="rectangle">
                        <img src={settingImage} alt='Setting'/> 
                    </div>
                       
                </div>
                    <div onClick={()=>navigate('/')} className="logout">
                        <img src={logoutImage} alt='Logout'/> 
                    </div>
            </div> */}
        </div>

    );
}
export default SettingPage;