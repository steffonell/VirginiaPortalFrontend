import React, { useState, useEffect, useMemo, useRef } from "react";
import ClientDataService from "../services/CustomerService";
import { useTable } from "react-table";
import { useNavigate, Navigate } from "react-router-dom";
import logo from './../images/logo.jpg';

const ClientsList = (props) => {
    const [clients, setClients] = useState([]);
    const [clientCode, setClientCode] = useState("");
    const clientsRef = useRef();
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    clientsRef.current = clients;


    useEffect(() => {
        retrieveClients();
    }, [filter, clientCode]);

    const onChangeFilter = (e) => {
        const filter = e.target.value;
        setFilter(filter);
    };

    const retrieveClients = () => {
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
    };
    


    const editClient = (id) => {
        // Navigate to edit address page. 
        // Make sure you have a route defined for this in your application.
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    };

    const clientDiscounts = (id) => {
        navigate(`/discountsOfClient`, { state: { clientID: id } });
    };
    
/*     const clientDiscounts = (nameOfTheLegalEntity, city, address, pib, identificationNumber, email, customerCode) => {
        // Pass the customer id to the discount page as state
        navigate(`/discount`, { state: { nameOfTheLegalEntity: nameOfTheLegalEntity, city: city, address: address, pib: pib, identificationNumber: identificationNumber, email: email, customerCode: customerCode } });
    }; */

    const deliveryAddressesOfClient = (id) => {
        navigate(`/addressesOfClient`, { state: { clientID: id } });
    };


    const deleteClient = (rowIndex) => {
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
    };

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
                        <div class="d-flex justify-content-between max-width-150">
                            <span onClick={() => editClient(customerId)} class="btn btn-secondary btn-sm mx-1" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
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
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ime Klijenta"
                        value={filter}
                        onChange={onChangeFilter}
                    />
                </div>

                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Šifra Klijenta"
                        value={clientCode}
                        onChange={e => setClientCode(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-12 list">
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

            <div className="col-md-4">
                <a href="/clients/add" className="btn btn-sm btn-primary">Dodaj Klijenta</a>
            </div>
        </div>
    );
};

{/* <img src={cell.value} alt="Client" /> */ }

export default ClientsList;