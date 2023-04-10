import React, { useState, useEffect } from "react";
import ArticleDataService from "../services/ArticleService";

const Article = props => {
  const initialArticleState = {
    id: null,
    barcode: "",
    brutoMass: "",
    code:"",
    imageSource:"",
    minimumQuantityDemand:"",
    name:"",
    quantityPerTransportPackage:"",
    retailPrice:"",
    unitOfMeasurement:"",
    wholesalePrice:"",
    pdv:"",
    brandId:""
  };
  const [currentArticle, setCurrentArticle] = useState(initialArticleState);
  const [message, setMessage] = useState("");

  const getArticle = id => {
    ArticleDataService.get(id)
      .then(response => {
        setCurrentArticle(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getArticle(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentArticle({ ...currentArticle, [name]: value });
  };

  const updatePublished = status => {
    var data = {
      id: currentArticle.id,
      barcode: currentArticle.barcode,
      brutoMass: currentArticle.brutoMass,
      code: currentArticle.code,
      imageSource: currentArticle.imageSource,
      minimumQuantityDemand: currentArticle.minimumQuantityDemand,
      name: currentArticle.name,
      quantityPerTransportPackage: currentArticle.quantityPerTransportPackage,
      retailPrice: currentArticle.retailPrice,
      unitOfMeasurement: currentArticle.unitOfMeasurement,
      wholesalePrice: currentArticle.wholesalePrice,
      pdv: currentArticle.pdv,
      brandId: currentArticle.brandId,
    };

    ArticleDataService.update(currentArticle.id, data)
      .then(response => {
        setCurrentArticle({ ...currentArticle});
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateArticle = () => {
    ArticleDataService.update(currentArticle.id, currentArticle)
      .then(response => {
        console.log(response.data);
        setMessage("The article was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteArticle = () => {
    ArticleDataService.remove(currentArticle.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/articles");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
        <h1>ArticleCOMPONENT</h1>
    </div>
   /*  <div>
      {currentArticle ? (
        <div className="edit-form">
          <h4>Article</h4>
          <form>
            <div className="form-group">
              <label htmlFor="articleName">Name</label>
              <input
                type="text"
                className="form-control"
                id="articleName"
                name="articleName"
                value={currentArticle.articleName}
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
                value={currentArticle.discount}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteArticle}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateArticle}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Article...</p>
        </div>
      )}
    </div> */
  );
};

export default Article;