import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import IndentDataService from "../services/IndentService";
import { useTable, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";
import { formatDate } from "./utils";
import { ThreeDots } from 'react-loader-spinner';
import "../styles/IndentList.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IndentsList = (props) => {
    const [indents, setIndents] = useState([]);
    const [loading, setLoading] = useState(false);
    const indentsRef = useRef();
    const navigate = useNavigate();
    indentsRef.current = indents;
    const { userRole } = useContext(ApplicationContext);
    const [searchCode, setSearchCode] = useState("");
    const [searchDateFrom, setSearchDateFrom] = useState("");
    const [searchDateTo, setSearchDateTo] = useState("");
    const [displayedIndents, setDisplayedIndents] = useState([]);
    const [searchCustomerName, setSearchCustomerName] = useState("");

    useEffect(() => {
        retrieveIndents();
    }, []);

    const retrieveIndents = () => {
        setLoading(true);
        IndentDataService.getAll()
            .then((response) => {
                setIndents(response.data);
                setDisplayedIndents(response.data);
                //console.log(response.data);
                setLoading(false);
            })
            .catch((e) => {
                //console.log(e);
                setLoading(false);
            });
    };

    const handleResetClick = () => {
        setSearchCustomerName("");
        setSearchCode("");
        setSearchDateFrom("");
        setSearchDateTo("");
        setDisplayedIndents(indentsRef.current);
    };

    const deleteIndent = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        IndentDataService.remove(indentCode)
            .then((response) => {
                retrieveIndents();
                toast.success('Uspešno obrisana porudžbina! [' + indentCode + ']');
            })
            .catch((e) => {
                toast.error(e);
            });
    };

    const activateIndent = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        IndentDataService.activateIndent(indentCode)
            .then(() => {
                retrieveIndents();
                toast.success('Uspešno aktivirana porudžbina! [' + indentCode + ']');
            })
            .catch((e) => {
                toast.error(e);
            });
    };

    const confirmDelivery = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        IndentDataService.confirmIndentDelivery(indentCode)
            .then(() => {
                retrieveIndents();
                toast.success('Uspešno isporučena porudžbina!! [' + indentCode + ']');
            })
            .catch((e) => {
                toast.error(e);
            });
    }

    const viewIndent = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
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
                Header: "Šifra Klijenta",
                accessor: "customerCode",
            },
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
                Header: "Status Porudzbenice",
                accessor: "indentStatus",
            },
            {
                Header: "Datum",
                accessor: "creationTime",
                Cell: ({ value }) => formatDate(value),
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    const status = props.row.values.indentStatus;
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

                            {status == "PENDING" && (userRole == "ROLE_FAKTURISTA" || userRole == "ROLE_ADMIN") ? (
                                <React.Fragment>
                                    <button onClick={() => activateIndent(rowIdx)} className="btn btn-primary mx-1">
                                        <i className="fas fa-check"></i> Aktiviraj
                                    </button>
                                </React.Fragment>
                            ) : null}

                            {status == "ACTIVATED" && (userRole == "ROLE_MAGACIONER" || userRole == "ROLE_ADMIN" || userRole == "ROLE_FAKTURISTA") ? (
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

    const handleShowActiveIndents = () => {
        setLoading(true);
        IndentDataService.getAllActiveIndents()
            .then((response) => {
                setIndents(response.data);
                setDisplayedIndents(response.data);
                //console.log(response.data);
                setLoading(false);
            })
            .catch((e) => {
                //console.log(e);
                setLoading(false);
            });
    };

    const handleShowInactiveIndents = () => {
        setLoading(true);
        IndentDataService.getAllInactiveIndents()
            .then((response) => {
                setIndents(response.data);
                setDisplayedIndents(response.data);
                //console.log(response.data);
                setLoading(false);
            })
            .catch((e) => {
                //console.log(e);
                setLoading(false);
            });
    };

    const handleShowAllIndents = () => {
        setLoading(true);
        IndentDataService.getAllIndents()
            .then((response) => {
                setIndents(response.data);
                setDisplayedIndents(response.data);
                //console.log(response.data);
                setLoading(false);
            })
            .catch((e) => {
                //console.log(e);
                setLoading(false);
            });
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

    const getRowBgColorClass = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-orange-100';  // light orange
            case 'ACTIVATED':
                return 'bg-green-100';  // light green
            case 'CANCELED':
                return 'bg-red-100';  // light red
            case 'DELIVERED':
                return 'bg-blue-100';  // light blue
            default:
                return '';  // default (no background color)
        }
    };


    return (
        <div className="overflow-x-auto">
            <div className="container mx-auto p-6">
                <div className="flex flex-wrap -mx-2">
                    {userRole !== "ROLE_USER" && (
                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Klijent</label>
                            <input
                                type="text"
                                id="clientName"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Ime Klijenta"
                                value={searchCustomerName}
                                onChange={(e) => setSearchCustomerName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="w-full md:w-1/3 px-2 mb-4">
                        <label htmlFor="orderID" className="block text-sm font-medium text-gray-700">ID porudzbine</label>
                        <input
                            type="text"
                            id="orderID"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="ID porudzbenice"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/3 px-2 mb-4">
                        <div className="flex flex-wrap -mx-2">
                            <div className="w-1/2 px-2">
                                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">Od</label>
                                <input
                                    type="date"
                                    id="dateFrom"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Date From"
                                    value={searchDateFrom}
                                    onChange={(e) => setSearchDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 px-2">
                                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">Do</label>
                                <input
                                    type="date"
                                    id="dateTo"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Date To"
                                    value={searchDateTo}
                                    onChange={(e) => setSearchDateTo(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="w-full px-2 mb-4 flex justify-center md:justify-start">
                        <button className="btn btn-outline-secondary mx-1" type="button" onClick={handleSearchClick}>
                            Pretraga
                        </button>
                        <button className="btn btn-outline-secondary mx-1" type="button" onClick={handleResetClick}>
                            Reset
                        </button>
                        {userRole !== "ROLE_USER" && (
                            <div>
                                <button className="btn btn-outline-secondary mx-1" type="button" onClick={handleShowActiveIndents}>
                                    Prikaži Samo Aktivne Porudžbine
                                </button>
                                <button className="btn btn-outline-secondary mx-1" type="button" onClick={handleShowInactiveIndents}>
                                    Prikaži Samo Neaktivne Porudžbine
                                </button>
                                <button className="btn btn-outline-secondary mx-1" type="button" onClick={handleShowAllIndents}>
                                    Prikaži Sve Porudžbine
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <ThreeDots type="ThreeDots" color="#00BFFF" height={80} width={80} />
                    </div>
                ) : (
                    <table {...getTableProps()} className="min-w-full">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} className="px-4 py-2 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps({
                                        className: getRowBgColorClass(row.original.indentStatus)
                                    })}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} className="px-4 py-2 border-b border-gray-300 text-sm leading-5 text-gray-900">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default IndentsList;
