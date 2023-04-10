import React, { useState, useEffect, useMemo, useRef } from "react";
import IndentDataService from "../services/IndentService";
import { useTable } from "react-table";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import logo from './../images/logo.jpg';

const IndentsList = (props) => {
    const [indents, setIndents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const indentsRef = useRef();
    const navigate = useNavigate();
    indentsRef.current = indents;

    useEffect(() => {
        retrieveIndents();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const retrieveIndents = () => {
        IndentDataService.getAll()
            .then((response) => {
                setIndents(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveIndents();
    };

    const removeAllIndents = () => {
        IndentDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        IndentDataService.findByName(searchName)
            .then((response) => {
                setIndents(JSON.stringify(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const editIndent = (rowIndex) => {
        console.log("pressed");
        const id = indentsRef.current[rowIndex].id;
        console.log(id);
        <Link to={`/indents/${id}`} />
    };

    const deleteIndent = (rowIndex) => {
        const id = indentsRef.current[rowIndex].id;

        IndentDataService.remove(id)
            .then((response) => {
                <Navigate to="/indents" replace={true} />
                let newIndents = [...indentsRef.current];
                newIndents.splice(rowIndex, 1);

                setIndents(newIndents);
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const activateIndent = (rowIndex) => {
        const selectedIndent = indentsRef.current[rowIndex];
        const code = selectedIndent.code;
      
        if (selectedIndent.indentStatus !== "ACTIVATED") {
          selectedIndent.indentStatus = "ACTIVATED";
      
          IndentDataService.activateIndent(selectedIndent)
            .then(() => {
              const newIndents = [...indentsRef.current];
              newIndents[rowIndex] = selectedIndent;
              setIndents(newIndents);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      };
      
      

    const viewIndent = (rowIndex) => {
        const indentCode = indentsRef.current[rowIndex].code;
        console.log("navigate");
        navigate(`/indents/entries/${indentCode}`);
      };


    const columns = useMemo(
        () => [
            {
                Header: "ID Porudzbenice",
                accessor: "code",
            },
            {
                Header: "Klijent",
                accessor: "customer.nameOfTheLegalEntity",
            },
            {
                Header: "Status Porudzbenice",
                accessor: "indentStatus",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div className="d-flex justify-content-between max-width-500">
                            <span onClick={() => editIndent(rowIdx)} className="btn btn-secondary disabled mx-1">
                                <i className="far fa-edit mr-2"></i> Izmeni
                            </span>

                            <span onClick={() => deleteIndent(rowIdx)} className="btn btn-danger mx-1">
                                <i className="fas fa-trash"></i> Izbrisi
                            </span>

                            {props.row.indentStatus !== "ACTIVATED" ? (
                                <span onClick={() => activateIndent(rowIdx)} className="btn btn-primary mx-1">
                                    <i className="fas fa-check"></i> Aktiviraj
                                </span>
                            ) : null}

                            <button onClick={() => viewIndent(rowIdx)} className="btn btn-primary mx-1">
                                <i className="far fa-eye mr-2"></i> Pregled
                            </button>
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
        data: indents,
    });

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Search
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
                <a href="/indents/add" className="btn btn-sm btn-primary">Add Indent</a>
            </div>
            <div className="col-md-8">
                <button className="btn btn-sm btn-danger" onClick={removeAllIndents}>
                    Remove All
                </button>
            </div>
        </div>
    );
};

{/* <img src={cell.value} alt="Indent" /> */ }

export default IndentsList;