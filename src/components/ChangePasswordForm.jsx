import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
                    <div className="max-w-md mx-auto p-4 shadow-md rounded-lg my-5">
                        <h2 className="text-lg text-center font-semibold mb-6">Promena Lozinke</h2>
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">Trenutna lozinka</label>
                            <Field name="currentPassword" type="password" className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.currentPassword && touched.currentPassword ? ' border-red-500' : ''}`} />
                            <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">Nova lozinka</label>
                            <Field name="newPassword" type="password" className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.newPassword && touched.newPassword ? ' border-red-500' : ''}`} />
                            <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2">Potvrdite novu lozinku</label>
                            <Field name="confirmNewPassword" type="password" className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.confirmNewPassword && touched.confirmNewPassword ? ' border-red-500' : ''}`} />
                            <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">Promenite lozinku</button>
                            <button type="reset" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Resetujte</button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ChangePasswordForm;
