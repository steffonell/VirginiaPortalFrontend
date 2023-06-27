import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import DeliveryAddressService from "../services/DeliveryAddressService";
import { useTable } from "react-table";

const ClientDeliveryAddresses = () => {
    const location = useLocation();
    const { clientID } = location.state || {};
    const[deliveryAddresses, setDeliveryAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientDeliveryAddresses();
    }, [clientID]);

    const fetchClientDeliveryAddresses = async () => {
        try {
            const response = await DeliveryAddressService.findDeliveryAddressesOfSpecificClient(clientID);
            if(Array.isArray(response)) {
                console.log('Component Response:', response); // Added for debugging
                setDeliveryAddresses(response);
            } else {
                console.log('Response is not an array.', response);
            }
        } catch (error) {
            console.error('An error occurred while fetching client DeliveryAddresss:', error);
        } finally {
            setLoading(false);
        }
    };

    const editDeliveryAddress = (id) => {
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    };

    const deleteDeliveryAddress = (id) => {
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    };

    const columns = useMemo(
        () => [
            {
                Header: "Klijent",
                accessor: "customerNameOfTheLegalEntity",
            },
            {
                Header: "Naziv Poslovne Jedinice",
                accessor: "name",
            },
            {
                Header: "Grad",
                accessor: "city",
            },
            {
                Header: "Adresa",
                accessor: "address",
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
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const deliveryAddressID = props.row.original.delivery_address_id;
                    return (
                        <div class="d-flex justify-content-between max-width-150">
                            <span onClick={() => editDeliveryAddress(deliveryAddressID)} class="btn btn-secondary mx-1">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span /* onClick={() => deleteAddress(deliveryAddressID)} */ className="btn btn-danger disabled mx-1">
                                {/* Ne radi sa java strane brisanje, jos moram da provalim sto */}
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
        data: deliveryAddresses,
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="list row">
            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
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
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="col-md-4">
                <a href="/brands/add" className="btn btn-sm btn-primary">Dodaj Poslovnu Jedinicu</a>
            </div>
        </div>
    );
};

export default ClientDeliveryAddresses; 