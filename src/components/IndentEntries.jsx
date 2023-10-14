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
                Header: "#",
                accessor: "id",
                Cell: (props) => {
                    const rowIndex = props.row.index;
                    return rowIndex + 1;
                },
            },
/*             {
                Header: "ID Unosa",
                accessor: "id",
            }, */
/*             {
                Header: "Klijent",
                accessor: "customer.nameOfTheLegalEntity",
            }, */
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
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
/*                     return (
                        <div className="flex justify-between max-w-xs">
                            <span onClick={() => editIndentEntry(rowIdx)} className="btn btn-secondary disabled mx-1 text-gray-500 hover:text-gray-700">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => deleteIndentEntry(rowIdx)} className="btn btn-danger disabled mx-1 text-red-500 hover:text-red-700">
                                <i className="fas fa-trash"></i> Izbrisi
                            </span>
                        </div>
                    ); */
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
                    className="min-w-full bg-white divide-y divide-gray-200"
                    {...getTableProps()}
                >
                    <thead className="bg-gray-50">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                                                {cell.column.id === "imageSource" ? (
                                                    <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
                                                ) : (
                                                    <div className="text-sm text-gray-900">{cell.render("Cell")}</div>
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
