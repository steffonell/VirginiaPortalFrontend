import React, { useState, useEffect } from "react";
import ArticleDataService from "../services/ArticleService";
import BrandService from "../services/BrandService";

const AddArticle = () => {
    const initialArticleState = {
        article_id: "",
        barcode: "",
        brutoMass: "",
        code: "",
        imageSource: "",
        minimumQuantityDemand: "",
        name: "",
        quantityPerTransportPackage: "",
/*         retailPrice: "", */
        unitOfMeasurement: "",
        wholesalePrice: "",
        pdv: "",
        brandName: "",
    };
    const [article, setArticle] = useState(initialArticleState);
    const [submitted, setSubmitted] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandName, setBrandName] = useState("");

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

    const handleInputChange = event => {
        const { name, value } = event.target;
        setArticle({ ...article, [name]: value });
    };

    const handleBrandChange = event => {
        setBrandName(event.target.value);
    };

    //useForm hook https://react-hook-form.com/api/useform/
    const saveArticle = () => {
        var data = {
            barcode: article.barcode,
            brutoMass: article.brutoMass,
            code: article.code,
            imageSource: article.imageSource,
            minimumQuantityDemand: article.minimumQuantityDemand,
            name: article.name,
            quantityPerTransportPackage: article.quantityPerTransportPackage,
           /*  retailPrice: article.retailPrice, */
            unitOfMeasurement: article.unitOfMeasurement,
            wholesalePrice: article.wholesalePrice,
            pdv: article.pdv,
            brand: article.brand,
        };

        ArticleDataService.create(data, brandName)
        .then(response => {
            console.log(response); // log the response object
            setArticle({
                article_id: response.data,
            });
            setSubmitted(true);
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    
    };

    const newArticle = () => {
        setArticle(initialArticleState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newArticle}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="barcode">Barcode</label>
                        <input
                            type="text"
                            className="form-control"
                            id="barcode"
                            required
                            value={article.barcode}
                            onChange={handleInputChange}
                            name="barcode"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="brutoMass">Bruto Mass</label>
                        <input
                            type="text"
                            className="form-control"
                            id="brutoMass"
                            required
                            value={article.brutoMass}
                            onChange={handleInputChange}
                            name="brutoMass"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="code"
                            required
                            value={article.code}
                            onChange={handleInputChange}
                            name="code"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageSource">Image Source</label>
                        <input
                            type="text"
                            className="form-control"
                            id="imageSource"
                            required
                            value={article.imageSource}
                            onChange={handleInputChange}
                            name="imageSource"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="minimumQuantityDemand">Minimum Quantity Demand</label>
                        <input
                            type="text"
                            className="form-control"
                            id="minimumQuantityDemand"
                            required
                            value={article.minimumQuantityDemand}
                            onChange={handleInputChange}
                            name="minimumQuantityDemand"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={article.name}
                            onChange={handleInputChange}
                            name="name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantityPerTransportPackage">Quantity Per Transport Package</label>
                        <input
                            type="text"
                            className="form-control"
                            id="quantityPerTransportPackage"
                            required
                            value={article.quantityPerTransportPackage}
                            onChange={handleInputChange}
                            name="quantityPerTransportPackage"
                        />
                    </div>

{/*                     <div className="form-group">
                        <label htmlFor="retailPrice">Retail Price</label>
                        <input
                            type="text"
                            className="form-control"
                            id="retailPrice"
                            required
                            value={article.retailPrice}
                            onChange={handleInputChange}
                            name="retailPrice"
                        />
                    </div> */}

                    <div className="form-group">
                        <label htmlFor="unitOfMeasurement">Unit Of Measurement</label>
                        <input
                            type="text"
                            className="form-control"
                            id="unitOfMeasurement"
                            required
                            value={article.unitOfMeasurement}
                            onChange={handleInputChange}
                            name="unitOfMeasurement"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="wholesalePrice">Wholesale Price</label>
                        <input
                            type="text"
                            className="form-control"
                            id="wholesalePrice"
                            required
                            value={article.wholesalePrice}
                            onChange={handleInputChange}
                            name="wholesalePrice"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pdv">PDV</label>
                        <input
                            type="text"
                            className="form-control"
                            id="pdv"
                            required
                            value={article.pdv}
                            onChange={handleInputChange}
                            name="pdv"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="brandName">Brand</label>
                        <select className="form-control" onChange={handleBrandChange}>
                        <option key="0" value="">Izaberite Brend</option>
                            {brands.map((brand, index) => {
                                return (
                                    <option key={index + 1} value={brand.brandName}>
                                        {brand.brandName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <button onClick={saveArticle} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>);
};

export default AddArticle;