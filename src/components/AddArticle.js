import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axiosInstance from './apiService';
import * as Yup from 'yup';
import '../styles/addArticleStyle.css';
import BrandService from "../services/BrandService";

const AddArticle = () => {

    // Dodaj stanje za brendove
    const [brands, setBrands] = useState([]);

    // Dobavi brendove koristeći BrandService
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
        code: Yup.string().required('Kod je obavezan'),
        name: Yup.string().required('Ime je obavezno'),
        unitOfMeasurement: Yup.string(),
        quantityPerTransportPackage: Yup.number().integer(),
        minimumQuantityDemand: Yup.number().integer(),
        brutoMass: Yup.number(),
        wholesalePrice: Yup.number().required('Veleprodajna cena je obavezna'),
        imageSource: Yup.string(),
        pdv: Yup.number().required('PDV je obavezan'),
        brandName: Yup.string().required('Naziv brenda je obavezan'),
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
                console.log('Artikal kreiran', response.data);
            } catch (error) {
                console.error('Greška prilikom kreiranja artikla', error);
            }
        },
    });

    // Dodaj hendler za promenu brenda
    const handleBrandChange = (event) => {
        formik.setFieldValue('brandName', event.target.value);
    };

    return (
        <div className="submit-form">
            <h2>Dodaj Artikal</h2>
            <form onSubmit={formik.handleSubmit}>
                {/* Kod */}
                <input
                    name="code"
                    placeholder="Kod"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.code && formik.errors.code ? (
                    <div className="error-message">{formik.errors.code}</div>
                ) : null}

                {/* Ime */}
                <input
                    name="name"
                    placeholder="Ime"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className="error-message">{formik.errors.name}</div>
                ) : null}

                {/* Jedinica mere */}
                <input
                    name="unitOfMeasurement"
                    placeholder="Jedinica mere"
                    value={formik.values.unitOfMeasurement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.unitOfMeasurement && formik.errors.unitOfMeasurement ? (
                    <div className="error-message">{formik.errors.unitOfMeasurement}</div>
                ) : null}

                {/* Količina po transportnom paketu */}
                <input
                    name="quantityPerTransportPackage"
                    placeholder="Količina po transportnom paketu"
                    value={formik.values.quantityPerTransportPackage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.quantityPerTransportPackage && formik.errors.quantityPerTransportPackage ? (
                    <div className="error-message">{formik.errors.quantityPerTransportPackage}</div>
                ) : null}

                {/* Minimalna tražena količina */}
                <input
                    name="minimumQuantityDemand"
                    placeholder="Minimalna tražena količina"
                    value={formik.values.minimumQuantityDemand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.minimumQuantityDemand && formik.errors.minimumQuantityDemand ? (
                    <div className="error-message">{formik.errors.minimumQuantityDemand}</div>
                ) : null}

                {/* Bruto masa */}
                <input
                    name="brutoMass"
                    placeholder="Bruto masa"
                    value={formik.values.brutoMass}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.brutoMass && formik.errors.brutoMass ? (
                    <div className="error-message">{formik.errors.brutoMass}</div>
                ) : null}

                {/* Veleprodajna cena */}
                <input
                    name="wholesalePrice"
                    placeholder="Veleprodajna cena"
                    value={formik.values.wholesalePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.wholesalePrice && formik.errors.wholesalePrice ? (
                    <div className="error-message">{formik.errors.wholesalePrice}</div>
                ) : null}

                {/* Izvor slike */}
                <input
                    name="imageSource"
                    placeholder="Izvor slike"
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

                {/* Naziv brenda */}
                <div className="form-group">
                    <label htmlFor="brandName">Brend</label>
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

                {/* Dugme za dodavanje */}
                <button type="submit">Dodaj artikal</button>
            </form>
        </div>
    );
};

export default AddArticle;
