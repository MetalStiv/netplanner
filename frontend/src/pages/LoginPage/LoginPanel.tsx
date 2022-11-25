import React, { useEffect } from 'react';
import IUser from "../../model/IUser";
import { useRootStore } from "../../providers/rootProvider";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { userCleanMicroservice } from "../../common/axiosMicroservices";
import { login, ISignInForm} from "../../common/login";
import text, { Language } from "../../languages/language";

interface ILoginPanelProps {
    language: Language;
}

interface IRegisterForm {
    email: string,
    password: string,
    passwordConfirmation: string
}

const LoginPanel: React.FC<ILoginPanelProps> = (props) => {
    const navigate = useNavigate()
    const userStore = useRootStore()?.getUserStore()

    const signIn = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values: ISignInForm) => {
            const user: IUser = await login(values);
            userStore?.setData(user)
            navigate('/home')
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(text[props.language].loginPage.userForm.requiredError)
                .email(text[props.language].loginPage.userForm.emailError)
                .max(40, text[props.language].loginPage.userForm.toLongEmailError),
            password: Yup.string()
                .required(text[props.language].loginPage.userForm.requiredError)
                .min(4, text[props.language].loginPage.userForm.toShortPassword)
                .max(20, text[props.language].loginPage.userForm.toLongPasswordError),
        })
    })

    const register = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        onSubmit: async (values: IRegisterForm) => {
            await userCleanMicroservice.post('register', {
                email: values.email,
                password: values.password
            });
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(text[props.language].loginPage.userForm.requiredError)
                .email(text[props.language].loginPage.userForm.emailError)
                .max(40, text[props.language].loginPage.userForm.toLongEmailError),
            password: Yup.string()
                .required(text[props.language].loginPage.userForm.requiredError)
                .min(4, text[props.language].loginPage.userForm.toShortPassword)
                .max(20, text[props.language].loginPage.userForm.toLongPasswordError),
            passwordConfirmation: Yup.string()
                .test('passwords-match', 
                    text[props.language].loginPage.userForm.passwordsDoesNotMatch, 
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
    }, [props]);

    return (
        <>
            <h1>NETPLANNER</h1>
            <Tabs>
                <TabList>
                    <Tab>{text[props.language].loginPage.userForm.signIn}</Tab>
                    <Tab>{text[props.language].loginPage.userForm.register}</Tab>
                </TabList>

                <TabPanel>
                    <form onSubmit={signIn.handleSubmit}>
                        <div className="form-input-block">
                            <div className="form-input">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    onChange={signIn.handleChange}
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
                                    onChange={signIn.handleChange}
                                    value={signIn.values.password}
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="password">{text[props.language].loginPage.userForm.password}</label>
                            </div>
                            <div>
                                {signIn.touched.password && signIn.errors.password && (
                                    <small>{signIn.errors.password}</small>
                                )}
                            </div>
                            <a href="" rel="nofollow">{text[props.language].loginPage.userForm.forgotPassword}</a>
                        </div>
                        <div style={{ textAlign: 'center', paddingTop: 48 }}>
                            <button className="btn btn-blue" type="submit">
                                {text[props.language].loginPage.userForm.buttonStart}
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
                                    onChange={register.handleChange}
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
                                <label htmlFor="password">{text[props.language].loginPage.userForm.password}</label>
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
                                    text[props.language].loginPage.userForm.passwordConfirmation}
                                </label>
                            </div>

                            {register.touched.passwordConfirmation && register.errors.passwordConfirmation && (
                                <small>{register.errors.passwordConfirmation}</small>
                            )}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-blue" type="submit">
                                {text[props.language].loginPage.userForm.buttonRegister}
                            </button>
                        </div>
                    </form>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default LoginPanel;