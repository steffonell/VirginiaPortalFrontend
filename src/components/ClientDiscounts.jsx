import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import DiscountService from "../services/DiscountService";
import CustomerService from "../services/CustomerService";
import BrandService from "../services/BrandService"; // Assuming this exists
import { useTable } from "react-table";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientDiscounts = () => {
    const location = useLocation();
    const { clientID } = location.state || {};
    const [customer, setCustomer] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [modalFormBrandDiscountVisible, setModalFormBrandDiscountVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const addedBrandNames = new Set(discounts.map(d => d.brand.brandName));

    useEffect(() => {
        fetchClientDiscounts();
        retrieveBrands();
        retreiveClient(clientID);
    }, [clientID]);

    const editDiscountRef = useRef(null);

    useEffect(() => {
        editDiscountRef.current = (brandName) => {
            if (!discounts.length) {
                return; // or do something else if discounts are not loaded
            }
            console.log(brandName + "--Brend");
            console.log(discounts);
            const discount = discounts.find(d => d.brand.brandName === brandName);
            console.log(discount + "--Popust");
            openEditModal(discount);
        };
    }, [discounts]);

    const retreiveClient = (id) => {
        CustomerService.get(id)
            .then(response => {
                setCustomer(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const fetchClientDiscounts = async () => {
        try {
            const response = await DiscountService.findDiscountsOfSpecificClient(clientID);
            if (response) {
                console.log('Component Response:', response); // Added for debugging
                setDiscounts(response);
            } else {
                console.log('No response received from the service.');
            }
        } catch (error) {
            console.error('An error occurred while fetching client discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (discount) => {
        setSelectedDiscount(discount);
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setSelectedDiscount(null);
        setEditModalVisible(false);
    };

    const editDiscount = (brandName) => {
        // Then use it like this
        editDiscountRef.current(brandName);
    };

    const deleteDiscount = async (brandName) => {
        console.log(brandName + "********");
        if (window.confirm("Da li ste sigurni da želite da uklonite ovaj rabat?")) {
            await DiscountService.deleteCustomerDiscount(clientID, brandName, 0);
            await fetchClientDiscounts();
        }
    };

    const retrieveBrands = () => {
        BrandService.getAll()
            .then(response => {
                setBrands(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const brandValidationSchema = Yup.object().shape({
        selectedBrand: Yup.string().required('Morate izabrati brend radi unosa rabata.'),
        brandDiscount: Yup.string()
            .matches(/^[0-9]+$/, 'Polje "Rabat Brenda" mora sadržati samo brojeve.')
            .required('Polje "Rabat Brenda" je obavezno.'),
    });

    const editFormik = useFormik({
        initialValues: {
            selectedBrand: selectedDiscount ? selectedDiscount.brand.brandName : '',
            brandDiscount: selectedDiscount ? selectedDiscount.discount : '',
        },
        validationSchema: brandValidationSchema,
        enableReinitialize: true,  // this makes formik reset initialValues when they change
        onSubmit: async (values) => {
            try {
                const selectedBrand = brands.find(brand => brand.brandName === values.selectedBrand);
                if (selectedBrand) {
                    await DiscountService.updateCustomerDiscount(clientID, selectedBrand.brandName, values.brandDiscount);
                    fetchClientDiscounts();
                    setEditModalVisible(false);
                    toast.success('Uspešna izmena rabata brenda ' + selectedBrand.brandName + ' !');
                } else {
                    toast.error('Izabrani brend nije pronadjen u listi brendova.');
                }
            } catch (error) {
                toast.error('Greška prilikom ažuriranja:', error);
            }
        },
    });

    const brandFormik = useFormik({
        initialValues: {
            selectedBrand: '',
            brandDiscount: '',
        },
        validationSchema: brandValidationSchema,
        onSubmit: async (values) => {
            try {
                const selectedBrand = brands.find(brand => brand.brandName === values.selectedBrand);
                if (selectedBrand) {
                    await DiscountService.createCustomerDiscount(clientID, selectedBrand.brandName, values.brandDiscount);
                    fetchClientDiscounts();
                    setModalFormBrandDiscountVisible(false);
                    toast.success('Uspešno dodavanje rabata za brend ' + selectedBrand.brandName + ' !');
                } else {
                    console.error('Izabrani brend nije pronadjen u listi brendova.');
                }
            } catch (error) {
                console.error('Greška prilikom dodavanja:', error);
            }
        },
    });

    const openModal = () => {
        brandFormik.resetForm();
        brandFormik.setValues({
            selectedBrand: '',
            brandDiscount: '',
        });
        setModalFormBrandDiscountVisible(true);
    };

    const columns = useMemo(
        () => [
            {
                Header: "Brend",
                accessor: "brand.brandName",
            },
            {
                Header: "Rabat",
                accessor: "discount",
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const brand = props.row.original.brand;  // Use original to get the row data
                    const brandName = brand ? brand.brandName : 'N/A';

                    return (
                        <div>
                            <span onClick={() => brand && editDiscount(brandName)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

                            <span onClick={() => brand && deleteDiscount(brandName)}>
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
        data: discounts,
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="list row">
            <div className="col-md-12 list">
                <h3>Rabati Klijenta:  <strong style={{ textDecoration: 'underline' }}>{customer.nameOfTheLegalEntity}</strong></h3>
                <div className="overflow-x-auto">
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
                                    <tr {...row.getRowProps()} key={i}>
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
            </div>

            <div className="col-md-4">
                <button className="btn btn-sm btn-primary" onClick={openModal}>Dodaj Rabat</button>
            </div>

            {modalFormBrandDiscountVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalFormBrandDiscountVisible(false)}>
                            &times;
                        </span>
                        <form onSubmit={brandFormik.handleSubmit} className="submit-form">
                            <div className="form-group">
                                <label>
                                    Izaberite Brend:
                                    <select
                                        name="selectedBrand"
                                        value={brandFormik.values.selectedBrand}
                                        onChange={brandFormik.handleChange}
                                    >
                                        <option key="0" value="">
                                            Izaberite Brend
                                        </option>
                                        {brands.filter(brand => !addedBrandNames.has(brand.brandName)).map((brand, index) => (
                                            <option key={index + 1} value={brand.brandName}>
                                                {brand.brandName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    Rabat Brenda (%) :
                                    <input
                                        type="text"
                                        name="brandDiscount"
                                        value={brandFormik.values.brandDiscount}
                                        onChange={brandFormik.handleChange}
                                    />
                                </label>
                            </div>
                            <button type="submit">Unesite Rabat</button>
                        </form>
                    </div>
                </div>
            )}

            {editModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditModal}>
                            &times;
                        </span>
                        <form onSubmit={editFormik.handleSubmit} className="submit-form">
                            <div className="form-group">
                                <label>
                                    Izaberite Brend:
                                    <select
                                        name="selectedBrand"
                                        value={editFormik.values.selectedBrand}
                                        onChange={editFormik.handleChange}
                                    >
                                        <option key="0" value="">
                                            Izaberite Brend
                                        </option>
                                        {brands.map((brand, index) => (
                                            <option key={index + 1} value={brand.brandName}>
                                                {brand.brandName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    Rabat Brenda (%) :
                                    <input
                                        type="text"
                                        name="brandDiscount"
                                        value={editFormik.values.brandDiscount}
                                        onChange={editFormik.handleChange}
                                    />
                                </label>
                            </div>
                            <button type="submit">Ažurirajte Rabat</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDiscounts;
