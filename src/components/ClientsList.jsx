import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ClientDataService from "../services/CustomerService";
import { useTable } from "react-table";
import { useNavigate, Navigate, Link } from "react-router-dom";
import logo from './../images/logo.jpg';

const ClientsList = (props) => {
    const [clients, setClients] = useState([]);
    const [cachedClients, setCachedClients] = useState([]);
    const [clientCode, setClientCode] = useState("");
    const [clientName, setClientName] = useState("");
    const clientsRef = useRef();
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    clientsRef.current = clients;

    const retrieveClients = useCallback(() => {
        ClientDataService.getAll()
            .then((response) => {
                if (response && response.data) {
                    const filteredData = response.data.filter((entry) =>
                        entry.nameOfTheLegalEntity.toLowerCase().includes(filter.toLowerCase()) ||
                        (entry.customerCode && entry.customerCode.toLowerCase().includes(clientCode.toLowerCase()))
                    );
                    setClients(filteredData);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }, [filter, clientCode]);

    useEffect(() => {
        // Fetch all clients once on component mount
        ClientDataService.getAll()
            .then((response) => {
                if (response && response.data) {
                    setCachedClients(response.data);
                    setClients(response.data);  // Initially display all clients
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const filterClientsBasedOnCriteria = useCallback(() => {

        const filteredData = cachedClients.filter((entry) =>
            (entry.nameOfTheLegalEntity && entry.nameOfTheLegalEntity.toLowerCase().includes(filter.toLowerCase())) ||
            (entry.customerCode && entry.customerCode.toLowerCase().includes(clientCode.toLowerCase()))
        );
        setClients(filteredData);
    }, [cachedClients, filter, clientCode]);

    const onChangeFilter = useCallback((e) => {
        const filterValue = e.target.value;
        setFilter(filterValue);
    }, []);

    const editClient = useCallback((id) => {
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    }, [navigate]);

    const clientDiscounts = useCallback((id) => {
        navigate(`/discountsOfClient`, { state: { clientID: id } });
    }, [navigate]);

    const deliveryAddressesOfClient = useCallback((id) => {
        navigate(`/addressesOfClient`, { state: { clientID: id } });
    }, [navigate]);

    const deleteClient = useCallback((rowIndex) => {
        const id = clientsRef.current[rowIndex].id;

        ClientDataService.remove(id)
            .then((response) => {
                <Navigate to="/clients" replace={true} />

                let newClients = [...clientsRef.current];
                newClients.splice(rowIndex, 1);

                setClients(newClients);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [clientsRef, setClients]);

    const columns = useMemo(
        () => [
            {
                Header: "Šifra Klijenta",
                accessor: "customerCode",
            },
            {
                Header: "Ime Legalnog Entiteta",
                accessor: "nameOfTheLegalEntity",
            },
            {
                Header: "Addresa",
                accessor: "address",
            },
            {
                Header: "PIB",
                accessor: "pib",
            },
            {
                Header: "Identifikacioni Broj",
                accessor: "identificationNumber",
            },
            {
                Header: "Kontakt Osoba",
                accessor: "contactPerson",
            },
            {
                Header: "Kontakt Broj",
                accessor: "contactNumber",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Valuta Placanja",
                accessor: "paymentCurrency",
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const customerId = props.row.original.customer_id;
                    return (
                        <div className="d-flex justify-content-between max-width-150">
                            <span onClick={() => editClient(customerId)} className="btn btn-secondary btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => clientDiscounts(customerId)} className="btn btn-info btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="fas fa-percent"></i> Rabat
                            </span>

                            <span onClick={() => deliveryAddressesOfClient(customerId)} className="btn btn-info btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="fas fa-building"></i> Poslovne Jedinice
                            </span>

                            <span onClick={() => deleteClient(customerId)} className="btn btn-danger btn-sm disabled mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
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
        data: clients,
    });

    return (
        <div className="container mx-auto p-6">
            <div className="container mx-auto p-6">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Ime Klijenta"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                />
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Šifra Klijenta"
                    value={clientCode}
                    onChange={e => setClientCode(e.target.value)}
                />
                <button onClick={filterClientsBasedOnCriteria} className="bg-blue-500 text-white p-2 rounded-md">
                    Pretraga
                </button>
            </div>

            <div className="table-responsive table-striped table-bordered">
                <table className="min-w-full">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-300">
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()} className="p-2 border">{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="hover:bg-gray-100">
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()} className="p-2 border">
                                            {cell.column.id === "imageSource" ? (
                                                <img src={logo} alt="Logo" className="w-6 h-6" />
                                            ) : (
                                                cell.render("Cell")
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <Link
                    to="/clients/add"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-green py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
                >
                    Dodaj Klijenta
                </Link>
            </div>
        </div>
    );
};

export default ClientsList;