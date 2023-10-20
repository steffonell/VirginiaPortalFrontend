import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams } from 'react-router-dom';
import { ApplicationContext } from "./ApplicationContext";
import IndentDataService from '../services/IndentService';
import IndentEntryDataService from '../services/IndentEntryService';
import { useTable } from "react-table";
import logo from './../images/logo.jpg';

const IndentEntries = () => {
    const { code: indentCode } = useParams();
    const [entries, setEntries] = useState([]);
    const { loggedInClient } = useContext(ApplicationContext);

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

    const brandDiscount = (brand) => {
        const brandName = brand.brandName;
        const discountForTheBrand = loggedInClient?.discounts?.find((item) => item.brand.brandName === brandName);
        if (discountForTheBrand) {
            return discountForTheBrand.discount;
        } else {
            return 0;
        }
    };

    const formatNumber = (number) => {
        return <span>{Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
    }

    const formatNumberKG = (number) => {
        return <span>{Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} KG</span>
    }


    const articlePriceWithDiscount = (article) => {
        return (Number(article.retailPrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
    }

    const discountedPrice = (price, discount) => {
        return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
    }

    const priceWithPDV = (price, discount) => {
        return (Number(price) * (1 + Number(discount / 100)).toFixed(2));
    }

    const firstEntry = entries && entries.length > 0 ? entries[0] : null;

    const comment = firstEntry ? firstEntry.indent.comment : "";

    const totalCost = entries
        ? entries.reduce((acc, item) => acc + articlePriceWithDiscount(item.article) * item.requestedQuantity, 0)
        : 0;

    const totalWeight = entries
        ? entries.reduce((acc, item, index) => {
            const brutoMass = parseFloat(item.article.brutoMass);
            const requestedQuantity = parseFloat(item.requestedQuantity);
            if (isNaN(brutoMass) || isNaN(requestedQuantity)) {
                return acc;
            }
            const newAcc = acc + brutoMass * requestedQuantity;
            return newAcc;
        }, 0)
        : 0;

    const totalNumberOfPackages = entries
        ? entries.reduce((acc, item, index) => {
            const quantityPerTransportPackage = item.article.quantityPerTransportPackage;
            const requestedQuantity = parseFloat(item.requestedQuantity);
            if (isNaN(quantityPerTransportPackage) || isNaN(requestedQuantity)) {
                return acc;
            }
            const newAcc = acc + requestedQuantity / quantityPerTransportPackage;
            return newAcc;
        }, 0)
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
                Header: "Rabat",
                accessor: "discount",
                Cell: (props) => {
                    const brand = props.row.original.article.brand;
                    return `${brandDiscount(brand)} %`;
                },
            },
            {
                Header: "Ukupna Cena",
                accessor: "price",
                Cell: (props) => {
                    const article = props.row.original.article;
                    const articleWholesalePrice = article.wholesalePrice;
                    const discount = brandDiscount(article.brand);
                    const quantity = props.row.original.requestedQuantity;
                    const pdv = article.pdv;
                    return formatNumber(priceWithPDV(discountedPrice(articleWholesalePrice, discount), pdv) * quantity);
                },
            },            
            {
                Header: "Broj Paketa",
                accessor: "numberOfPackages",
                Cell: (props) => {
                    const quantity = props.row.original.requestedQuantity;
                    const quantityPerTransportPackage = props.row.original.article.quantityPerTransportPackage;
                    return quantity / quantityPerTransportPackage;
                },
            },
            {
                Header: "Težina",
                accessor: "weight",
                Cell: (props) => {
                    const brutoMass = props.row.original.article.brutoMass;
                    const quantity = props.row.original.requestedQuantity;
                    return formatNumberKG(brutoMass * quantity);
                },
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
                        <h3 className="flex items-center text-2xl font-semibold text-gray-700">
                <i className="fas fa-shopping-cart mr-2 text-blue-500"></i>
                Porudzbina {indentCode}
            </h3>
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
