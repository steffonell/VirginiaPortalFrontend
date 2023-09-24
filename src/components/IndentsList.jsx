import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import IndentDataService from "../services/IndentService";
import { useTable, useSortBy, useFilters } from "react-table";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";
import logo from './../images/logo.jpg';
import { formatDate } from "./utils";
import "../styles/IndentList.css"

const IndentsList = (props) => {
    const [indents, setIndents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const indentsRef = useRef();
    const navigate = useNavigate();
    indentsRef.current = indents;
    const { loggedInClient, userRole } = useContext(ApplicationContext);
    const [searchCode, setSearchCode] = useState("");
    const [searchDateFrom, setSearchDateFrom] = useState("");
    const [searchDateTo, setSearchDateTo] = useState("");
    const [displayedIndents, setDisplayedIndents] = useState([]);
    const [searchCustomerName, setSearchCustomerName] = useState("");


    useEffect(() => {
        retrieveIndents();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const retrieveIndents = () => {
        IndentDataService.getAll()
            .then((response) => {
                setIndents(response.data);
                setDisplayedIndents(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleResetClick = () => {
        setSearchCustomerName("");
        setSearchCode("");
        setSearchDateFrom("");
        setSearchDateTo("");
        setDisplayedIndents(indentsRef.current);
    };

    const refreshList = () => {
        retrieveIndents();
    };

    const deleteIndent = (rowIndex) => {
        const id = indentsRef.current[rowIndex].id;

        IndentDataService.remove(id)
            .then((response) => {
                <Navigate to="/indents" replace={true} />
                let newIndents = [...indentsRef.current];
                newIndents.splice(rowIndex, 1);

                setIndents(newIndents);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
        return (
            <input
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Search`}
            />
        );
    };

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const activateIndent = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        IndentDataService.activateIndent(indentCode)
            .then((response) => {
                console.log("Aktiviran indent:"+response);
                const newIndents = [...indentsRef.current];
                console.log("newIndents:"+newIndents);
                newIndents[rowIndex] = response.data;
                console.log("newIndents2:"+newIndents);
                setIndents(newIndents);
                setDisplayedIndents(newIndents);
                window.confirm('Uspešno aktivirana porudžbina! [' + indentCode + ']');
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const confirmDelivery = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        IndentDataService.confirmIndentDelivery(indentCode)
            .then((response) => {
                const newIndents = [...indentsRef.current];
                newIndents[rowIndex] = response.data;
                setIndents(newIndents);
                setDisplayedIndents(newIndents);
                window.confirm('Uspešno isporučena porudžbina!! [' + indentCode + ']');
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const viewIndent = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        console.log("navigate");
        navigate(`/indents/entries/${indentCode}`);
    };

    const DateInputWithPlaceholder = ({ placeholder, value, onChange }) => {
        const [isFocused, setIsFocused] = useState(false);

        return isFocused ? (
            <input
                type="date"
                className="form-control"
                value={value}
                onChange={onChange}
                onBlur={() => setIsFocused(false)}
            />
        ) : (
            <input
                type="text"
                className="form-control"
                value={value || placeholder}
                onFocus={() => setIsFocused(true)}
            />
        );
    };

    // usage in your form
    <DateInputWithPlaceholder
        placeholder="Date From"
        value={searchDateFrom}
        onChange={(e) => setSearchDateFrom(e.target.value)}
    />

    const columns = useMemo(
        () => [
            {
                Header: "Klijent",
                accessor: "customerNameOfTheLegalEntity",
            },
            {
                Header: "Adresa Dostave",
                accessor: row => `${row.deliveryAddressCity}, ${row.deliveryAddressLocation}`,
            },
            {
                Header: "ID Porudzbenice",
                accessor: "code",
            },
            {
                Header: "Poručena količina",
                accessor: "orderedQuantity",
            },
            {
                Header: "Status Porudzbenice",
                accessor: "indentStatus",
            },
            {
                Header: "Datum",
                accessor: "creationTime",
                Cell: ({ value }) => formatDate(value),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div className="d-flex max-width-500">
                            {props.row.values.indentStatus == "PENDING" ? (
                                <button onClick={() => deleteIndent(rowIdx)} className="btn btn-danger mx-1">
                                    <i className="fas fa-trash"></i> Izbrisi
                                </button>
                            ) : null}

                            <button onClick={() => viewIndent(rowIdx)} className="btn btn-primary mx-1">
                                <i className="far fa-eye mr-2"></i> Pregled
                            </button>

                            {props.row.values.indentStatus == "PENDING" && (userRole == "ROLE_FAKTURISTA" || userRole == "ROLE_ADMIN") ? (
                                <React.Fragment>
                                    <button onClick={() => activateIndent(rowIdx)} className="btn btn-primary mx-1">
                                        <i className="fas fa-check"></i> Aktiviraj
                                    </button>
                                </React.Fragment>
                            ) : null}

                            {props.row.values.indentStatus == "ACTIVATED" && (userRole == "ROLE_MAGACIONER" || userRole == "ROLE_ADMIN") ? (
                                <button onClick={() => confirmDelivery(rowIdx)} className="btn btn-primary mx-1">
                                    <i className="fas fa-check"></i> Potvrdi Isporuku
                                </button>
                            ) : null}

                        </div>
                    );
                },
            },

        ],
        []
    );


    const handleSearchClick = () => {
        const filteredIndents = indentsRef.current.filter(indent => {
            const indentDate = new Date(indent.creationTime);

            const isCodeMatch = !searchCode || indent.code.includes(searchCode);
            const isDateFromMatch = !searchDateFrom || indentDate >= new Date(searchDateFrom);
            const isDateToMatch = !searchDateTo || indentDate <= new Date(searchDateTo);
            const isCustomerNameMatch = !searchCustomerName || indent.customerNameOfTheLegalEntity.toLowerCase().includes(searchCustomerName.toLowerCase());

            return isCodeMatch && isDateFromMatch && isDateToMatch && isCustomerNameMatch;
        });

        setDisplayedIndents(filteredIndents);
    };


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
            data: displayedIndents,
            initialState: {
                sortBy: [{ id: "creationTime", desc: true }],
            },
        },
        useSortBy
    );

    return (
        <div className="w-full mx-4 my-4">
          <div className="container mx-auto p-6">
                <div className="col-12">
                    <div className="form-row justify-content-center">
                        <div className="col-12 col-md-4 my-1">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ime Klijenta"
                                value={searchCustomerName}
                                onChange={(e) => setSearchCustomerName(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-4 my-1">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ID porudzbenice"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-4 my-1">
                            <div className="form-row">
                                <div className="col-6">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="Date From"
                                        value={searchDateFrom}
                                        onChange={(e) => setSearchDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="Date To"
                                        value={searchDateTo}
                                        onChange={(e) => setSearchDateTo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-auto my-1">
                            <button className="btn btn-outline-secondary" type="button" onClick={handleSearchClick}>
                                Pretraga
                            </button>
                        </div>
                        <div className="col-12 col-md-auto my-1">
                            <button className="btn btn-outline-secondary" type="button" onClick={handleResetClick}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                                                    cell.render("Cell")
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
            {/*             <div className="col-md-4">
                <a href="/indents/add" className="btn btn-sm btn-primary">Add Indent</a>
            </div> */}
        </div>
    );
};

{/* <img src={cell.value} alt="Indent" /> */ }

export default IndentsList;