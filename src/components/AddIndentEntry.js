import React, { useState, useEffect } from "react";
import IndentDataService from "../services/IndentService";
import ArticleService from "../services/ArticleService";
import IndentEntryDataService from "../services/IndentEntryService";

const AddIndent = () => {
    const initialIndentEntryState = {
        indentEntryId: "",
        indent:"",
        article: "",
        requestedQuantity: ""
    };
    const [indentEntry, setIndentEntry] = useState(initialIndentEntryState);
    const [submitted, setSubmitted] = useState(false);
    const [articles, setArticles] = useState([]);
    const [indents, setIndents] = useState([]);
    const [articleName, setArticleName] = useState("");
    const [indentCode, setSetIndentCode] = useState("");

    useEffect(() => {
        retrieveArticles();
        retrieveIndents();
    }, []);

    const retrieveArticles = () => {
        ArticleService.getAll()
            .then(response => {
                setArticles(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const retrieveIndents = () => {
        IndentDataService.getAll()
            .then(response => {
                setIndents(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setIndentEntry({ ...indentEntry, [name]: value });
    };

    const handleArticleChange = event => {
        setArticleName(event.target.value);
    };

    const handleIndentChange = event => {
        setSetIndentCode(event.target.value);
    };

    //useForm hook https://react-hook-form.com/api/useform/
    const saveIndentEntry = () => {
        var data = {
            requestedQuantity: indentEntry.requestedQuantity
        };

        IndentEntryDataService.create(data, articleName, indentCode)
            .then(response => {
                setIndentEntry({
                    indentEntryId: response.data.indent_entry_id,
                    indent: response.data.indent,
                    article: response.data.article,
                    requestedQuantity: response.data.requestedQuantity
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newIndentEntry = () => {
        setIndentEntry(initialIndentEntryState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newIndentEntry}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="indent">Porudzbenica</label>
                        <select className="form-control" onChange={handleIndentChange}>
                            <option value="">Izaberite Porudzbenicu</option>
                            {indents.map(indent => {
                                return (
                                    <option key={indent._id} value={indent.code}>
                                        {indent.code}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="articleName">Artikal</label>
                        <select className="form-control" onChange={handleArticleChange}>
                            <option value="">Izaberite Artikal</option>
                            {articles.map(article => {
                                return (
                                    <option key={article._id} value={article.name}>
                                        {article.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="requestedQuantity">Kolicina</label>
                        <input
                            type="number"
                            className="form-control"
                            id="requestedQuantity"
                            required
                            value={indentEntry.requestedQuantity}
                            onChange={handleInputChange}
                            name="requestedQuantity"
                        />
                    </div>

                    <button onClick={saveIndentEntry} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>);
};

export default AddIndent;