import React, { useState, useEffect, useMemo, useRef } from "react";
import ClientDataService from "../services/CustomerService";
import { useTable } from "react-table";
import { Navigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import logo from './../images/logo.jpg';

const ClientsList = (props) => {
    const [clients, setClients] = useState([]);
    const [searchName, setSearchName] = useState("");
    const clientsRef = useRef();

    clientsRef.current = clients;

    useEffect(() => {
        retrieveClients();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const retrieveClients = () => {
        ClientDataService.getAll()
            .then((response) => {
                setClients(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        ClientDataService.findByName(searchName)
            .then((response) => {
                setClients(JSON.stringify(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const editClient = (rowIndex) => {
        console.log("pressed");
        const id = clientsRef.current[rowIndex].id;
        console.log(id);
        <Link to={`/clients/${id}`} />
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
                    const rowIdx = props.row.id;
                    return (
                        <div class="d-flex justify-content-between max-width-150">
                            <span onClick={() => editClient(rowIdx)} class="btn btn-secondary disabled mx-1">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => deleteClient(rowIdx)} className="btn btn-danger mx-1">
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