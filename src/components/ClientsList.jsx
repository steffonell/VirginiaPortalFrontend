
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ClientDataService from "../services/CustomerService";
import { useTable } from "react-table";
import { useNavigate, Navigate } from "react-router-dom";

const ClientsList = (props) => {
    const [clients, setClients] = useState([]);
    const [cachedClients, setCachedClients] = useState([]);
    const [clientCode, setClientCode] = useState("");
    const [clientName, setClientName] = useState("");
    const clientsRef = useRef();
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    clientsRef.current = clients;

    const handleSearch = () => {
        const filteredData = cachedClients.filter((entry) => {
            const nameMatches = clientName ? entry.nameOfTheLegalEntity.toLowerCase().includes(clientName.toLowerCase()) : true;
            const codeMatches = clientCode ? (entry.customerCode && entry.customerCode.toLowerCase().includes(clientCode.toLowerCase())) : true;
            return nameMatches && codeMatches;
        });
        setClients(filteredData);
    };

    const handleCustomerRegistrationAction = useCallback(() => {
        navigate(`/clients/sendRegistrationPrompt`);
    }, [navigate]);

    useEffect(() => {
        // Fetch all clients once on component mount
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

    const addClient = useCallback(() => {
        navigate(`/clients/add`);
    }, [navigate]);

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
                Header: "Grad",
                accessor: "city",
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
                Header: 'Status',
                accessor: 'isActive',
                Cell: ({ value }) => value ? 'Aktivan' : 'Neaktivan',
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
                        <div className="d-flex justify-content-between max-width-500">
                            <span onClick={() => editClient(customerId)} className="btn btn-secondary btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => clientDiscounts(customerId)} className="btn btn-info btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="fas fa-percent"></i> Rabat
                            </span>

                            <span onClick={() => deliveryAddressesOfClient(customerId)} className="btn btn-info btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="fas fa-building"></i> Poslovne Jedinice
                            </span>

                            {/*                             <span onClick={() => deleteClient(customerId)} className="btn btn-danger btn-sm disabled mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                <i className="fas fa-trash"></i> Izbrisi
                            </span> */}
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
        <div className="overflow-x-auto">
            <div className="container mx-auto p-6 space-y-2 space-x-1">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-1 sm:space-x-4">
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
                </div>
                <button onClick={handleSearch} className="w-full sm:w-auto bg-blue-500 text-white p-2 rounded-md">
                    Pretraga
                </button>
                <button onClick={handleCustomerRegistrationAction} className="w-full sm:w-auto bg-blue-500 text-white p-2 rounded-md">
                    Slanje Registacionog Upita
                </button>
            </div>
            <div className="overflow-x-auto">
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
                                    style: {
                                        backgroundColor: row.original.isActive ? 'white' : '#FFD1D1',
                                    }
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
            </div>
            <button onClick={() => addClient()} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                <i className="fas fa-plus mr-2"></i> Dodaj Klijenta
            </button>
        </div>
    );
};

export default ClientsList;