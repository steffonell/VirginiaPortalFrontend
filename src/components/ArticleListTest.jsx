import React, { useState, useMemo } from "react";
import { useTable } from "react-table";
import { Link } from "react-router-dom";
import logo from "./../images/logo.jpg";
import ArticleTable from "./ArticleTable";
import useArticles from "./useArticle";

const ArticlesListTest = (props) => {
    const [searchName, setSearchName] = useState("");
    const { articles, articlesRef, retrieveArticles } = useArticles();

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const refreshList = () => {
        retrieveArticles();
    };

    const removeAllArticles = () => {
        ArticleDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        ArticleDataService.findByName(searchName)
            .then((response) => {
                setArticles(JSON.stringify(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };
    // ... other functions like findByName, removeAllArticles, etc.

    const columns = useMemo(
        () => [
            // ... your columns definition
            {
                Header: "Barkod",
                accessor: "barcode",
            },
            {
                Header: "Bruto Masa",
                accessor: "brutoMass",
            },
            {
                Header: "Kod",
                accessor: "code",
            },
            {
                Header: "Slika",
                accessor: "imageSource",
            },
            {
                Header: "Minimalni Trazeni Kvatitet",
                accessor: "minimumQuantityDemand",
            },
            {
                Header: "Ime",
                accessor: "name",
            },
            {
                Header: "Maloprodajna Cena",
                accessor: "retailPrice",
            },
            {
                Header: "Jedinica Mere",
                accessor: "unitOfMeasurement",
            },
            {
                Header: "Veleprodajna Cena",
                accessor: "wholesalePrice",
            },
            {
                Header: "PDV",
                accessor: "pdv",
            },
            {
                Header: "Brend",
                accessor: "brand.brandName",
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: articles,
    });

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-12 list">
                <ArticleTable
                    getTableProps={getTableProps}
                    getTableBodyProps={getTableBodyProps}
                    headerGroups={headerGroups}
                    rows={rows}
                    prepareRow={prepareRow}
                    openArticle={openArticle}
                    deleteArticle={deleteArticle}
                    logo={logo}
                />
            </div>

            <div className="col-md-4">
                <Link to="/articles/add" className="btn btn-sm btn-primary">
                    Add Article
                </Link>
            </div>
            <div className="col-md-8">
                <button className="btn btn-sm btn-danger" onClick={removeAllArticles}>
                    Remove All
                </button>
            </div>
        </div>
    );
};

{/* <img src={cell.value} alt="Article" /> */ }

export default ArticlesListTest;
