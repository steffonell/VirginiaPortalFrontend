import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomerService from "../services/CustomerService";
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditClient = () => {
  const [client, setClient] = useState({});
  const { id: clientID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    CustomerService.get(clientID)
      .then(response => {
        const client = response.data;
        setClient(client);
        formik.setValues({
          customerCode: client.customerCode || "",
          nameOfTheLegalEntity: client.nameOfTheLegalEntity || "",
          city: client.city || "",
          address: client.address || "",
          pib: client.pib || "",
          identificationNumber: client.identificationNumber || "",
          contactPerson: client.contactPerson || "",
          contactNumber: client.contactNumber || "",
          email: client.email || "",
          isActive: client.isActive ? 'true' : 'false',
          comment: client.comment || "",
          paymentCurrency: client.paymentCurrency || "",
        });
      }).catch(e => {
        console.log(e);
      });
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerCode: client.customerCode || "",
      nameOfTheLegalEntity: client.nameOfTheLegalEntity || "",
      city: client.city || "",
      address: client.address || "",
      pib: client.pib || "",
      identificationNumber: client.identificationNumber || "",
      contactPerson: client.contactPerson || "",
      contactNumber: client.contactNumber || "",
      email: client.email || "",
      isActive: 'true',
      comment: "",
      paymentCurrency: client.paymentCurrency || "",
    },
    validationSchema: Yup.object().shape({
      nameOfTheLegalEntity: Yup.string().required('Polje "Ime legalnog entiteta" je obavezno.'),
      city: Yup.string().required('Polje "Grad" je obavezno.'),
      address: Yup.string().required('Polje "Adresa" je obavezno.'),
      pib: Yup.string()
        .length(9, 'Polje "PIB" mora imati tačno 9 brojeva.')
        .matches(/^[0-9]+$/, 'Polje "PIB" mora sadržati samo brojeve.')
        .required('Polje "PIB" je obavezno.'),
      identificationNumber: Yup.string()
        .length(8, 'Polje "Matični broj" mora imati tačno 8 brojeva.')
        .matches(/^[0-9]+$/, 'Polje "Matični broj" mora sadržati samo brojeve.')
        .required('Polje "Matični broj" je obavezno.'),
      contactPerson: Yup.string().required('Polje "Kontakt osoba" je obavezno.'),
      contactNumber: Yup.string().required('Polje "Kontakt broj" je obavezno.'),
      email: Yup.string().email('Nevažeća email adresa.').required('Polje "Email" je obavezno.'),
      isActive: Yup.string().required('Obavezno biranje statusa artikla.'),
      paymentCurrency: Yup.string().required('Polje "Valuta plaćanja" je obavezno.'),
    }),
    onSubmit: values => {
      CustomerService.update(clientID, values)
        .then(response => {
          console.log(response.data);
          toast.success('Uspešno ažuriran klijent!');
          navigate(`/clients`);
        })
        .catch(e => {
          console.log(e);
          toast.error('Neuspešno ažuriranje!');
        });
    },
  });

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="submit-form bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full"
      >
        <ToastContainer />
        <div className="space-y-4">
          {[
            { name: 'customerCode', label: 'Šifra Klijenta' },
            { name: 'nameOfTheLegalEntity', label: 'Naziv Legalnog Entiteta' },
            { name: 'city', label: 'Grad' },
            { name: 'address', label: 'Adresa' },
            { name: 'pib', label: 'PIB' },
            { name: 'identificationNumber', label: 'Matični Broj' },
            { name: 'contactPerson', label: 'Kontakt Osoba' },
            { name: 'contactNumber', label: 'Kontakt Broj' },
            { name: 'email', label: 'Email' },
            { name: 'paymentCurrency', label: 'Valuta Plaćanja' }
          ].map((field, index) => (
            <div className="flex flex-col" key={index}>
              <label className="font-medium text-gray-700" htmlFor={field.name}>
                {field.label} :
              </label>
              <input
                type="text"
                name={field.name}
                id={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="p-2 border rounded-md transition duration-300 ease-in-out focus:border-blue-500"
              />
              {formik.touched[field.name] && formik.errors[field.name] ? (
                <div className="text-red-500 text-xs italic">{formik.errors[field.name]}</div>
              ) : null}
            </div>
          ))}

          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="isActive"
                id="isActiveTrue"
                value="true"
                checked={formik.values.isActive === 'true'}
                onChange={formik.handleChange}
                className="mr-2"
              />
              <label htmlFor="isActiveTrue" className="text-gray-700">Aktivan</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="isActive"
                id="isActiveFalse"
                value="false"
                checked={formik.values.isActive === 'false'}
                onChange={formik.handleChange}
                className="mr-2"
              />
              <label htmlFor="isActiveFalse" className="text-gray-700">Neaktivan</label>
            </div>
            {formik.touched.isActive && formik.errors.isActive ? (
              <div className="text-red-500 text-xs italic">{formik.errors.isActive}</div>
            ) : null}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700" htmlFor="comment">
              Komentar:
            </label>
            <textarea
              name="comment"
              id="comment"
              placeholder="Komentar.."
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded-md transition duration-300 ease-in-out focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Ažuriraj Klijenta
        </button>
      </form>
    </div>

  );
};

export default EditClient;

