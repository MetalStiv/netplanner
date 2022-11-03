import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { useRootStore } from "../providers/rootProvider";
import * as Yup from "yup";
import IUser from "../model/IUser";
import '../styles/login.scss';
import bmstuIcon from '../assets/images/bmstu-icon.svg';
import loginImage from '../assets/images/login-image.webp';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {lang} from '../languages/lang.js'

interface ISignInForm {
    userName: string,
    password: string,
}
interface IRegisterForm {
    userName: string,
    password: string,
    passwordConfirmation: string
}

const LoginPage: React.FC = () => {
    const [language, setLanguage] = useState("ru")
    const navigate = useNavigate()
    const userStore = useRootStore()?.getUserStore()

    type ObjectKey = keyof typeof lang.lang;
    
        const lang_property = language as ObjectKey;
        console.log(lang.lang[lang_property])
    

    const signIn = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        onSubmit: async (values: ISignInForm) => {
            let userName: string = await new Promise<string>((resolve, reject) => {
                setTimeout(() => resolve(values.userName), 300)
            })
            let user: IUser = {
                guid: userName,
                name: userName
            }
            alert('signIn')
            userStore?.setData(user)
            navigate('/home')
        },
        validationSchema: Yup.object({
            userName: Yup.string()
                .required('It is required field')
                .min(3, 'At least 3 symbols')
                .max(10, 'It is more then 10 symbols'),
            password: Yup.string()
                .required('It is required field')
                .min(4, 'At least 4 symbols')
                .max(12, 'It is more then 12 symbols'),
        })
    })

    const register = useFormik({
        initialValues: {
            userName: '',
            password: '',
            passwordConfirmation: '',
        },
        onSubmit: async (values: IRegisterForm) => {
            let userName: string = await new Promise<string>((resolve, reject) => {
                setTimeout(() => resolve(values.userName), 300)
            })
            let user: IUser = {
                guid: userName,
                name: userName
            }
            alert('register')
            userStore?.setData(user)
            navigate('/home')
        },
        validationSchema: Yup.object({
            userName: Yup.string()
                .required('It is required field')
                .min(3, 'At least 3 symbols')
                .max(10, 'It is more then 10 symbols'),
            password: Yup.string()
                .required('It is required field')
                .min(4, 'At least 4 symbols')
                .max(12, 'It is more then 12 symbols'),
            passwordConfirmation: Yup.string()
                .test('passwords-match', 'Passwords must match', function (value: string | undefined, context) {
                    return context.parent.password === value
                })
            //так можно сделать любую проверку, но в данном случае проще записать так: 
            // .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    })

    return (
        <div id="loginPage">
            <header>
                <div className="container">
                    <div className="nav-bar">
                        <div className="logo-block">
                            <div className="logo">
                                <img src={bmstuIcon} alt="МГТУ им. Н.Э. Баумана" />
                            </div>
                            <p className="tagline">{lang.slog[lang_property].first}<br />{lang.slog[lang_property].second}</p>
                        </div>
                        <div className="nav-block">
                            <a href="#" rel="nofollow" target="_blank">Use Netplanner</a>
                            <a href="#" rel="nofollow" target="_blank">{lang.aboutTheProject[lang_property]}</a>
                            <a href="#" rel="nofollow" target="_blank">Rates</a>
                            <a href="#" rel="nofollow" target="_blank">{lang.contactWithDevelopers[lang_property]}</a>
                        </div>
                        <div className="lang-block">
                            
                            <button onClick={()=>setLanguage('ru')}>{lang.lang[lang_property].l_ru}</button>
                        
                            
                            <button onClick={()=>setLanguage('en')}>{lang.lang[lang_property].l_en}</button>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    <div className="image-block">
                        <img src={loginImage} alt="Netplanner" />
                    </div>
                    <div className="form-block">
                        <h1>NETPLANNER</h1>
                        <Tabs>
                            <TabList>
                                <Tab>{lang.sigIn[lang_property]}</Tab>
                                <Tab>{lang.register[lang_property]}</Tab>
                            </TabList>

                            <TabPanel>
                                <form onSubmit={signIn.handleSubmit}>
                                    <div className="form-input-block">
                                        <div className="form-input">
                                            <input
                                                id="userName"
                                                name="userName"
                                                type="text"
                                                onChange={signIn.handleChange}
                                                value={signIn.values.userName}
                                            />
                                            <label htmlFor="userName">{lang.login[lang_property]}</label>
                                        </div>

                                        {signIn.touched.userName && signIn.errors.userName && (
                                            <small>{signIn.errors.userName}</small>
                                        )}
                                    </div>
                                    <div className="form-input-block">
                                        <div className="form-input">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                onChange={signIn.handleChange}
                                                value={signIn.values.password}
                                            />
                                            <label htmlFor="password">{lang.password[lang_property]}</label>
                                        </div>
                                        <div>
                                            {signIn.touched.password && signIn.errors.password && (
                                                <small>{signIn.errors.password}</small>
                                            )}
                                        </div>
                                        <a href="" rel="nofollow">{lang.forgotPassword[lang_property]}</a>
                                    </div>
                                    <div style={{ textAlign: 'center', paddingTop: 48 }}>
                                        <button className="btn btn-blue" type="submit">{lang.buttonStart[lang_property]}</button>
                                    </div>
                                </form>
                            </TabPanel>
                            <TabPanel>
                                <form onSubmit={register.handleSubmit}>
                                    <div className="form-input-block">
                                        <div className="form-input">
                                            <input
                                                id="userName"
                                                name="userName"
                                                type="text"
                                                onChange={register.handleChange}
                                                value={register.values.userName}
                                            />
                                            <label htmlFor="userName">{lang.login[lang_property]}</label>
                                        </div>

                                        {register.touched.userName && register.errors.userName && (
                                            <small>{register.errors.userName}</small>
                                        )}
                                    </div>
                                    <div className="form-input-block">
                                        <div className="form-input">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                onChange={register.handleChange}
                                                value={register.values.password}
                                            />
                                            <label htmlFor="password">{lang.password[lang_property]}</label>
                                        </div>

                                        {register.touched.password && register.errors.password && (
                                            <small>{register.errors.password}</small>
                                        )}
                                    </div>
                                    <div className="form-input-block">
                                        <div className="form-input">
                                            <input
                                                id="passwordConfirmation"
                                                name="passwordConfirmation"
                                                type="password"
                                                onChange={register.handleChange}
                                                value={register.values.passwordConfirmation}
                                            />
                                            <label htmlFor="passwordConfirmation">{lang.passwordAgain[lang_property]}</label>
                                        </div>

                                        {register.touched.passwordConfirmation && register.errors.passwordConfirmation && (
                                            <small>{register.errors.passwordConfirmation}</small>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <button className="btn btn-blue" type="submit">{lang.buttonStart[lang_property]}</button>
                                    </div>
                                </form>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </main>
            <footer>

            </footer>
        </div>
    );
}

export default LoginPage;
