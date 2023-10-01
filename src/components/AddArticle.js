import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/addArticleStyle.css';
import BrandService from "../services/BrandService";
import ArticleService from '../services/ArticleService';
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for react-toastify

const AddArticle = () => {

    // Dodaj stanje za brendove
    const [brands, setBrands] = useState([]);
    const [message, setMessage] = useState('');
    const [isResetForm, setIsResetForm] = useState(false);

    let formik;

    // Dobavi brendove koristeći BrandService
    useEffect(() => {
        retrieveBrands();
        if (formik && isResetForm) {
            formik.resetForm();
            setIsResetForm(false);
        }
    }, [isResetForm, formik]);

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
        code: Yup.string().required('Šifra Artikla je obavezna.'),
        barcode: Yup.string().required('Barkod Artikla je obavezan.'),
        name: Yup.string().required('Naziv Artikla je obavezno.'),
        unitOfMeasurement: Yup.string(),
        quantityPerTransportPackage: Yup.number().integer(),
        minimumQuantityDemand: Yup.number().integer(),
        brutoMass: Yup.number(),
        wholesalePrice: Yup.number().required('Veleprodajna cena je obavezna.'),
        imageSource: Yup.string(),
        pdv: Yup.number().required('PDV je obavezan.'),
        isActive: Yup.string().required('Obavezno biranje statusa artikla.'),
        brandName: Yup.string().required('Naziv brenda je obavezan.'),
    });

    formik = useFormik({
        initialValues: {
            code: '',
            barcode: '',
            name: '',
            unitOfMeasurement: '',
            quantityPerTransportPackage: '',
            minimumQuantityDemand: '',
            brutoMass: '',
            wholesalePrice: '',
            imageSource: '',
            pdv: '20',
            isActive: 'true',
            brandName: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await ArticleService.create(values, formik.values.brandName);
                setMessage('Artikal uspešno kreiran');
                setIsResetForm(true);
                // Notify success
                toast.success('Artikal uspešno kreiran!');
            } catch (error) {
                console.error('Greška prilikom kreiranja artikla', error);
                // Notify error
                toast.error('Greška prilikom kreiranja artikla!');
            }
        },
    });
    // Dodaj hendler za promenu brenda
    // Replace your handleBrandChange function with this:
    const handleBrandChange = (event) => {
        formik.handleChange(event);
    };


    return (
        <div className="submit-form">
            <h2>Dodaj Artikal</h2>
            <ToastContainer />
            <form onSubmit={formik.handleSubmit}>
                {/* Šifra Artikla */}
                <label htmlFor="code">Šifra Artikla</label>
                <input
                    name="code"
                    className='add-article-field'
                    placeholder="Šifra Artikla"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.code && formik.errors.code ? (
                    <div className="error-message">{formik.errors.code}</div>
                ) : null}
                <br></br>
                {/* Barkod Artikla */}
                <label htmlFor="barcode">Barkod Artikla</label>
                <input
                    name="barcode"
                    className='add-article-field'
                    placeholder="Barkod Artikla"
                    value={formik.values.barcode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.barcode && formik.errors.barcode ? (
                    <div className="error-message">{formik.errors.barcode}</div>
                ) : null}
                <br></br>
                {/* Naziv Artikla */}
                <label htmlFor="name">Naziv Artikla</label>
                <input
                    name="name"
                    className='add-article-field'
                    placeholder="Naziv Artikla"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className="error-message">{formik.errors.name}</div>
                ) : null}
                <br></br>
                {/* Jedinica mere */}
                <label htmlFor="unitOfMeasurement">Jedinica mere</label>
                <input
                    name="unitOfMeasurement"
                    className='add-article-field'
                    placeholder="Jedinica mere"
                    value={formik.values.unitOfMeasurement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.unitOfMeasurement && formik.errors.unitOfMeasurement ? (
                    <div className="error-message">{formik.errors.unitOfMeasurement}</div>
                ) : null}
                <br></br>
                {/* Količina po transportnom paketu */}
                <label htmlFor="quantityPerTransportPackage">Količina po transportnom paketu</label>
                <input
                    name="quantityPerTransportPackage"
                    className='add-article-field'
                    placeholder="Količina po transportnom paketu"
                    value={formik.values.quantityPerTransportPackage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.quantityPerTransportPackage && formik.errors.quantityPerTransportPackage ? (
                    <div className="error-message">{formik.errors.quantityPerTransportPackage}</div>
                ) : null}
                <br></br>
                {/* Minimalna tražena količina */}
                <label htmlFor="minimumQuantityDemand">Minimalna tražena količina</label>
                <input
                    name="minimumQuantityDemand"
                    className='add-article-field'
                    placeholder="Minimalna tražena količina"
                    value={formik.values.minimumQuantityDemand}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.minimumQuantityDemand && formik.errors.minimumQuantityDemand ? (
                    <div className="error-message">{formik.errors.minimumQuantityDemand}</div>
                ) : null}
                <br></br>

                {/* Bruto masa */}
                <label htmlFor="minimumQuantityDemand">Bruto masa</label>
                <input
                    name="brutoMass"
                    className='add-article-field'
                    placeholder="Bruto masa (Mg)"
                    value={formik.values.brutoMass}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.brutoMass && formik.errors.brutoMass ? (
                    <div className="error-message">{formik.errors.brutoMass}</div>
                ) : null}
                <br></br>

                {/* Veleprodajna cena */}
                <label htmlFor="wholesalePrice">Veleprodajna cena</label>
                <input
                    name="wholesalePrice"
                    className='add-article-field'
                    placeholder="Veleprodajna cena"
                    value={formik.values.wholesalePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.wholesalePrice && formik.errors.wholesalePrice ? (
                    <div className="error-message">{formik.errors.wholesalePrice}</div>
                ) : null}
                <br></br>

                {/* Izvor slike */}
                <label htmlFor="imageSource">Izvor slike</label>
                <input
                    name="imageSource"
                    className='add-article-field'
                    placeholder="Izvor slike"
                    value={formik.values.imageSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.imageSource && formik.errors.imageSource ? (
                    <div className="error-message">{formik.errors.imageSource}</div>
                ) : null}
                <br></br>

                {/* PDV */}
                <label htmlFor="pdv">PDV</label>
                <input
                    name="pdv"
                    placeholder="PDV (%)"
                    className='add-article-field'
                    value={formik.values.pdv}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.pdv && formik.errors.pdv ? (
                    <div className="error-message">{formik.errors.pdv}</div>
                ) : null}
                <br></br>
                <label>
                    Aktivan Artikal:
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="isActive"
                                value="true"
                                checked={formik.values.isActive === 'true'}
                                onChange={formik.handleChange}
                            />
                            Aktivan
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="isActive"
                                value="false"
                                checked={formik.values.isActive === 'false'}
                                onChange={formik.handleChange}
                            />
                            Neaktivan
                        </label>
                    </div>
                    {formik.touched.isActive && formik.errors.isActive ? (
                        <div className="error-message">{formik.errors.isActive}</div>
                    ) : null}
                </label>
                <br></br>
                {/* Naziv brenda */}
                <div className="form-group">
                    <label htmlFor="brandName">Brend</label>
                    <select
                        name="brandName"
                        className='add-article-field'
                        value={formik.values.brandName}
                        onChange={handleBrandChange}
                        onBlur={formik.handleBlur}
                    >
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
                <br></br>

                {/* Dugme za dodavanje */}
                <button type="submit">Dodaj artikal</button>
            </form>
        </div>
    );
};

export default AddArticle;
