import React, { useState, useEffect, useMemo, useRef } from "react";
import DeliveryAddressService from "../services/DeliveryAddressService";
import { useTable } from "react-table";
import { useNavigate, useParams } from "react-router-dom";

const DeliveryAddressesList = (props) => {
    const [addresses, setAddresses] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchAddressName, setSearchAddressName] = useState("");
    const addressesRef = useRef();
    const navigate = useNavigate();

    addressesRef.current = addresses;

    useEffect(() => {
        retrieveAddresses();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const onChangeSearchAddressName = (e) => {
        const searchAddressName = e.target.value;
        setSearchAddressName(searchAddressName);
    };

    // Filter addresses by the customer name
    const filteredAddresses = addresses.filter(address =>
        address?.customerNameOfTheLegalEntity?.toLowerCase().includes(searchName.toLowerCase()) &&
        address?.name?.toLowerCase().includes(searchAddressName.toLowerCase())
    );


    const retrieveAddresses = () => {
        DeliveryAddressService.getAll()
            .then((response) => {
                setAddresses(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const editAddress = (id) => {
        // Navigate to edit address page. 
        // Make sure you have a route defined for this in your application.
        console.log("ID of address" + id);
        navigate(`/address/edit/${id}`);
    };
    const deleteAddress = (id) => {
        console.log("clicks");
        const confirmation = window.confirm("Da li ste sigurni da želite da obrišete ovu poslovnu jedinicu?");
        if (confirmation) {
            DeliveryAddressService.remove(id)
                .then(response => {
                    // after deletion, we filter out the deleted address
                    const newAddresses = addressesRef.current.filter(address => address.id !== id);
                    setAddresses(newAddresses);
                    alert('Poslovna jedinica izbrisana uspešno!'); // Show success alert
                })
                .catch(e => {
                    console.log(e);
                    alert('Poslovna jedinica nije izbrisana uspešno.'); // Show failure alert
                });
        }
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
                            <span onClick={() => editAddress(deliveryAddressID)} class="btn btn-secondary mx-1">
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
        data: filteredAddresses,
    });

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ime Klijenta"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ime Poslovne Jedinice"
                        value={searchAddressName}
                        onChange={onChangeSearchAddressName}
                    />
                </div>
            </div>
            <div className="col-md-12 list">
                <table
                    className="table table-responsive table-striped table-bordered table-margin"
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
                <a href="/address/add" className="btn btn-sm btn-primary">Dodaj Adresu</a>
            </div>
        </div>
    );
};

export default DeliveryAddressesList;