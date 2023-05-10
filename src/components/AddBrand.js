import React, { useState } from "react";
import BrandDataService from "../services/BrandService";
import { useFormik } from 'formik';
import * as Yup from 'yup';



const AddBrand = () => {
  const initialBrandState = {
    brand_id: null,
    brandName: ""
  };
  const [brand, setBrand] = useState(initialBrandState);
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object().shape({
    brandName: Yup.string().required('Brand Name is required'),
  });

  const formik = useFormik({
    initialValues: {
      brandName: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form data', values);
    },
  });


  const handleInputChange = event => {
    const { name, value } = event.target;
    setBrand({ ...brand, [name]: value });
  };

  const saveBrand = () => {
    var data = {
      brandName: brand.brandName
    };

    BrandDataService.create(data)
      .then(response => {
        setBrand({
          brand_id: response.data.brand_id,
          brandName: response.data.brandName
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newBrand = () => {
    setBrand(initialBrandState);
    setSubmitted(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="firstName"
        value={formik.values.brandName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.brandName && formik.errors.firsbrandNametName ? (
        <div>{formik.errors.brandName}</div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
};

/*   return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newBrand}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="brandName">Brand Name</label>
            <input
              type="text"
              className="form-control"
              brand_id="brandName"
              required
              value={brand.brandName}
              onChange={handleInputChange}
              name="brandName"
            />
          </div>

          <button onClick={saveBrand} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}; */

export default AddBrand;