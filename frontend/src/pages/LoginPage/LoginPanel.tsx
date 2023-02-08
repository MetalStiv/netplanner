import React, { useEffect, useState } from 'react';
import IUser from "../../model/IUser";
import { useRootStore } from "../../providers/rootProvider";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { userCleanMicroservice } from "../../common/axiosMicroservices";
import { login, ISignInForm} from "../../common/login";
import useLanguage from '../../common/customHooks/useLanguage';

interface IRegisterForm {
    email: string,
    password: string,
    passwordConfirmation: string
}

const LoginPanel: React.FC = () => {
    const navigate = useNavigate();
    const [, , , langText] = useLanguage();
    const userStore = useRootStore()?.getUserStore();
    const [registrationEmailError, setRegistrationEmailError] = useState<boolean>(false);
    const [invalidUserError, setinvalidUserError] = useState<boolean>(false);
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
            catch(e){
                const errorCode = (e as Error).message;
                if (errorCode === "520"){
                    setinvalidUserError(true)
                }
                if (errorCode === "521"){
                    setPasswordError(true)
                }
            }
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(langText.loginPage.userForm.requiredError)
                .email(langText.loginPage.userForm.emailError)
                .max(40, langText.loginPage.userForm.toLongEmailError),
            password: Yup.string()
                .required(langText.loginPage.userForm.requiredError)
                .min(4, langText.loginPage.userForm.toShortPassword)
                .max(20, langText.loginPage.userForm.toLongPasswordError),
        })
    })

    const register = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        onSubmit: async (values: IRegisterForm) => {
            let res = await userCleanMicroservice.post('register', {
                email: values.email,
                password: values.password
            });
            if (res.status === 520){
                setRegistrationEmailError(true)
            }
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(langText.loginPage.userForm.requiredError)
                .email(langText.loginPage.userForm.emailError)
                .max(40, langText.loginPage.userForm.toLongEmailError),
            password: Yup.string()
                .required(langText.loginPage.userForm.requiredError)
                .min(4, langText.loginPage.userForm.toShortPassword)
                .max(20, langText.loginPage.userForm.toLongPasswordError),
            passwordConfirmation: Yup.string()
                .test('passwords-match', 
                    langText.loginPage.userForm.passwordsDoesNotMatch, 
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

    return (
        <>
            <h1>NETPLANNER</h1>
            <Tabs>
                <TabList>
                    <Tab>{langText.loginPage.userForm.signIn}</Tab>
                    <Tab>{langText.loginPage.userForm.register}</Tab>
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
                                <label htmlFor="password">{langText.loginPage.userForm.password}</label>
                            </div>
                            <div>
                                {signIn.touched.password && signIn.errors.password && (
                                    <small>{signIn.errors.password}</small>
                                )}
                            </div>
                            <a href="" rel="nofollow">{langText.loginPage.userForm.forgotPassword}</a>
                        </div>
                        {
                            invalidUserError && <small>{langText.loginPage.userForm.invalidUserError}</small>
                        }
                        {
                            passwordError && <small>{langText.loginPage.userForm.passwordError}</small>
                        }
                        <div style={{ textAlign: 'center', paddingTop: 48 }}>
                            <button className="btn btn-blue" type="submit">
                                {langText.loginPage.userForm.buttonStart}
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
                                    onChange={e => {
                                        setRegistrationEmailError(false)
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
                                <label htmlFor="password">{langText.loginPage.userForm.password}</label>
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
                                    langText.loginPage.userForm.passwordConfirmation}
                                </label>
                            </div>

                            {register.touched.passwordConfirmation && register.errors.passwordConfirmation && (
                                <small>{register.errors.passwordConfirmation}</small>
                            )}
                        </div>
                        {
                            registrationEmailError && <small>{langText.loginPage.userForm.registrationEmailError}</small>
                        }
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-blue" type="submit">
                                {langText.loginPage.userForm.buttonRegister}
                            </button>
                        </div>
                    </form>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default LoginPanel;