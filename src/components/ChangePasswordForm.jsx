import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from "../services/UserService";
import { useLogout } from "./useLogout";

const ChangePasswordForm = () => {
    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required('Trenutna lozinka je obavezna'),
        newPassword: Yup.string()
            .min(8, 'Lozinka mora imati najmanje 8 karaktera')
            .required('Nova lozinka je obavezna'),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Lozinke se moraju poklapati')
            .required('Potvrda nove lozinke je obavezna')
    });

    const logoutFunction = useLogout();

    return (
        <Formik
            initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={async (fields) => {
                let user = JSON.parse(localStorage.getItem("user"));
                let username = user ? user.username : null;
                const response = await UserService.changePassword(fields.currentPassword, fields.newPassword, username);
                
                if(response) {
                    alert('Uspešna promena lozinke!');
                    logoutFunction();
                }
            }}
        >
            {({ errors, touched }) => (
                <Form>
                    <br></br>
                    <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <label htmlFor="currentPassword">Trenutna lozinka</label>
                        <Field name="currentPassword" type="password" className={'form-control' + (errors.currentPassword && touched.currentPassword ? ' is-invalid' : '')} />
                        <ErrorMessage name="currentPassword" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <label htmlFor="newPassword">Nova lozinka</label>
                        <Field name="newPassword" type="password" className={'form-control' + (errors.newPassword && touched.newPassword ? ' is-invalid' : '')} />
                        <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <label htmlFor="confirmNewPassword">Potvrdite novu lozinku</label>
                        <Field name="confirmNewPassword" type="password" className={'form-control' + (errors.confirmNewPassword && touched.confirmNewPassword ? ' is-invalid' : '')} />
                        <ErrorMessage name="confirmNewPassword" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <br></br>
                        <button type="submit" className="btn btn-primary mr-2">Promenite lozinku</button>
                        <button type="reset" className="btn btn-secondary">Resetujte</button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ChangePasswordForm;
