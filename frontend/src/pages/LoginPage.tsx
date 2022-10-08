import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { useRootStore } from "../providers/rootProvider";
import * as Yup from "yup";
import IUser from "../model/IUser";

interface ILoginForm {
    userName: string,
    password: string,
    passwordConfirmation: string
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const userStore = useRootStore()?.getUserStore()

    const formik = useFormik({
        initialValues: {
            userName: 'Name',
            password: '',
            passwordConfirmation: '',
        },
        onSubmit: async (values: ILoginForm) => {
            let userName: string = await new Promise<string>((resolve, reject) => {
                setTimeout(() => resolve(values.userName), 300)
            })
            let user: IUser = {
                guid: userName,
                name: userName
            }
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
                .test('passwords-match', 'Passwords must match', function(value: string | undefined, context){
                    return context.parent.password === value
                })
                //так можно сделать любую проверку, но в данном случае проще записать так: 
                // .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="userName">UserName</label>
            <input
                id="userName"
                name="userName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName && (
                <small>{formik.errors.userName}</small>
            )}
            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
                <small>{formik.errors.password}</small>
            )}
            <label htmlFor="passwordConfirmation">Password again</label>
            <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.passwordConfirmation}
            />
            {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                <small>{formik.errors.passwordConfirmation}</small>
            )}
            <button type="submit">Submit</button>          
        </form>
    );
}

export default LoginPage;
