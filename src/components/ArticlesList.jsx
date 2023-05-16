import React, { useState, useEffect, useMemo, useRef } from "react";
import ArticleDataService from "../services/ArticleService";
import { useTable, useSortBy } from "react-table";
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
                Header: "Šifra Artikla",
                accessor: "code",
            },
            {
                Header: "GTIN",
                accessor: "barcode",
            },
            {
                Header: "Naziv",
                accessor: "name",
            },
            {
                Header: "Jedinica Mere",
                accessor: "unitOfMeasurement",
            },
            {
                Header: "Brend",
                accessor: "brand.brandName",
            },
            {
                Header: "Fakturna Cena",
                accessor: "wholesalePrice",
                Cell: ({ value }) => (
                    <span>{Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
                ),
            },
            {
                Header: "Stopa PDV-a",
                accessor: "pdv",
                Cell: ({ value }) => <span>{value}%</span>,
            },
            {
                Header: "Broj Komada U Paketu",
                accessor: "quantityPerTransportPackage",
            },
            {
                Header: "Minimum Za Trebovanje",
                accessor: "minimumQuantityDemand",
            },
            {
                Header: "Bruto Težina Proizvoda (KG)",
                accessor: "brutoMass",
                Cell: ({ cell: { value } }) => {
                    return value + " KG";
                },
            },
            {
                Header: "Slika",
                accessor: "imageSource",
            },
            {
                Header: "Maloprodajna Cena",
                accessor: "retailPrice",
                Cell: ({ value }) => (
                    <span>{Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
                ),
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
        state,
    } = useTable(
        {
            columns,
            data: articles,
            initialState: {
                sortBy: [{ id: "code", desc: true }],
            },
        },
        useSortBy
    );


    return (
        <div className="table-responsive table-striped table-bordered">
            <table
                className="table"
                {...getTableProps()}
            >
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    <div>
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? " 🔽"
                                                    : " 🔼"
                                                : ""}
                                        </span>
                                    </div>
                                    <div>{column.canFilter ? column.render("Filter") : null}</div>
                                </th>
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

            <div className="col-md-4">
                <a href="/articles/add" className="btn btn-sm btn-primary">Dodaj Artikal</a>
            </div>
        </div>
    );
};

export default ArticlesList;
