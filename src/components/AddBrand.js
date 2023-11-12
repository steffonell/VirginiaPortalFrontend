import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BrandService from '../services/BrandService';
import { toast } from 'react-toastify';  // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for react-toastify

const AddBrand = () => {
  const validationSchema = Yup.object().shape({
    brandName: Yup.string().required('Naziv brenda je obavezan.'),
  });

  const formik = useFormik({
    initialValues: {
      brandName: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      BrandService.create(values)
        .then(() => {
          // Notify success
          toast.success('Brend uspešno kreiran!');
          // Reset the form
          resetForm();
        })
        .catch((error) => {
          // Handle any errors here
          toast.error('Došlo je do greške pri kreiranju brenda.');
        });
    },
  });

  return (
    <div className="submit-form">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            name="brandName"
            placeholder="Naziv brenda"
            value={formik.values.brandName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${formik.touched.brandName && formik.errors.brandName ? 'border-red-500' : 'border-gray-300'} lg:max-w-[200px]`}
          />
          {formik.touched.brandName && formik.errors.brandName ? (
            <div className="text-red-500 mt-1">{formik.errors.brandName}</div>
          ) : null}
        </div>
        <div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;
