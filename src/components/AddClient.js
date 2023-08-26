import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClientDataService from '../services/CustomerService';
import BrandService from "../services/BrandService";
import '../styles/addClientStyle.css';
import { getAllowedRoles } from './utils';

const AddClient = () => {

    const [modalFormBrandDiscountVisible, setModalFormBrandDiscountVisible] = useState(false);
    const [modalFormDeliveryAddressVisible, setModalFormDeliveryAddressVisible] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandDiscounts, setBrandDiscounts] = useState([]);
    const [customerDeliveryAddresses, setCustomerDeliveryAddresses] = useState([]);

    // Dobavi brendove koristeći BrandService
    useEffect(() => {
        retrieveBrands(); // log the modalFormBrandDiscountVisible state whenever it changes
    }, []);

    const retrieveBrands = () => {
        BrandService.getAll()
            .then(response => {
                setBrands(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const addDeliveryAddress = (deliveryAddress) => {
        setCustomerDeliveryAddresses(prevCustomerDeliveryAddresses => [...prevCustomerDeliveryAddresses, deliveryAddress]);
        window.confirm('Uspešno Dodata Poslovna Jedinica!');
    }

    const addBrandDiscount = (brand, discount) => {
        setBrandDiscounts(prevBrandDiscounts => {
            return { ...prevBrandDiscounts, [brand]: discount };
        });
        window.confirm('Uspešno Dodat Rabat!');
    }

    const validationSchema = Yup.object().shape({
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
        paymentCurrency: Yup.string().required('Polje "Valuta plaćanja" je obavezno.'),
        role: Yup.string().required('Izaberite privilegije novog klijenta.'),
    });

    const brandValidationSchema = Yup.object().shape({
        selectedBrand: Yup.string().required('Morate izabrati brend radi unosa rabata.'),
        brandDiscount: Yup.string()
            .matches(/^[0-9]+$/, 'Polje "Rabat Brenda" mora sadržati samo brojeve.')
            .required('Polje "Rabat Brenda" je obavezno.'),
    });

    const deliveryAddressValidationSchema = Yup.object().shape({
        name: Yup.string().required('Polje "Naziv Poslovne Jedinice" je obavezno.'),
        city: Yup.string().required('Polje "Grad" je obavezno.'),
        address: Yup.string().required('Polje "Adresa" je obavezno.'),
        contactPerson: Yup.string(),
        contactNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Polje "Rabat Brenda" mora sadržati samo brojeve.'),
        email: Yup.string().email('Nevažeća email adresa.'),
    });

    //TWILLIO I MESSAGE BIRD ZA PORUKE DA PROUCIM

    const deliveryAddressFormik = useFormik({
        initialValues: {
            name: '',
            city: '',
            address: '',
            contactPerson: '',
            contactNumber: '',
            email: '',
        },
        validationSchema: deliveryAddressValidationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            addDeliveryAddress(values);
            setModalFormDeliveryAddressVisible(false);
            resetForm();
            console.log(customerDeliveryAddresses);
        },
    });

    const brandFormik = useFormik({
        initialValues: {
            selectedBrand: '',
            brandDiscount: '',
        },
        validationSchema: brandValidationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            addBrandDiscount(values.selectedBrand, values.brandDiscount);
            setModalFormBrandDiscountVisible(false);
            resetForm();
            console.log(brandDiscounts);
        },
    });

    const formik = useFormik({
        initialValues: {
            customerCode: '',
            nameOfTheLegalEntity: '',
            city: '',
            address: '',
            pib: '',
            identificationNumber: '',
            contactPerson: '',
            contactNumber: '',
            email: '',
            paymentCurrency: '',
            role: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            if (!formik.isValid) {
                setSubmitting(false);
                return;
            }        
            console.log("PRESSED");
            // separate the clientData and role from the form values
            const { role, ...clientData } = values;

            console.log(clientData);
            // You can use role and clientData separately in your request
            ClientDataService.createCustomerWithDiscountAndAddresses(clientData, role, brandDiscounts, customerDeliveryAddresses)
                .then((response) => {
                    console.log(response.data);
                    resetForm();
                    window.confirm('Uspešno kreiran klijent!');
                })
                .catch((e) => {
                    console.log(e);
                });
        },
    });

    return (
        <div className="submit-form">
            <h2>Forma Za Dodavanje Klijenta</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerCode">Šifra Klijenta</label>
                    <input
                        type="text"
                        name="customerCode"
                        placeholder="Šifra Klijenta"
                        value={formik.values.customerCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
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
                    <label htmlFor="role">Uloga</label>
                    <select
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>Odaberite ulogu</option> {/* This is the default empty option */}
                        {getAllowedRoles().map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    {formik.touched.role && formik.errors.role ? (
                        <div className="error-message">{formik.errors.role}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="city">Grad</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Grad"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.city && formik.errors.city ? (
                        <div className="error-message">{formik.errors.city}</div>
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
                    <label htmlFor="identificationNumber">Matični Broj</label>
                    <input
                        type="text"
                        name="identificationNumber"
                        placeholder="Matični Broj"
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
                <div className="form-group">
                    <button type="button" onClick={() => setModalFormBrandDiscountVisible(true)}>Dodaj Rabat</button>
                    <button type="button" onClick={() => setModalFormDeliveryAddressVisible(true)}>Dodaj Poslovnu Jedinicu</button>
                </div>
                <button type="submit">Potvrdi Unos Klijenta</button>
            </form>

            {modalFormDeliveryAddressVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalFormDeliveryAddressVisible(false)}>
                            &times;
                        </span>
                        <form onSubmit={deliveryAddressFormik.handleSubmit} className="submit-form">
                            <div className="form-group">
                                <label>
                                    Naziv poslovne jedinice :
                                    <input
                                        type="text"
                                        name="name"
                                        value={deliveryAddressFormik.values.name}
                                        onChange={deliveryAddressFormik.handleChange}
                                        onBlur={deliveryAddressFormik.handleBlur}
                                    />
                                    {deliveryAddressFormik.touched.name && deliveryAddressFormik.errors.name ? (
                                        <div className="error-message">{deliveryAddressFormik.errors.name}</div>
                                    ) : null}
                                </label>
                                <label>
                                    Grad :
                                    <input
                                        type="text"
                                        name="city"
                                        value={deliveryAddressFormik.values.city}
                                        onChange={deliveryAddressFormik.handleChange}
                                        onBlur={deliveryAddressFormik.handleBlur}
                                    />
                                    {deliveryAddressFormik.touched.city && deliveryAddressFormik.errors.city ? (
                                        <div className="error-message">{deliveryAddressFormik.errors.city}</div>
                                    ) : null}
                                </label>
                                <label>
                                    Adresa :
                                    <input
                                        type="text"
                                        name="address"
                                        value={deliveryAddressFormik.values.address}
                                        onChange={deliveryAddressFormik.handleChange}
                                        onBlur={deliveryAddressFormik.handleBlur}
                                    />
                                    {deliveryAddressFormik.touched.address && deliveryAddressFormik.errors.address ? (
                                        <div className="error-message">{deliveryAddressFormik.errors.address}</div>
                                    ) : null}
                                </label>
                                <label>
                                    Kontakt Osoba :
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={deliveryAddressFormik.values.contactPerson}
                                        onChange={deliveryAddressFormik.handleChange}
                                        onBlur={deliveryAddressFormik.handleBlur}
                                    />
                                    {deliveryAddressFormik.touched.contactPerson && deliveryAddressFormik.errors.contactPerson ? (
                                        <div className="error-message">{deliveryAddressFormik.errors.contactPerson}</div>
                                    ) : null}
                                </label>
                                <label>
                                    Kontakt Broj :
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={deliveryAddressFormik.values.contactNumber}
                                        onChange={deliveryAddressFormik.handleChange}
                                        onBlur={deliveryAddressFormik.handleBlur}
                                    />
                                    {deliveryAddressFormik.touched.contactNumber && deliveryAddressFormik.errors.contactNumber ? (
                                        <div className="error-message">{deliveryAddressFormik.errors.contactNumber}</div>
                                    ) : null}
                                </label>
                                <label>
                                    Email :
                                    <input
                                        type="text"
                                        name="email"
                                        value={deliveryAddressFormik.values.email}
                                        onChange={deliveryAddressFormik.handleChange}
                                        onBlur={deliveryAddressFormik.handleBlur}
                                    />
                                    {deliveryAddressFormik.touched.email && deliveryAddressFormik.errors.email ? (
                                        <div className="error-message">{deliveryAddressFormik.errors.email}</div>
                                    ) : null}
                                </label>
                            </div>
                            <button type="submit">Unesite Poslovnu Jedinicu</button>
                        </form>
                    </div>
                </div>
            )}

            {modalFormBrandDiscountVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalFormBrandDiscountVisible(false)}>
                            &times;
                        </span>
                        <form onSubmit={brandFormik.handleSubmit} className="submit-form">
                            <div className="form-group">
                                <label>
                                    Izaberite Brend:
                                    <select
                                        name="selectedBrand"
                                        value={brandFormik.values.selectedBrand}
                                        onChange={brandFormik.handleChange}
                                        onBlur={brandFormik.handleBlur}
                                    >
                                        <option key="0" value="">
                                            Izaberite Brend
                                        </option>
                                        {brands.map((brand, index) => (
                                            <option key={index + 1} value={brand.brandName}>
                                                {brand.brandName}
                                            </option>
                                        ))}
                                    </select>
                                    {brandFormik.touched.selectedBrand && brandFormik.errors.selectedBrand ? (
                                        <div className="error-message">{brandFormik.errors.selectedBrand}</div>
                                    ) : null}
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    Rabat Brenda (%) :
                                    <input
                                        type="text"
                                        name="brandDiscount"
                                        value={brandFormik.values.brandDiscount}
                                        onChange={brandFormik.handleChange}
                                        onBlur={brandFormik.handleBlur}
                                    />
                                    {brandFormik.touched.brandDiscount && brandFormik.errors.brandDiscount ? (
                                        <div className="error-message">{brandFormik.errors.brandDiscount}</div>
                                    ) : null}
                                </label>
                            </div>
                            <button type="submit">Unesite Rabat</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddClient;   