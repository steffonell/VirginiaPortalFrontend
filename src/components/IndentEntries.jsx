import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import IndentDataService from '../services/IndentService';
import IndentEntryDataService from '../services/IndentEntryService';
import { useTable } from "react-table";
import logo from './../images/logo.jpg';

const IndentEntries = () => {
    const { code: indentCode } = useParams();
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const response = await IndentEntryDataService.findIndentEntries(indentCode);
            setEntries(response.data);
        };
        fetchEntries();
    }, [indentCode]);

    const editIndentEntry = (rowIndex) => {
        console.log("pressed editIndentEntry");
    };

    const deleteIndentEntry = (rowIndex) => {
        console.log("pressed deleteIndentEntry");
    };


    const columns = useMemo(
        () => [
            {
                Header: "ID Unosa",
                accessor: "id",
            },
            {
                Header: "Klijent",
                accessor: "customer.nameOfTheLegalEntity",
            },
            {
                Header: "Artikal",
                accessor: "article.name",
            },
            {
                Header: "Cena",
                accessor: "article.wholesalePrice",
            },
            {
                Header: "Valuta",
                accessor: "customer.paymentCurrency",
            },
            {
                Header: "Jedinica Mere",
                accessor: "article.unitOfMeasurement",
            },
            {
                Header: "Kolicina",
                accessor: "requestedQuantity",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div className="d-flex justify-content-between max-width-150">
                            <span onClick={() => editIndentEntry(rowIdx)} className="btn btn-secondary disabled mx-1">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => deleteIndentEntry(rowIdx)} className="btn btn-danger disabled mx-1">
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
        data: entries,
    });

    return (
        <div className="container mx-auto p-6">
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
        </div>
    );
};
export default IndentEntries;