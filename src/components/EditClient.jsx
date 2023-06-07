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
        console.log("Response: " + JSON.stringify(response.data));
        setClient(response.data);
      })
      .catch(e => console.log(e));
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nameOfTheLegalEntity: client.nameOfTheLegalEntity || "",
      address: client.address || "",
      pib: client.pib || "",
      identificationNumber: client.identificationNumber || "",
      contactPerson: client.contactPerson || "",
      contactNumber: client.contactNumber || "",
      email: client.email || "",
      paymentCurrency: client.paymentCurrency || "",
    },
    validationSchema: Yup.object().shape({
      nameOfTheLegalEntity: Yup.string().required('Polje "Ime legalnog entiteta" je obavezno.'),
      address: Yup.string().required('Polje "Adresa" je obavezno.'),
      pib: Yup.string()
        .length(9, 'Polje "PIB" mora imati tačno 9 brojeva.')
        .matches(/^[0-9]+$/, 'Polje "PIB" mora sadržati samo brojeve.')
        .required('Polje "PIB" je obavezno.'),
      identificationNumber: Yup.string()
        .length(9, 'Polje "Identifikacioni broj" mora imati tačno 9 brojeva.')
        .matches(/^[0-9]+$/, 'Polje "Identifikacioni broj" mora sadržati samo brojeve.')
        .required('Polje "Identifikacioni broj" je obavezno.'),
      contactPerson: Yup.string().required('Polje "Kontakt osoba" je obavezno.'),
      contactNumber: Yup.string().required('Polje "Kontakt broj" je obavezno.'),
      email: Yup.string().email('Nevažeća email adresa.').required('Polje "Email" je obavezno.'),
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
    <form onSubmit={formik.handleSubmit} className="submit-form">
      <ToastContainer />
      <div className="form-group">
        <label>
          Name of the Legal Entity :
          <input
            type="text"
            name="nameOfTheLegalEntity"
            value={formik.values.nameOfTheLegalEntity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.nameOfTheLegalEntity && formik.errors.nameOfTheLegalEntity ? (
            <div className="error-message">{formik.errors.nameOfTheLegalEntity}</div>
          ) : null}
        </label>

        <label>
          Address :
          <input
            type="text"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="error-message">{formik.errors.address}</div>
          ) : null}
        </label>

        <label>
          PIB :
          <input
            type="text"
            name="pib"
            value={formik.values.pib}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.pib && formik.errors.pib ? (
            <div className="error-message">{formik.errors.pib}</div>
          ) : null}
        </label>

        <label>
          Identification Number :
          <input
            type="text"
            name="identificationNumber"
            value={formik.values.identificationNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.identificationNumber && formik.errors.identificationNumber ? (
            <div className="error-message">{formik.errors.identificationNumber}</div>
          ) : null}
        </label>

        <label>
          Contact Person :
          <input
            type="text"
            name="contactPerson"
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.contactPerson && formik.errors.contactPerson ? (
            <div className="error-message">{formik.errors.contactPerson}</div>
          ) : null}
        </label>

        <label>
          Contact Number :
          <input
            type="text"
            name="contactNumber"
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.contactNumber && formik.errors.contactNumber ? (
            <div className="error-message">{formik.errors.contactNumber}</div>
          ) : null}
        </label>

        <label>
          Email :
          <input
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
        </label>

        <label>
          Payment Currency :
          <input
            type="text"
            name="paymentCurrency"
            value={formik.values.paymentCurrency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.paymentCurrency && formik.errors.paymentCurrency ? (
            <div className="error-message">{formik.errors.paymentCurrency}</div>
          ) : null}
        </label>

      </div>
      <button type="submit">Ažuriraj Klijenta</button>
    </form>
  );
};

export default EditClient;

