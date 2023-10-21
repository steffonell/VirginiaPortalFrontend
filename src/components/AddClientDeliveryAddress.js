
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
        {['name', 'city', 'address', 'contactPerson', 'contactNumber', 'email'].map((field, index) => (
          <div className="flex flex-col" key={index}>
            <label className="font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)} :
            </label>
            <input
              type="text"
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded-md transition duration-300 ease-in-out focus:border-blue-500"
            />
            {formik.touched[field] && formik.errors[field] ? (
              <div className="text-red-500">{formik.errors[field]}</div>
            ) : null}
          </div>
        ))}
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Dodaj Poslovnu Jedinicu
      </button>
    </form>

  );
};

export default AddClientDeliveryAddress;
