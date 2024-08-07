import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams } from 'react-router-dom';
import IndentEntryDataService from '../services/IndentEntryService';
import { useTable } from "react-table";
import logo from './../images/logo.jpg';
import { formatNumber, formatNumberKG } from './utils';

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

    const firstEntry = entries && entries.length > 0 ? entries[0] : null;

    const comment = firstEntry ? firstEntry.indent.comment : "";

    const totalCost = entries
        ? entries.reduce((acc, item) => acc + item.finalPriceForGivenQuantity, 0)
        : 0;

    const totalWeight = entries
        ? entries.reduce((acc, item) => acc + item.articleWeightForGivenQuantity, 0)
        : 0;

    const totalNumberOfPackages = entries
        ? entries.reduce((acc, item) => acc + item.numberOfPackages, 0)
        : 0;

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
            {
                Header: "Artikal",
                accessor: "article.name",
            },
            {
                Header: "Cena",
                accessor: "articleWholeSalePrice",
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
                Header: "Rabat",
                accessor: "discount",
                Cell: (props) => {
                    const discount = props.row.original.articleBrandDiscount;
                    return `${discount} %`;
                },
            },
            {
                Header: "Ukupna Cena",
                accessor: "finalPriceForGivenQuantity",
                Cell: (props) => {
                    const price = props.row.original.finalPriceForGivenQuantity;
                    return formatNumber(price);
                },
            },
            {
                Header: "Broj Paketa",
                accessor: "numberOfPackages",
            },
            {
                Header: "Težina",
                accessor: "weight",
                Cell: (props) => {
                    const weight = props.row.original.articleWeightForGivenQuantity;
                    return formatNumberKG(weight);
                },
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
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
            <h3 className="flex items-center text-2xl font-semibold text-gray-700">
                <i className="fas fa-shopping-cart mr-2 text-blue-500"></i>
                Porudzbina {indentCode}
            </h3>
            <div className="overflow-x-auto">
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
            <div className="overflow-x-auto">
                <textarea
                    className="block w-full px-4 py-2 mt-1 border rounded-lg text-gray-700 bg-gray-50 border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Napomena..."
                    value={comment}
                    readOnly
                />

                <br />
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <strong className="text-lg text-gray-700">Ukupna Cena :</strong>
                            <span className="text-lg text-gray-900 font-bold">{formatNumber(totalCost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <strong className="text-lg text-gray-700">Ukupno Paketa :</strong>
                            <span className="text-lg text-gray-900 font-bold">{totalNumberOfPackages}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <strong className="text-lg text-gray-700">Ukupna Težina :</strong>
                            <span className="text-lg text-gray-900 font-bold">{formatNumberKG(totalWeight)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndentEntries;