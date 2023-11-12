import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClientDataService from '../services/CustomerService';
import BrandService from "../services/BrandService";
import '../styles/addClientStyle.css';
import { getAllowedRoles } from './utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    }

    const addBrandDiscount = (brand, discount) => {
        setBrandDiscounts(prevBrandDiscounts => {
            return { ...prevBrandDiscounts, [brand]: discount };
        });
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
            toast.success('Uspešno dodata poslovna jedinica !');
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
            toast.success('Uspešno dodat rabat !');
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
                    toast.success('Uspešno kreiran klijent !');
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
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerCode">
                        Šifra Klijenta
                    </label>
                    <input
                        type="text"
                        name="customerCode"
                        placeholder="Šifra Klijenta"
                        value={formik.values.customerCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameOfTheLegalEntity">
                        Ime Legalnog Entiteta
                    </label>
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
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Uloga
                    </label>
                    <select
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="" disabled hidden>Odaberite ulogu</option>
                        {getAllowedRoles().map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    {formik.touched.role && formik.errors.role ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.role}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                        Grad
                    </label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Grad"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.city && formik.errors.city ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.city}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                        Adresa
                    </label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Adresa"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.address}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pib">
                        PIB
                    </label>
                    <input
                        type="text"
                        name="pib"
                        placeholder="PIB"
                        value={formik.values.pib}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.pib && formik.errors.pib ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.pib}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identificationNumber">
                        Matični Broj
                    </label>
                    <input
                        type="text"
                        name="identificationNumber"
                        placeholder="Matični Broj"
                        value={formik.values.identificationNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.identificationNumber && formik.errors.identificationNumber ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.identificationNumber}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPerson">
                        Kontakt Osoba
                    </label>
                    <input
                        type="text"
                        name="contactPerson"
                        placeholder="Kontakt Osoba"
                        value={formik.values.contactPerson}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.contactPerson && formik.errors.contactPerson ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.contactPerson}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                        Kontakt Broj
                    </label>
                    <input
                        type="text"
                        name="contactNumber"
                        placeholder="Kontakt Broj"
                        value={formik.values.contactNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.contactNumber && formik.errors.contactNumber ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.contactNumber}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentCurrency">
                        Valuta Placanja
                    </label>
                    <input
                        type="text"
                        name="paymentCurrency"
                        placeholder="Valuta Placanja"
                        value={formik.values.paymentCurrency}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.paymentCurrency && formik.errors.paymentCurrency ? (
                        <div className="error-message text-red-500 text-xs italic">{formik.errors.paymentCurrency}</div>
                    ) : null}
                </div>
                <div className="form-group flex gap-4 mt-4">
                    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalFormBrandDiscountVisible(true)}>
                        Dodaj Rabat
                    </button>
                    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalFormDeliveryAddressVisible(true)}>
                        Dodaj Poslovnu Jedinicu
                    </button>
                </div>
                <div className="form-group mt-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Potvrdi Unos Klijenta
                    </button>
                </div>
            </form>


            {modalFormDeliveryAddressVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
                        <span className="close absolute top-4 right-4 text-gray-700 hover:text-gray-900 cursor-pointer" onClick={() => setModalFormDeliveryAddressVisible(false)}>
                            &times;
                        </span>
                        <form onSubmit={deliveryAddressFormik.handleSubmit} className="submit-form">
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Naziv poslovne jedinice:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={deliveryAddressFormik.values.name}
                                    onChange={deliveryAddressFormik.handleChange}
                                    onBlur={deliveryAddressFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {deliveryAddressFormik.touched.name && deliveryAddressFormik.errors.name ? (
                                    <div className="error-message text-red-500 text-xs italic">{deliveryAddressFormik.errors.name}</div>
                                ) : null}
                            </div>
                            {/* Form Group for City */}
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                    Grad:
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={deliveryAddressFormik.values.city}
                                    onChange={deliveryAddressFormik.handleChange}
                                    onBlur={deliveryAddressFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {deliveryAddressFormik.touched.city && deliveryAddressFormik.errors.city ? (
                                    <div className="error-message text-red-500 text-xs italic">{deliveryAddressFormik.errors.city}</div>
                                ) : null}
                            </div>
                            {/* Form Group for Address */}
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                    Adresa:
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={deliveryAddressFormik.values.address}
                                    onChange={deliveryAddressFormik.handleChange}
                                    onBlur={deliveryAddressFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {deliveryAddressFormik.touched.address && deliveryAddressFormik.errors.address ? (
                                    <div className="error-message text-red-500 text-xs italic">{deliveryAddressFormik.errors.address}</div>
                                ) : null}
                            </div>
                            {/* Form Group for Contact Person */}
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPerson">
                                    Kontakt Osoba:
                                </label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    id="contactPerson"
                                    value={deliveryAddressFormik.values.contactPerson}
                                    onChange={deliveryAddressFormik.handleChange}
                                    onBlur={deliveryAddressFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {deliveryAddressFormik.touched.contactPerson && deliveryAddressFormik.errors.contactPerson ? (
                                    <div className="error-message text-red-500 text-xs italic">{deliveryAddressFormik.errors.contactPerson}</div>
                                ) : null}
                            </div>
                            {/* Form Group for Contact Number */}
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                                    Kontakt Broj:
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    id="contactNumber"
                                    value={deliveryAddressFormik.values.contactNumber}
                                    onChange={deliveryAddressFormik.handleChange}
                                    onBlur={deliveryAddressFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {deliveryAddressFormik.touched.contactNumber && deliveryAddressFormik.errors.contactNumber ? (
                                    <div className="error-message text-red-500 text-xs italic">{deliveryAddressFormik.errors.contactNumber}</div>
                                ) : null}
                            </div>
                            {/* Form Group for Email */}
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email:
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={deliveryAddressFormik.values.email}
                                    onChange={deliveryAddressFormik.handleChange}
                                    onBlur={deliveryAddressFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {deliveryAddressFormik.touched.email && deliveryAddressFormik.errors.email ? (
                                    <div className="error-message text-red-500 text-xs italic">{deliveryAddressFormik.errors.email}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Unesite Poslovnu Jedinicu
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {modalFormBrandDiscountVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
                        <span className="close absolute top-4 right-4 text-gray-700 hover:text-gray-900 cursor-pointer" onClick={() => setModalFormBrandDiscountVisible(false)}>
                            &times;
                        </span>
                        <form onSubmit={brandFormik.handleSubmit} className="submit-form">
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectedBrand">
                                    Izaberite Brend:
                                </label>
                                <select
                                    name="selectedBrand"
                                    id="selectedBrand"
                                    value={brandFormik.values.selectedBrand}
                                    onChange={brandFormik.handleChange}
                                    onBlur={brandFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                    <div className="error-message text-red-500 text-xs italic">{brandFormik.errors.selectedBrand}</div>
                                ) : null}
                            </div>
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brandDiscount">
                                    Rabat Brenda (%):
                                </label>
                                <input
                                    type="text"
                                    name="brandDiscount"
                                    id="brandDiscount"
                                    value={brandFormik.values.brandDiscount}
                                    onChange={brandFormik.handleChange}
                                    onBlur={brandFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {brandFormik.touched.brandDiscount && brandFormik.errors.brandDiscount ? (
                                    <div className="error-message text-red-500 text-xs italic">{brandFormik.errors.brandDiscount}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Unesite Rabat
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddClient;   