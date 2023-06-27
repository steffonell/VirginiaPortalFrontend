import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation  } from 'react-router-dom';
import DiscountService from "../services/DiscountService";
import { useTable } from "react-table";

const ClientDiscounts = () => {
    const location = useLocation();
    const { clientID } = location.state || {};
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientDiscounts();
    }, [clientID]);

    const fetchClientDiscounts = async () => {
        try {
            const response = await DiscountService.findDiscountsOfSpecificClient(clientID);
            if (response) {
                console.log('Component Response:', response); // Added for debugging
                setDiscounts(response);
            } else {
                console.log('No response received from the service.');
            }
        } catch (error) {
            console.error('An error occurred while fetching client discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const editDiscount = (id) => {
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    };

    const deleteDiscount = (id) => {
        console.log("ID of client" + id);
        navigate(`/clients/edit/${id}`);
    };

    const columns = useMemo(
        () => [
            {
                Header: "Brend",
                accessor: "brand.brandName",
            },
            {
                Header: "Rabat",
                accessor: "discount",
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <span onClick={() => editDiscount(rowIdx)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

                            <span onClick={() => deleteDiscount(rowIdx)}>
                                <i className="fas fa-trash action"></i>
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
        data: discounts,
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
                <a href="/brands/add" className="btn btn-sm btn-primary">Dodaj Rabat</a>
            </div>
        </div>
    );
};

export default ClientDiscounts;
