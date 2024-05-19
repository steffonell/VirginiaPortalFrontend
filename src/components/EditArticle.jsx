import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArticleService from "../services/ArticleService";
import BrandService from "../services/BrandService";
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EditArticle = () => {
    const [article, setArticle] = useState(null);
    const [brands, setBrands] = useState([]);
    const [existingImage, setExistingImage] = useState(null);
    const { id: articleID } = useParams();
    const navigate = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            code: "",
            barcode: "",
            name: "",
            unitOfMeasurement: "",
            quantityPerTransportPackage: "",
            minimumQuantityDemand: "",
            brutoMass: "",
            wholesalePrice: "",
            imageSource: "",
            pdv: "20",
            isActive: 'true',
            isVisible: 'true',
            brandName: "",
            imageFile: null,
        },
        validationSchema: Yup.object().shape({
            code: Yup.string().required('Šifra Artikla je obavezna.'),
            barcode: Yup.string().required('Barkod Artikla je obavezan.'),
            name: Yup.string().required('Naziv Artikla je obavezno.'),
            unitOfMeasurement: Yup.string(),
            quantityPerTransportPackage: Yup.number().integer(),
            minimumQuantityDemand: Yup.number().integer(),
            brutoMass: Yup.number(),
            wholesalePrice: Yup.number().required('Veleprodajna cena je obavezna.'),
            imageSource: Yup.string(),
            pdv: Yup.number().required('PDV je obavezan'),
            isActive: Yup.string().required('Obavezno biranje statusa artikla.'),
            isVisible: Yup.string().required('Obavezno biranje vidljivosti artikla.'),
            brandName: Yup.string().required('Naziv brenda je obavezan.'),
        }),
        onSubmit: async values => {
            try {
                if (values.imageFile) {
                    const formData = new FormData();
                    formData.append('code', values.code);
                    formData.append('articleImage', values.imageFile);

                    await axios.post('/azurirajSliku', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    const imageName = `${values.code}.png`;
                    const fileReader = new FileReader();
                    fileReader.onload = (event) => {
                        const imageData = event.target.result;
                        localStorage.setItem(imageName, imageData);
                        setExistingImage(imageData);  // Update existing image state
                    };
                    fileReader.readAsDataURL(values.imageFile);
                }

                await ArticleService.update(articleID, values);
                navigate(`/articles`);
                toast.success('Uspešno ažuriran artikal!');
            } catch (error) {
                console.log(error);
                toast.error('Neuspešno ažuriranje!');
            }
        onSubmit: values => {
            ArticleService.update(articleID, values)
                .then(() => {
                    navigate(`/articles`);
                    toast.success('Uspešno ažuriran artikal!');
                })
                .catch(e => {
                    toast.error('Neuspešno ažuriranje!', e);
                });
        },
    });

    useEffect(() => {
        retrieveBrands();
        ArticleService.get(articleID)
            .then(response => {
                setArticle(response.data);
                const imageName = `${response.data.code}.png`;
                const existingImageData = localStorage.getItem(imageName);
                setExistingImage(existingImageData);  // Load existing image from localStorage
                formik.setValues({
                    code: response.data.code || "",
                    barcode: response.data.barcode || "",
                    name: response.data.name || "",
                    unitOfMeasurement: response.data.unitOfMeasurement || "",
                    quantityPerTransportPackage: response.data.quantityPerTransportPackage || "",
                    minimumQuantityDemand: response.data.minimumQuantityDemand || "",
                    brutoMass: response.data.brutoMass || "",
                    wholesalePrice: response.data.wholesalePrice || "",
                    imageSource: response.data.imageSource || "",
                    pdv: response.data.pdv || "20",
                    isActive: response.data.isActive ? 'true' : 'false',
                    isVisible: response.data.isVisible ? 'true' : 'false',
                    brandName: response.data.brand ? response.data.brand.brandName : "",
                    imageFile: null,
                });
            }).catch(e => {
                toast.error('Neuspešno preuzimanje artikala!', e);
            });
    }, []);

    const retrieveBrands = () => {
        BrandService.getAll()
            .then(response => {
                setBrands(response.data);
            })
            .catch(e => {
                toast.error('Neuspešno preuzimanje brendova!', e);
            });
    };

    const handleBrandChange = (event) => {
        formik.setFieldValue('brandName', event.target.value);
    };

    const handleImageChange = (event) => {
        formik.setFieldValue('imageFile', event.currentTarget.files[0]);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="submit-form">
            <ToastContainer />
            <div className="form-group">
                <label>
                    Šifra Artikla:
                    <input
                        type="text"
                        name="code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.code && formik.errors.code ? (
                        <div className="error-message">{formik.errors.code}</div>
                    ) : null}
                </label>
                <label>
                    Barkod Artikla:
                    <input
                        type="text"
                        name="barcode"
                        value={formik.values.barcode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.barcode && formik.errors.barcode ? (
                        <div className="error-message">{formik.errors.barcode}</div>
                    ) : null}
                </label>
                <label>
                    Naziv Artikla:
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
                    Jedinica mere:
                    <input
                        type="text"
                        name="unitOfMeasurement"
                        value={formik.values.unitOfMeasurement}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.unitOfMeasurement && formik.errors.unitOfMeasurement ? (
                        <div class="error-message">{formik.errors.unitOfMeasurement}</div>
                    ) : null}
                </label>
                <label>
                    Količina po transportnom paketu:
                    <input
                        type="number"
                        name="quantityPerTransportPackage"
                        value={formik.values.quantityPerTransportPackage}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.quantityPerTransportPackage && formik.errors.quantityPerTransportPackage ? (
                        <div class="error-message">{formik.errors.quantityPerTransportPackage}</div>
                    ) : null}
                </label>
                <label>
                    Minimalna tražena količina:
                    <input
                        type="number"
                        name="minimumQuantityDemand"
                        value={formik.values.minimumQuantityDemand}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.minimumQuantityDemand && formik.errors.minimumQuantityDemand ? (
                        <div class="error-message">{formik.errors.minimumQuantityDemand}</div>
                    ) : null}
                </label>
                <label>
                    Bruto masa:
                    <input
                        type="number"
                        name="brutoMass"
                        value={formik.values.brutoMass}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.brutoMass && formik.errors.brutoMass ? (
                        <div class="error-message">{formik.errors.brutoMass}</div>
                    ) : null}
                </label>
                <label>
                    Veleprodajna cena:
                    <input
                        type="number"
                        name="wholesalePrice"
                        value={formik.values.wholesalePrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.wholesalePrice && formik.errors.wholesalePrice ? (
                        <div class="error-message">{formik.errors.wholesalePrice}</div>
                    ) : null}
                </label>
                <label>
                    Izvor slike:
                    <input
                        type="text"
                        name="imageSource"
                        value={formik.values.imageSource}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.imageSource && formik.errors.imageSource ? (
                        <div class="error-message">{formik.errors.imageSource}</div>
                    ) : null}
                </label>
                <label>
                    PDV:
                    <input
                        type="number"
                        name="pdv"
                        value={formik.values.pdv}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.pdv && formik.errors.pdv ? (
                        <div class="error-message">{formik.errors.pdv}</div>
                    ) : null}
                </label>
                <label>
                    Status :
                    <div class="radio-group">
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
                        <div class="error-message">{formik.errors.isActive}</div>
                    ) : null}
                </label>
                <label>
                    Vidljivost :
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="isVisible"
                                value="true"
                                checked={formik.values.isVisible === 'true'}
                                onChange={formik.handleChange}
                            />
                            Vidljiv
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="isVisible"
                                value="false"
                                checked={formik.values.isVisible === 'false'}
                                onChange={formik.handleChange}
                            />
                            Nevidljiv
                        </label>
                    </div>
                    {formik.touched.isVisible && formik.errors.isVisible ? (
                        <div className="error-message">{formik.errors.isVisible}</div>
                    ) : null}
                </label>
                <div className="form-group">
                    <label htmlFor="brandName">Brend</label>
                    <select
                        name="brandName"
                        class="add-article-field"
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
                    <div class="error-message">{formik.errors.brandName}</div>
                ) : null}
                <label>
                    Slika Artikla:
                    <input
                        type="file"
                        name="imageFile"
                        onChange={handleImageChange}
                    />
                    {formik.touched.imageFile && formik.errors.imageFile ? (
                        <div class="error-message">{formik.errors.imageFile}</div>
                    ) : null}
                </label>
                {existingImage && (
                    <div>
                        <p>Postojeća slika:</p>
                        <img src={existingImage} alt="Postojeća slika" style={{ width: '100px', height: '100px' }} />
                    </div>
                )}
            </div>
            <button type="submit">Ažuriraj Artikal</button>
        </form>
    );
}

export default EditArticle;
