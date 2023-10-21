import React, { useState, useEffect, useMemo, useRef } from "react";
import BrandDataService from "../services/BrandService";
import { useTable } from "react-table";
import { Navigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

const BrandsList = (props) => {
    const [brands, setBrands] = useState([]);
    const [searchName, setSearchName] = useState("");
    const brandsRef = useRef();

    brandsRef.current = brands;

    useEffect(() => {
        retrieveBrands();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const retrieveBrands = () => {
        BrandDataService.getAll()
            .then((response) => {
                setBrands(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        BrandDataService.findByName(searchName)
            .then((response) => {
                setBrands(JSON.stringify(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const openBrand = (rowIndex) => {
        console.log("pressed");
        const id = brandsRef.current[rowIndex].id;
        console.log(id);
        <Link to={`/brands/${id}`} />
    };

    const deleteBrand = (rowIndex) => {
        const id = brandsRef.current[rowIndex].id;

        BrandDataService.remove(id)
            .then((response) => {
                <Navigate to="/brands" replace={true} />

                let newBrands = [...brandsRef.current];
                newBrands.splice(rowIndex, 1);

                setBrands(newBrands);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const columns = useMemo(
        () => [
            {
                Header: "Ime Brenda",
                accessor: "brandName",
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <span onClick={() => openBrand(rowIdx)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

                            <span onClick={() => deleteBrand(rowIdx)}>
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
        data: brands,
    });

    return (
        <div className="overflow-x-auto">
            <br/>
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ime Brenda"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Pretraga
                        </button>
                    </div>
                </div>
            </div>
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
                <a href="/brands/add" className="btn btn-sm btn-primary">Dodaj Brend</a>
            </div>
        </div>
    );
};

export default BrandsList;