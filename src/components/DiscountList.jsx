import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import DiscountDataService from '../services/DiscountService';
import { useTable } from "react-table";
import logo from './../images/logo.jpg';

const DiscountDiscount = () => {
    const [discount, setDiscount] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchDiscount = async () => {
            const response = await DiscountDataService.getAll();
            console.log(response.data);
            const filteredData = response.data.filter((entry) =>
                entry.customer.nameOfTheLegalEntity.toLowerCase().includes(filter.toLowerCase())
            );
            setDiscount(filteredData);
        };
        fetchDiscount();
    }, [filter]);

    const editDiscountEntry = (rowIndex) => {
        console.log("pressed editDiscountEntry");
    };

    const deleteDiscountEntry = (rowIndex) => {
        console.log("pressed deleteDiscountEntry");
    };

    const columns = useMemo(
        () => [
            {
                Header: "Klijent",
                accessor: "customer.nameOfTheLegalEntity",
            },
            {
                Header: "Artikal",
                accessor: "brand.brandName",
            },
            {
                Header: "Rabat (%)",
                accessor: "discount",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div className="d-flex justify-content-between max-width-150">
                            <span onClick={() => editDiscountEntry(rowIdx)} className="btn btn-secondary disabled mx-1">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => deleteDiscountEntry(rowIdx)} className="btn btn-danger disabled mx-1">
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
        data: discount,
    });

    return (
        <div className="list row">
            <div className="col-md-12 list">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ime Klijenta"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
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
                <a href="/discount/add" className="btn btn-sm btn-primary">Dodaj Rabat</a>
            </div>
        </div>
    );
};
export default DiscountDiscount;