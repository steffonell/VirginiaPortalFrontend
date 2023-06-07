import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClientService from "../services/ClientService";
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditClient = () => {
  const [client, setClient] = useState({});
  const { id: clientID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    ClientService.get(clientID)
      .then(response => {
        console.log("Response: "+JSON.stringify(response.data));
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
    validationSchema: Yup.object({
      // Add your validation here. This is just a sample and may not be exactly what you need.
      nameOfTheLegalEntity: Yup.string().required('Required field.'),
      address: Yup.string().required('Required field.'),
      pib: Yup.string().required('Required field.'),
      identificationNumber: Yup.string().required('Required field.'),
      contactPerson: Yup.string().required('Required field.'),
      contactNumber: Yup.string()
          .matches(/^[0-9]+$/, 'Must contain only numbers.'),
      email: Yup.string().email('Invalid email address.'),
      paymentCurrency: Yup.string().required('Required field.'),
    }),
    onSubmit: values => {
      ClientService.update(clientID, values)
        .then(response => {
          console.log(response.data);
          toast.success('Update successful!');
          navigate(`/client`);
        })
        .catch(e => {
          console.log(e);
          toast.error('Update failed!');
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="submit-form">
      <ToastContainer />
      <div className="form-group">
        {/* Add your input fields here. This is just a sample and may not be exactly what you need. */}
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
        {/* Add more input fields here */}
      </div>
      <button type="submit">Update Client</button>
    </form>
  );  
};

export default EditClient;
