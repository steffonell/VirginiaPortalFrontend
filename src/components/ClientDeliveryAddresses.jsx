import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import DeliveryAddressService from "../services/DeliveryAddressService";
import CustomerService from "../services/CustomerService";
import { useTable } from "react-table";

const ClientDeliveryAddresses = () => {
    const location = useLocation();
    const { clientID } = location.state || {};
    const [customer, setCustomer] = useState([]);
    const [deliveryAddresses, setDeliveryAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientDeliveryAddresses();
        retreiveClient(clientID);
    }, [clientID]);

    const retreiveClient = (id) => {
        CustomerService.get(id)
            .then(response => {
                setCustomer(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const fetchClientDeliveryAddresses = async () => {
        try {
            const response = await DeliveryAddressService.findDeliveryAddressesOfSpecificClient(clientID);
            if (Array.isArray(response)) {
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
        navigate(`/editAddressOfSpecifiedClient`, { state: { deliveryAddressID: id, clientID } });
    };

    const addDeliveryAddress = () => {
        navigate(`/addDeliveryAddressToSpecifiedClient`, { state: { clientID } });
    }

    const deleteDeliveryAddress = (id) => {
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
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-4">
                    Poslovne Jedinice Klijenta 
                    <span className="text-blue-600 underline ml-2">{customer.nameOfTheLegalEntity}</span>
                </h3>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
                <button onClick={() => addDeliveryAddress()} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    <i className="far fa-edit mr-2"></i> Dodaj Poslovnu Jedinicu
                </button>
            </div>
        </div>
    );
};

export default ClientDeliveryAddresses;