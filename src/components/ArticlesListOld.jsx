import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ArticleDataService from "../services/ArticleService";
import { useTable, useSortBy } from "react-table";
import { Navigate } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import logo from './../images/logo.jpg';

const ArticlesList = (props) => {
    const [articles, setArticles] = useState([]);
    const [searchName, setSearchName] = useState("");
    const articlesRef = useRef();
    const navigate = useNavigate();

    articlesRef.current = articles;

    useEffect(() => {
        retrieveArticles();
    }, []);

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

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const refreshList = () => {
        retrieveArticles();
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

    const editArticle = useCallback((id) => {
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    }, [navigate]);

    const activateArticle = useCallback((id) => {
        navigate(`/discountsOfClient`, { state: { clientID: id } });
    }, [navigate]);

    const deactivateArticle = useCallback((id) => {
        navigate(`/discountsOfClient`, { state: { clientID: id } });
    }, [navigate]);

    const deleteArticle = useCallback((rowIndex) => {
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
    }, [articlesRef, setArticles]);

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
                    const customerId = props.row.original.article_id;
                    console.log(props.row.original);
                    console.log(customerId);
                    return (
                        <div className="d-flex justify-content-between max-width-500">
                            <button onClick={() => activateArticle(customerId)} className="btn btn-secondary btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </button>
                            <span onClick={() => deactivateArticle(customerId)} className="btn btn-info btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="fas fa-percent"></i> Rabat
                            </span>
                            <span onClick={() => deleteArticle(customerId)} className="btn btn-danger btn-sm disabled mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
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
        <div>
            <div className="w-full mx-4 my-4 text-center">
                <table className="min-w-full" {...getTableProps()}>
                    <thead className="bg-gray-50">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th className="px-6 py-3 text-lg font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
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
                                            <td className="px-6 py-3 border border-gray-300 whitespace-nowrap" {...cell.getCellProps()}>
                                                {cell.column.id === "imageSource" ? (
                                                    <img src={logo} alt="Logo" className="w-6 h-6" />
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
            <div className="mt-4">
                <Link
                    to="/articles/add"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-green py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
                >
                    Dodaj Artikal
                </Link>
            </div>
        </div>
    );
};

export default ArticlesList;
