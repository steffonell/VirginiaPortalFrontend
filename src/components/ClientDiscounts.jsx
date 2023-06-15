import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';

const ClientDiscounts = () => {
    const { client: client } = useParams();
    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        fetchClientDiscounts();
    }, [indentCode]);

    const fetchClientDiscounts = async () => {
        const response = await DiscountService.findClientsDiscounts(client.customer_id);
        setDiscounts(response.data);
    };

    const columns = useMemo(
        () => [
            {
                Header: "Brend",
                accessor: "brandName",
            },
            {
                Header: "Rabat",
                accessor: "discount",
            },
            {
                Header: "Akcije",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <span onClick={() => editDiscount(rowIdx)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

                            <span onClick={() => deleteDiscount(rowIdx)}>
                                <i className="fas fa-trash action"></i>
                            </span>
                        </div>
                    );
                },
            },
        ],
        []
    );

}