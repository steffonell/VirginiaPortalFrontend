import React, { useState, useEffect } from "react";
import BrandDataService from "../services/BrandService";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const Brand = props => {
  const initialBrandState = {
    id: null,
    brandName: "",
    discount: ""
  };
  const [currentBrand, setCurrentBrand] = useState(initialBrandState);
  const [message, setMessage] = useState("");

  const getBrand = id => {
    BrandDataService.get(id)
      .then(response => {
        setCurrentBrand(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getBrand(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentBrand({ ...currentBrand, [name]: value });
  };

  const updatePublished = status => {
    var data = {
      id: currentBrand.id,
      brandName: currentBrand.brandName,
      discount: currentBrand.discount,
    };

    BrandDataService.update(currentBrand.id, data)
      .then(response => {
        setCurrentBrand({ ...currentBrand});
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateBrand = () => {
    BrandDataService.update(currentBrand.id, currentBrand)
      .then(response => {
        console.log(response.data);
        setMessage("The brand was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteBrand = () => {
    BrandDataService.remove(currentBrand.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/brands");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
        <h1>BrandCOMPONENT</h1>
    </div>
   /*  <div>
      {currentBrand ? (
        <div className="edit-form">
          <h4>Brand</h4>
          <form>
            <div className="form-group">
              <label htmlFor="brandName">Name</label>
              <input
                type="text"
                className="form-control"
                id="brandName"
                name="brandName"
                value={currentBrand.brandName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount">Description</label>
              <input
                type="text"
                className="form-control"
                id="discount"
                name="discount"
                value={currentBrand.discount}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteBrand}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateBrand}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Brand...</p>
        </div>
      )}
    </div> */
  );
};

export default Brand;