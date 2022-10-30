import React, { useState, useEffect } from 'react';
import IUser from '../model/IUser'
import { useRootStore } from '../providers/rootProvider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

interface ISignInForm {
    userName: string,
    password: string,
}
interface IRegisterForm {
    userName: string,
    password: string,
    passwordConfirmation: string
}

const LoginForms: React.FC = () => {
    const navigate = useNavigate()
    const userStore = useRootStore()?.getUserStore()

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
        <>
            <h1>NETPLANNER</h1>
            <Tabs>
                <TabList>
                    <Tab>Sign in</Tab>
                    <Tab>Register</Tab>
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
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="userName">UserName</label>
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
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div>
                                {signIn.touched.password && signIn.errors.password && (
                                    <small>{signIn.errors.password}</small>
                                )}
                            </div>
                            <a href="" rel="nofollow">Forgot password?</a>
                        </div>
                        <div style={{ textAlign: 'center', paddingTop: 48 }}>
                            <button className="btn btn-blue" type="submit">LET'S START</button>
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
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="userName">UserName</label>
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
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                />
                                <label htmlFor="password">Password</label>
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
                                <label htmlFor="passwordConfirmation">Password again</label>
                            </div>

                            {register.touched.passwordConfirmation && register.errors.passwordConfirmation && (
                                <small>{register.errors.passwordConfirmation}</small>
                            )}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-blue" type="submit">LET'S START</button>
                        </div>
                    </form>
                </TabPanel>
            </Tabs>
        </>
    )
}

export default LoginForms;