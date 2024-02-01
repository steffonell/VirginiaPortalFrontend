import React, { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClientDataService from '../services/CustomerService';
import '../styles/addClientStyle.css';
import { getAllowedRoles } from './utils';
import { ToastContainer, toast } from 'react-toastify';
import { setAuthToken } from "./apiService";
import 'react-toastify/dist/ReactToastify.css';
import { ApplicationContext } from './ApplicationContext';
import { phoneNumberRegEx } from './utils';
import { useLogout } from "./useLogout";

const UserManualRegistration = () => {

    const [modalFormDeliveryAddressVisible, setModalFormDeliveryAddressVisible] = useState(false);
    const [customerDeliveryAddresses, setCustomerDeliveryAddresses] = useState([]);
    const { userName, email } = useContext(ApplicationContext);
    const logoutFunction = useLogout();

    const addDeliveryAddress = (deliveryAddress) => {
        setCustomerDeliveryAddresses(prevCustomerDeliveryAddresses => [...prevCustomerDeliveryAddresses, deliveryAddress]);
    }

    useEffect(() => {
       console.log(userName);
    }, []);

    const validationSchema = Yup.object().shape({
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
        contactNumber: Yup.string().matches(phoneNumberRegEx, 'Polje "Kontakt broj" mora biti u formatu +381XXXXXXXXX.')
            .required('Polje "Kontakt broj" je obavezno.'),
        role: Yup.string().required('Izaberite privilegije novog klijenta.'),
    });

    const deliveryAddressValidationSchema = Yup.object().shape({
        name: Yup.string().required('Polje "Naziv Poslovne Jedinice" je obavezno.'),
        city: Yup.string().required('Polje "Grad" je obavezno.'),
        address: Yup.string().required('Polje "Adresa" je obavezno.'),
        contactPerson: Yup.string(),
        contactNumber: Yup.string().matches(phoneNumberRegEx, 'Polje "Kontakt broj" mora biti u formatu +381XXXXXXXXX.')
            .required('Polje "Kontakt broj" je obavezno.'),
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

    const formik = useFormik({
        initialValues: {
            customerCode: '',
            nameOfTheLegalEntity: userName,
            city: '',
            address: '',
            pib: '',
            identificationNumber: '',
            contactPerson: '',
            contactNumber: '',
            email: email,
            paymentCurrency: '0',
            role: 'ROLE_USER',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            if (!formik.isValid) {
                setSubmitting(false);
                return;
            }
            // separate the clientData and role from the form values
            const { role, ...clientData } = values;
            console.log("Role : "+role);
            console.log("clientData : "+clientData);
            // You can use role and clientData separately in your request
            ClientDataService.createCustomerWithAddressesViaRegistrationPrompt(clientData, role, customerDeliveryAddresses)
                .then((response) => {
                    console.log(response.data);
                    resetForm();
                    toast.success('Uspešno uneti podaci za registraciju !');
                    logoutFunction();
                })
                .catch((e) => {
                    console.log(e);
                });
        },
    });

    return (
        <div className="submit-form">
            <h2>Forma Za Registraciju Na Portal</h2>
            <form onSubmit={formik.handleSubmit}>
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
                <div className="form-group flex gap-4 mt-4">
                    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalFormDeliveryAddressVisible(true)}>
                        Dodaj Poslovnu Jedinicu
                    </button>
                </div>
                <div className="form-group mt-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Potvrdi Unos
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
        </div>
    );
};

export default UserManualRegistration;   