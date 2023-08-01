import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import * as Yup from "yup";
import { userMicroservice } from "../../../common/axiosMicroservices";

interface IChangePasswordModalFormProps {
    close: () => void,
}

interface IChangePasswordModalForm{
    oldPassword: string,
    newPassword: string,
    passwordConfirmation: string,
}

const ChangePasswordModalForm: React.FC<IChangePasswordModalFormProps> = observer(({ close }) => {
    const lang: LanguageData | null = useLanguageContext();
    const [isWrongPassword, setIsWrongPassword] = useState<boolean>(false);
    // const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);

    const changePassword = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
        },
        onSubmit: async (values: IChangePasswordModalForm) => {
            setIsWrongPassword(false);
            // setIsPasswordChanged(false);
            const res = await userMicroservice.post('changePassword', {
                oldPassword: values.oldPassword, newPassword: values.newPassword
            })
            if (res.status === 520){
                setIsWrongPassword(true)
            }
            if (res.status === 200){
                // setIsPasswordChanged(true)
                close()
            }
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .min(4, lang!.langText.loginPage.userForm.toShortPassword)
                .max(20, lang!.langText.loginPage.userForm.toLongPasswordError),
            newPassword: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .min(4, lang!.langText.loginPage.userForm.toShortPassword)
                .max(20, lang!.langText.loginPage.userForm.toLongPasswordError),
            passwordConfirmation: Yup.string()
                .required(lang!.langText.loginPage.userForm.requiredError)
                .oneOf([Yup.ref('newPassword'), null], lang!.langText.loginPage.userForm.passwordsDoesNotMatch)
        })
    })

    return (
        <React.Fragment>
            <div className="modal">
                <div className="show-form-container">
                    <div className="show-form-panel" id="change-password-form">
                        <div className="show-form-header">
                            <div className="show-form-title">
                                {lang?.langText.userPage.settingsTab.changePasswordForm.title}
                            </div>
                            <div className="close-icon" onClick={() => close()}>x
                            </div>
                        </div>

                        <form onSubmit={changePassword.handleSubmit} style={{width: '100%', paddingLeft: '15%'}}>
                            <div className="show-form-sent-form-body">
                                <div className="show-form-sent-form">
                                    <label htmlFor="oldPassword">{lang!.langText.userPage.settingsTab.changePasswordForm.oldPassword}</label>
                                    <input
                                        id="oldPassword"
                                        name="oldPassword"
                                        type="password"
                                        onChange={changePassword.handleChange}
                                        value={changePassword.values.oldPassword}
                                        readOnly
                                        onFocus={(e) => e.target.removeAttribute('readonly')}
                                        className="show-form-sent-input"
                                    />
                                </div>
                                <div>
                                    {changePassword.touched.oldPassword && changePassword.errors.oldPassword && (
                                        <div style={{textAlign: 'center'}}>
                                            <small>{changePassword.errors.oldPassword}</small>
                                        </div>
                                    )}
                                </div>

                                <div className="show-form-sent-form">
                                    <label htmlFor="newPassword">{lang!.langText.userPage.settingsTab.changePasswordForm.newPassword}</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        onChange={changePassword.handleChange}
                                        value={changePassword.values.newPassword}
                                        readOnly
                                        onFocus={(e) => e.target.removeAttribute('readonly')}
                                        className="show-form-sent-input"
                                    />
                                </div>
                                <div>
                                    {changePassword.touched.newPassword && changePassword.errors.newPassword && (
                                        <div style={{textAlign: 'center'}}>
                                            <small>{changePassword.errors.newPassword}</small>
                                        </div>
                                    )}
                                </div>

                                <div className="show-form-sent-form">
                                    <label htmlFor="passwordConfirmation">{lang!.langText.userPage.settingsTab.changePasswordForm.passwordConfirmation}</label>
                                    <input
                                        id="passwordConfirmation"
                                        name="passwordConfirmation"
                                        type="password"
                                        onChange={changePassword.handleChange}
                                        value={changePassword.values.passwordConfirmation}
                                        readOnly
                                        onFocus={(e) => e.target.removeAttribute('readonly')}
                                        className="show-form-sent-input"
                                    />
                                </div>
                                <div>
                                    {changePassword.touched.passwordConfirmation && changePassword.errors.passwordConfirmation && (
                                        <div style={{textAlign: 'center'}}>
                                            <small>{changePassword.errors.passwordConfirmation}</small>
                                        </div>
                                    )}
                                </div>

                                {
                                    isWrongPassword && <div style={{textAlign: 'center'}}>
                                            <small>{lang!.langText.userPage.settingsTab.changePasswordForm.wrongPassword}</small>
                                        </div>
                                }

                                <div style={{ textAlign: 'center', paddingTop: 24 }}>
                                    <button className="btn btn-blue" type="submit">
                                        {lang!.langText.userPage.settingsTab.changePasswordForm.submit}
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
})

export default ChangePasswordModalForm;