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
      <form onSubmit={formik.handleSubmit} className="submit-form">
        <ToastContainer />
        <div className="form-group">
          <label>
            Šifra Klijenta :
            <input
              type="text"
              name="customerCode"
              value={formik.values.customerCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.customerCode && formik.errors.customerCode ? (
              <div className="error-message">{formik.errors.customerCode}</div>
            ) : null}
          </label>
          <label>
            Naziv Legalnog Entiteta :
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
            Grad :
            <input
              type="text"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.city && formik.errors.city ? (
              <div className="error-message">{formik.errors.city}</div>
            ) : null}
          </label>

          <label>
            Adresa :
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
            Matični Broj :
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
            Kontakt Osoba :
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
            Kontakt Broj :
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
            Status :
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={formik.values.isActive === 'true'}
                  onChange={formik.handleChange}
                />
                Aktivan
              </label>
              <label>
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={formik.values.isActive === 'false'}
                  onChange={formik.handleChange}
                />
                Neaktivan
              </label>
            </div>
            {formik.touched.isActive && formik.errors.isActive ? (
              <div className="error-message">{formik.errors.isActive}</div>
            ) : null}
          </label>

          <textarea
            type="text"
            name="comment"
            placeholder="Komentar.."
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <label>
            Valuta Plaćanja :
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

