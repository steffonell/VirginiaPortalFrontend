import React, { useState } from "react";

const formatedNumber = (number) => {
    return (Number(number)).toFixed(2);
};

const DataTable = ({ data }) => {
    const [sortOrder, setSortOrder] = useState("asc");

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "desc" ? "desc" : "asc");
    };

    const getSortedData = () => {
        return [...data].sort((b, a) => {
            if (sortOrder === "asc") {
                return a.Cena - b.Cena; // Assuming you want to sort by 'Kvantitet', adjust as needed
            }
            return b.Cena - a.Cena; // For descending order
        });
    };

    const sortedData = getSortedData();

    return (
        <table className="min-w-full leading-normal">
            <thead>
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Naziv
                    </th>
                    <th 
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={toggleSortOrder}
                    >
                        Poručen Kvantitet
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cena
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row, index) => (
                    <tr key={index}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {row.name}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {formatedNumber(row.Kvantitet)}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {formatedNumber(row.Cena)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
