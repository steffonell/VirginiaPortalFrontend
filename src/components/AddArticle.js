import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axiosInstance from './apiService';
import * as Yup from 'yup';
import '../styles/addArticleStyle.css';
import BrandService from "../services/BrandService";

const AddArticle = () => {

    // Add state for brands
    const [brands, setBrands] = useState([]);

    // Fetch brands using BrandService
    useEffect(() => {
        retrieveBrands();
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

    const validationSchema = Yup.object().shape({
        code: Yup.string().required('Code is required'),
        name: Yup.string().required('Name is required'),
        unitOfMeasurement: Yup.string(),
        quantityPerTransportPackage: Yup.number().integer(),
        minimumQuantityDemand: Yup.number().integer(),
        brutoMass: Yup.number(),
        wholesalePrice: Yup.number().required('Wholesale Price is required'),
        imageSource: Yup.string(),
        pdv: Yup.number().required('PDV is required'),
        brandName: Yup.string().required('Brand Name is required'),
    });

    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            unitOfMeasurement: '',
            quantityPerTransportPackage: '',
            minimumQuantityDemand: '',
            brutoMass: '',
            wholesalePrice: '',
            imageSource: '',
            pdv: '',
            brandName: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosInstance.post('articles', values);
                console.log('Article created', response.data);
            } catch (error) {
                console.error('Error creating article', error);
            }
        },
    });

    // Add a handler for the brand change
    const handleBrandChange = (event) => {
        formik.setFieldValue('brandName', event.target.value);
    };

    return (
        <div className="submit-form">
            <form onSubmit={formik.handleSubmit}>
                {/* Code */}
                <input
                    name="code"
                    placeholder="Code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.code && formik.errors.code ? (
                    <div className="error-message">{formik.errors.code}</div>
                ) : null}

                {/* Name */}
                <input
                    name="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className="error-message">{formik.errors.name}</div>
                ) : null}

                {/* Unit of Measurement */}
                <input
                    name="unitOfMeasurement"
                    placeholder="Unit of Measurement"
                    value={formik.values.unitOfMeasurement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.unitOfMeasurement && formik.errors.unitOfMeasurement ? (
                    <div className="error-message">{formik.errors.unitOfMeasurement}</div>
                ) : null}

                {/* Quantity Per Transport Package */}
                <input
                    name="quantityPerTransportPackage"
                    placeholder="Quantity Per Transport Package"
                    value={formik.values.quantityPerTransportPackage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.quantityPerTransportPackage && formik.errors.quantityPerTransportPackage ? (
                    <div className="error-message">{formik.errors.quantityPerTransportPackage}</div>
                ) : null}

                {/* Minimum Quantity Demand */}
                <input
                    name="minimumQuantityDemand"
                    placeholder="Minimum Quantity Demand"
                    value={formik.values.minimumQuantityDemand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.minimumQuantityDemand && formik.errors.minimumQuantityDemand ? (
                    <div className="error-message">{formik.errors.minimumQuantityDemand}</div>
                ) : null}

                {/* Bruto Mass */}
                <input
                    name="brutoMass"
                    placeholder="Bruto Mass"
                    value={formik.values.brutoMass}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.brutoMass && formik.errors.brutoMass ? (
                    <div className="error-message">{formik.errors.brutoMass}</div>
                ) : null}

                {/* Wholesale Price */}
                <input
                    name="wholesalePrice"
                    placeholder="Wholesale Price"
                    value={formik.values.wholesalePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.wholesalePrice && formik.errors.wholesalePrice ? (
                    <div className="error-message">{formik.errors.wholesalePrice}</div>
                ) : null}

                {/* Image Source */}
                <input
                    name="imageSource"
                    placeholder="Image Source"
                    value={formik.values.imageSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.imageSource && formik.errors.imageSource ? (
                    <div className="error-message">{formik.errors.imageSource}</div>
                ) : null}

                {/* PDV */}
                <input
                    name="pdv"
                    placeholder="PDV"
                    value={formik.values.pdv}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.pdv && formik.errors.pdv ? (
                    <div className="error-message">{formik.errors.pdv}</div>
                ) : null}

                {/* Brand Name */}
                <div className="form-group">
                    <label htmlFor="brandName">Brand</label>
                    <select className="form-control" onChange={handleBrandChange}>
                        <option key="0" value="">
                            Izaberite Brend
                        </option>
                        {brands.map((brand, index) => {
                            return (
                                <option key={index + 1} value={brand.brandName}>
                                    {brand.brandName}
                                </option>
                            );
                        })}
                    </select>
                </div>
                {formik.touched.brandName && formik.errors.brandName ? (
                    <div className="error-message">{formik.errors.brandName}</div>
                ) : null}

                {/* Submit Button */}
                <button type="submit">Add Article</button>
            </form>
        </div>
    );
};

export default AddArticle;
