import React, { useEffect, useState } from 'react';
import IUser from "../../model/IUser";
import { useRootStore } from "../../providers/rootProvider";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { userCleanMicroservice } from "../../common/axiosMicroservices";
import { login, ISignInForm} from "../../common/login";
import { LanguageData, useLanguageContext } from '../../providers/languageProvider';

interface IRegisterForm {
    email: string,
    password: string,
    passwordConfirmation: string
}

const LoginPanel: React.FC = () => {
    const lang: LanguageData | null = useLanguageContext();
    const userStore = useRootStore()?.getUserStore();

    const navigate = useNavigate();

    const [registrationEmailError, setRegistrationEmailError] = useState<boolean>(false);
    const [invalidUserError, setinvalidUserError] = useState<boolean>(false);
    const [messageWasSent, setMessageWasSent] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const signIn = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values: ISignInForm) => {
            try{
                const user: IUser = await login(values);
                userStore?.setData(user)
                navigate('/home')
            }
            catch(errorCode){
                // const errorCode = (e as Error).message;
                if (errorCode === 520){
                    setinvalidUserError(true)
                }
                if (errorCode === 521){
                    setPasswordError(true)
                }
            }
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .email(lang!.langText.loginPage.userForm.emailError)
                .max(40, lang!.langText.loginPage.userForm.toLongEmailError),
            password: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .min(4, lang!.langText.loginPage.userForm.toShortPassword)
                .max(20, lang!.langText.loginPage.userForm.toLongPasswordError),
        })
    })

    const register = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        onSubmit: async (values: IRegisterForm) => {
            setRegistrationEmailError(false);
            setinvalidUserError(false);
            setMessageWasSent(false);
            let res = await userCleanMicroservice.post('register', {
                email: values.email,
                password: values.password
            });
            if (res.status === 520){
                setRegistrationEmailError(true)
            }
            if (res.status === 200){
                setMessageWasSent(true)
            }
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .email(lang!.langText.loginPage.userForm.emailError)
                .max(40, lang!.langText.loginPage.userForm.toLongEmailError),
            password: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .min(4, lang!.langText.loginPage.userForm.toShortPassword)
                .max(20, lang!.langText.loginPage.userForm.toLongPasswordError),
            passwordConfirmation: Yup.string()
                .test('passwords-match', 
                    lang!.langText.loginPage.userForm.passwordsDoesNotMatch, 
                    function (value: string | undefined, context) {
                        return context.parent.password === value
                })
            //так можно сделать любую проверку, но в данном случае проще записать так: 
            // .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    })

    useEffect(() => {
        signIn.validateForm();
        register.validateForm();
    }, []);

    const clearMessages = () => {
        setRegistrationEmailError(false);
        setinvalidUserError(false);
        setMessageWasSent(false);
    }

    return (
        <>
            <h1>NETPLANNER</h1>
            <Tabs>
                <TabList>
                    <Tab>{lang!.langText.loginPage.userForm.signIn}</Tab>
                    <Tab onFocus={() => clearMessages()}>{lang!.langText.loginPage.userForm.register}</Tab>
                </TabList>

                <TabPanel>
                    <form onSubmit={signIn.handleSubmit}>
                        <div className="form-input-block">
                            <div className="form-input">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    onChange={e => {
                                        setinvalidUserError(false)
                                        setPasswordError(false)
                                        signIn.handleChange(e)
                                    }}
                                    value={signIn.values.email}
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            {signIn.touched.email && signIn.errors.email && (
                                <small>{signIn.errors.email}</small>
                            )}
                        </div>
                        <div className="form-input-block">
                            <div className="form-input">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={e => {
                                        setPasswordError(false)
                                        signIn.handleChange(e)
                                    }}
                                    value={signIn.values.password}
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="password">{lang!.langText.loginPage.userForm.password}</label>
                            </div>
                            <div>
                                {signIn.touched.password && signIn.errors.password && (
                                    <small>{signIn.errors.password}</small>
                                )}
                            </div>
                            {/* <a href="" rel="nofollow">{lang!.langText.loginPage.userForm.forgotPassword}</a> */}
                        </div>
                        {
                            invalidUserError && <small>{lang!.langText.loginPage.userForm.invalidUserError}</small>
                        }
                        {
                            passwordError && <small>{lang!.langText.loginPage.userForm.passwordError}</small>
                        }
                        <div style={{ textAlign: 'center', paddingTop: 48 }}>
                            <button className="btn btn-blue" type="submit">
                                {lang!.langText.loginPage.userForm.buttonStart}
                            </button>
                        </div>
                    </form>
                </TabPanel>
                <TabPanel>
                    <form onSubmit={register.handleSubmit}>
                        <div className="form-input-block">
                            <div className="form-input">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    onChange={(e) => {
                                        clearMessages();
                                        register.handleChange(e)
                                    }}
                                    value={register.values.email}
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            {register.touched.email && register.errors.email && (
                                <small>{register.errors.email}</small>
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
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="password">{lang!.langText.loginPage.userForm.password}</label>
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
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="passwordConfirmation">{
                                    lang!.langText.loginPage.userForm.passwordConfirmation}
                                </label>
                            </div>

                            {register.touched.passwordConfirmation && register.errors.passwordConfirmation && (
                                <small>{register.errors.passwordConfirmation}</small>
                            )}
                        </div>
                        {
                            registrationEmailError && <small>{lang!.langText.loginPage.userForm.registrationEmailError}</small>
                        }
                        {
                            messageWasSent ? <div style={{ textAlign: 'center' }}>
                                    <button className="btn btn-blue" disabled={true}>
                                        {lang!.langText.loginPage.userForm.emailSent}
                                    </button>
                                </div>
                                : <div style={{ textAlign: 'center' }}>
                                    <button className="btn btn-blue" type="submit">
                                        {lang!.langText.loginPage.userForm.buttonRegister}
                                    </button>
                                </div>
                        }
                    </form>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default LoginPanel;