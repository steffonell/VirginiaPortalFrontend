
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DeliveryAddressService from "../services/DeliveryAddressService";
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddClientDeliveryAddress = () => {
  const location = useLocation();
  const { clientID } = location.state || {};
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      city: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Polje "Naziv Poslovne Jedinice" je obavezno.'),
      city: Yup.string().required('Polje "Grad" je obavezno.'),
      address: Yup.string().required('Polje "Adresa" je obavezno.'),
      contactPerson: Yup.string(),
      contactNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Polje "Rabat Brenda" mora sadržati samo brojeve.'),
      email: Yup.string().email('Nevažeća email adresa.'),
    }),
    onSubmit: values => {
      DeliveryAddressService.addDeliveryAddressForClient(values, clientID)
        .then(response => {
          console.log(clientID);
          console.log(response.data);
          toast.success('Update successful!'); // Display success notification
          navigate(`/addressesOfClient`, { state: { clientID } });
        })
        .catch(e => {
          console.log(e);
          toast.error('Adding failed!');
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="submit-form bg-gray-100 p-6 rounded-md shadow-md">
      <ToastContainer />
      <div className="form-group space-y-4">

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Name :</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-2 border rounded-md"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500">{formik.errors.name}</div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Grad :</label>
          <input
            type="text"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-2 border rounded-md"
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="text-red-500">{formik.errors.city}</div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Adresa :</label>
          <input
            type="text"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-2 border rounded-md"
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500">{formik.errors.address}</div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Kontakt Osoba :</label>
          <input
            type="text"
            name="contactPerson"
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-2 border rounded-md"
          />
          {formik.touched.contactPerson && formik.errors.contactPerson ? (
            <div className="text-red-500">{formik.errors.contactPerson}</div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Kontakt Broj :</label>
          <input
            type="text"
            name="contactNumber"
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-2 border rounded-md"
          />
          {formik.touched.contactNumber && formik.errors.contactNumber ? (
            <div className="text-red-500">{formik.errors.contactNumber}</div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Email :</label>
          <input
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-2 border rounded-md"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}
        </div>
      </div>

      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Dodaj Poslovnu Jedinicu</button>
    </form>
  );
};

export default AddClientDeliveryAddress;
