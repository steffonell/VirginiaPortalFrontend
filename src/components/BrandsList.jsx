import React, { useState, useEffect, useMemo, useRef } from "react";
import BrandDataService from "../services/BrandService";
import { useTable } from "react-table";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandsList = () => {
    const [modalFormBrandVisible, setModalFormBrandVisible] = useState(false);
    const [brands, setBrands] = useState([]);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchName, setSearchName] = useState("");
    const brandsRef = useRef();

    brandsRef.current = brands;

    useEffect(() => {
        retrieveBrands();
    }, []);

    const retrieveBrands = () => {
        BrandDataService.getAll()
            .then((response) => {
                setBrands(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onChangeSearchName = (e) => {
        setSearchName(e.target.value);
    };

    const findByName = () => {
        BrandDataService.findByName(searchName)
            .then((response) => {
                setBrands(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deleteBrand = (rowIndex) => {
        /*         const id = brandsRef.current[rowIndex].id;
        
                BrandDataService.remove(id)
                    .then(() => {
                        let newBrands = [...brandsRef.current];
                        newBrands.splice(rowIndex, 1);
                        setBrands(newBrands);
                    })
                    .catch((e) => {
                        console.log(e);
                    }); */
    };

    const editBrand = (rowIndex) => {
        const brand = brandsRef.current[rowIndex];
        setEditingBrand(brand);
        setModalFormBrandVisible(true);
    };

    const brandValidationSchema = Yup.object().shape({
        brandName: Yup.string().required('Morate uneti naziv brenda.'),
    });

    const brandFormik = useFormik({
        initialValues: {
            brandName: editingBrand ? editingBrand.brandName : '',
        },
        validationSchema: brandValidationSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (editingBrand) {
                const id = editingBrand.brand_id;
                BrandDataService.update(id, values)
                    .then(() => {
                        toast.success('Brend uspešno izmenjen!');
                        retrieveBrands();
                    })
                    .catch(e => {
                        console.log(e);
                        toast.error('Došlo je do greške.');
                    });
            } else {
                // Add new brand logic here if needed
            }
            setModalFormBrandVisible(false);
            resetForm();
            setEditingBrand(null);
        },
    });

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
                            <span onClick={() => editBrand(rowIdx)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

{/*                             <span onClick={() => deleteBrand(rowIdx)}>
                                <i className="fas fa-trash action"></i>
                            </span> */}
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
            <br />
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
                <Link to="/brands/add" className="btn btn-sm btn-primary">Dodaj Brend</Link>
            </div>
            {modalFormBrandVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
                        <span className="close absolute top-4 right-4 text-gray-700 hover:text-gray-900 cursor-pointer" onClick={() => { setModalFormBrandVisible(false); setEditingBrand(null); }}>
                            &times;
                        </span>
                        <form onSubmit={brandFormik.handleSubmit} className="submit-form">
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Novi Naziv Brenda:
                                </label>
                                <input
                                    type="text"
                                    name="brandName"
                                    id="brandName"
                                    value={brandFormik.values.brandName}
                                    onChange={brandFormik.handleChange}
                                    onBlur={brandFormik.handleBlur}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {brandFormik.touched.brandName && brandFormik.errors.brandName ? (
                                    <div className="error-message text-red-500 text-xs italic">{brandFormik.errors.brandName}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Izmenite Naziv Brenda
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandsList;
