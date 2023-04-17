import React, { useState, useEffect, useMemo, useRef } from "react";
import ArticleDataService from "../services/ArticleService";
import { useTable } from "react-table";
import { Navigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import logo from './../images/logo.jpg';

const ArticlesList = (props) => {
    const [articles, setArticles] = useState([]);
    const [searchName, setSearchName] = useState("");
    const articlesRef = useRef();

    articlesRef.current = articles;

    useEffect(() => {
        retrieveArticles();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const retrieveArticles = () => {
        ArticleDataService.getAll()
            .then((response) => {
                setArticles(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
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

    const openArticle = (rowIndex) => {
        console.log("pressed");
        const id = articlesRef.current[rowIndex].id;
        console.log(id);
        <Link to={`/articles/${id}`} />
        /*         <Navigate to="/articles/${id}" replace={true} />
                <Link to={`contacts/${contact.id}`}/> */
        /* props.history.push("/articles/" + id); */
    };

    const deleteArticle = (rowIndex) => {
        const id = articlesRef.current[rowIndex].id;

        ArticleDataService.remove(id)
            .then((response) => {
                <Navigate to="/articles" replace={true} />
                /* props.history.push("/articles"); */

                let newArticles = [...articlesRef.current];
                newArticles.splice(rowIndex, 1);

                setArticles(newArticles);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const columns = useMemo(
        () => [
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
                Header: "Minimalni Trazeni Kvantitet",
                accessor: "minimumQuantityDemand",
            },
            {
                Header: "Broj Komada U Paketu",
                accessor: "quantityPerTransportPackage",
            },
            {
                Header: "Naziv",
                accessor: "name",
            },
            {
                Header: "Maloprodajna Cena",
                accessor: "retailPrice",
                Cell: ({ value }) => (
                    <span>{Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
                ),
            },    
            {
                Header: "Jedinica Mere",
                accessor: "unitOfMeasurement",
            },
            {
                Header: "Veleprodajna Cena",
                accessor: "wholesalePrice",
                Cell: ({ value }) => (
                    <span>{Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
                ),
            },
            {
                Header: "PDV",
                accessor: "pdv",
                Cell: ({ value }) => <span>{value}%</span>,
            },
            {
                Header: "Brend",
                accessor: "brand.brandName",
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div class="d-flex justify-content-between max-width-500">
                            <span onClick={() => openArticle(rowIdx)} class="btn btn-secondary disabled mx-1">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>
                            <span onClick={() => deleteArticle(rowIdx)} className="btn btn-danger mx-1">
                                <i className="fas fa-trash"></i> Izbrisi
                            </span>
                        </div>
                    );
                },
            },
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
        <div className="container-fluid">
        <div className="row">
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
            <div className="col-12 list">
            <div className="table-responsive">
                <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.column.id === "imageSource" ? (
                                                    <img src={logo} alt="Logo" />
                                                ) : (
                                                    cell.column.id === "wholesalePrice" || cell.column.id === "retailPrice" || cell.column.id === "pdv" ? (
                                                        cell.render("Cell")
                                                    ) : (
                                                        cell.value
                                                    )
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
            </div>

            <div className="col-md-4">
                <a href="/articles/add" className="btn btn-sm btn-primary">Add Article</a>
            </div>
            <div className="col-12 col-md-8">
                <button className="btn btn-sm btn-danger" onClick={removeAllArticles}>
                    Remove All
                </button>
            </div>
        </div>
    );
};

export default ArticlesList;
