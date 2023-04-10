import React from "react";

const ArticleTable = ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    openArticle,
    deleteArticle,
    logo,
}) => (
    <table className="table table-striped table-bordered" {...getTableProps()}>
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
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>
                                {cell.column.id === "imageSource" ? (
                                    <img src={logo} alt="Logo" />
                                ) : (
                                    cell.render("Cell")
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    </table>
);

export default ArticleTable;