import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClientDataService from '../services/CustomerService';

const AddClient = () => {

    const validationSchema = Yup.object().shape({
        nameOfTheLegalEntity: Yup.string().required('Polje "Ime legalnog entiteta" je obavezno.'),
        address: Yup.string().required('Polje "Adresa" je obavezno.'),
        pib: Yup.string().required('Polje "PIB" je obavezno.'),
        identificationNumber: Yup.string().required('Polje "Identifikacioni broj" je obavezno.'),
        contactPerson: Yup.string().required('Polje "Kontakt osoba" je obavezno.'),
        contactNumber: Yup.string().required('Polje "Kontakt broj" je obavezno.'),
        email: Yup.string().email('Nevažeća email adresa.').required('Polje "Email" je obavezno.'),
        paymentCurrency: Yup.string().required('Polje "Valuta plaćanja" je obavezno.'),
      });

    const formik = useFormik({
        initialValues: {
            nameOfTheLegalEntity: '',
            address: '',
            pib: '',
            identificationNumber: '',
            contactPerson: '',
            contactNumber: '',
            email: '',
            paymentCurrency: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            ClientDataService.create(values)
                .then((response) => {
                    console.log(response.data);
                    resetForm();
                })
                .catch((e) => {
                    console.log(e);
                });
        },
    });

    return (
        <div className="submit-form">
            <h2>Dodaj Klijenta</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nameOfTheLegalEntity">Ime Legalnog Entiteta</label>
                    <input
                        type="text"
                        name="nameOfTheLegalEntity"
                        placeholder="Ime Legalnog Entiteta"
                        value={formik.values.nameOfTheLegalEntity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.nameOfTheLegalEntity && formik.errors.nameOfTheLegalEntity ? (
                        <div className="error-message">{formik.errors.nameOfTheLegalEntity}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Adresa</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Adresa"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <div className="error-message">{formik.errors.address}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="pib">PIB</label>
                    <input
                        type="text"
                        name="pib"
                        placeholder="PIB"
                        value={formik.values.pib}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.pib && formik.errors.pib ? (
                        <div className="error-message">{formik.errors.pib}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="identificationNumber">Identifikacioni Broj</label>
                    <input
                        type="text"
                        name="identificationNumber"
                        placeholder="Identifikacioni Broj"
                        value={formik.values.identificationNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.identificationNumber && formik.errors.identificationNumber ? (
                        <div className="error-message">{formik.errors.identificationNumber}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="contactPerson">Kontakt Osoba</label>
                    <input
                        type="text"
                        name="contactPerson"
                        placeholder="Kontakt Osoba"
                        value={formik.values.contactPerson}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.contactPerson && formik.errors.contactPerson ? (
                        <div className="error-message">{formik.errors.contactPerson}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="contactNumber">Kontakt Broj</label>
                    <input
                        type="text"
                        name="contactNumber"
                        placeholder="Kontakt Broj"
                        value={formik.values.contactNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.contactNumber && formik.errors.contactNumber ? (
                        <div className="error-message">{formik.errors.contactNumber}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="error-message">{formik.errors.email}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="paymentCurrency">Valuta Placanja</label>
                    <input
                        type="text"
                        name="paymentCurrency"
                        placeholder="Valuta Placanja"
                        value={formik.values.paymentCurrency}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.paymentCurrency && formik.errors.paymentCurrency ? (
                        <div className="error-message">{formik.errors.paymentCurrency}</div>
                    ) : null}
                </div>

                <button type="submit">Dodaj Klijenta</button>
            </form>
        </div>
    );
};

export default AddClient;
