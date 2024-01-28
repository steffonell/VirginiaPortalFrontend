import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClientDataService from "../services/CustomerService";
import { toast } from 'react-toastify';  // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for react-toastify

const RegistrationPrompt = () => {
  const validationSchema = Yup.object().shape({
    nameOfTheLegalEntity: Yup.string().required('Polje "Ime legalnog entiteta" je obavezno.'),
    emailOfTheClient: Yup.string().email('Nevažeća email adresa.').required('Polje "Email" je obavezno.')
  });

  const formik = useFormik({
    initialValues: {
      nameOfTheLegalEntity: '',
      emailOfTheClient: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const email = values.emailOfTheClient;
      const nameOfTheLegalEntity = values.nameOfTheLegalEntity;
      ClientDataService.sendRegistrationPrompt(nameOfTheLegalEntity, email)
        .then(() => {
          // Notify success
          toast.success('Uspešno poslat registracioni upit na datu mejl adresu!');
          // Reset the form
          resetForm();
        })
        .catch((error) => {
          // Handle any errors here
          toast.error('Došlo je do greške pri slanju registracionog upita.');
        });
    },
  });

  return (
    <div className="submit-form">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="form-group mb-4">
          <input
            type="text"
            name="nameOfTheLegalEntity"
            placeholder="Ime Legalnog Entiteta"
            value={formik.values.nameOfTheLegalEntity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formik.touched.nameOfTheLegalEntity && formik.errors.nameOfTheLegalEntity ? (
            <div className="error-message text-red-500 text-xs italic">{formik.errors.nameOfTheLegalEntity}</div>
          ) : null}
        </div>
        <div className="flex flex-col space-y-2">
          <input
            name="emailOfTheClient"
            placeholder="Email klijenta"
            value={formik.values.emailOfTheClient}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border rounded-md ${formik.touched.emailOfTheClient && formik.errors.emailOfTheClient ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.emailOfTheClient && formik.errors.emailOfTheClient ? (
            <div className="text-red-500 text-sm">{formik.errors.emailOfTheClient}</div>
          ) : null}
        </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Pošalji Registracioni Upit Na Datu Mejl Adresu
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPrompt;
