import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DeliveryAddressService from "../services/DeliveryAddressService";
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditDeliveryAddress = () => {
  const location = useLocation();
  const { deliveryAddressID, clientID } = location.state || {};
  const [address, setAddress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the address data when the component mounts
    console.log("PROVIDED ADDRES ID " + deliveryAddressID);
    DeliveryAddressService.get(deliveryAddressID)
      .then(response => {
        console.log("odgovovor: " + JSON.stringify(response.data));
        setAddress(response.data)
        console.log("Adresas : " + JSON.stringify(address));
      })
      .catch(e => console.log(e));
  }, []);

  const formik = useFormik({
    enableReinitialize: true, // Add this line
    initialValues: {
      name: address.name || "",
      city: address.city || "",
      address: address.address || "",
      contactPerson: address.contactPerson || "",
      contactNumber: address.contactNumber || "",
      email: address.email || "",
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
      console.log("id " + deliveryAddressID);
      console.log("values " + JSON.stringify(values));
      DeliveryAddressService.update(deliveryAddressID, values)
        .then(response => {
          console.log(response.data);
          toast.success('Update successful!'); // Display success notification
          navigate(`/addressesOfClient`, { state: { clientID } });
        })
        .catch(e => {
          console.log(e);
          toast.error('Update failed!'); // Display failure notification
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="submit-form">
      <ToastContainer />
      <div className="form-group">
        <label>
          Name :
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error-message">{formik.errors.name}</div>
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
      </div>
      <button type="submit">Azuriraj Poslovnu Jedinicu</button>
    </form>
  );
};

export default EditDeliveryAddress;
