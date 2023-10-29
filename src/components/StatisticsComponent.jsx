import React, { useState, useEffect,useContext  } from "react";
import StatisticsService from "../services/StatisticsService";
import { ApplicationContext } from "./ApplicationContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const testData = {
    2022: {
        Januar: { Kvantitet: 100, Cena: 2000 },
        Februar: { Kvantitet: 150, Cena: 3000 },
        Mart: { Kvantitet: 200, Cena: 4000 },
        April: { Kvantitet: 250, Cena: 5000 },
        Maj: { Kvantitet: 300, Cena: 6000 },
        Jun: { Kvantitet: 350, Cena: 7000 },
        Jul: { Kvantitet: 400, Cena: 8000 },
        Avgust: { Kvantitet: 450, Cena: 9000 },
        Septembar: { Kvantitet: 500, Cena: 10000 },
        Oktobar: { Kvantitet: 550, Cena: 11000 },
        Novembar: { Kvantitet: 600, Cena: 12000 },
        Decembar: { Kvantitet: 650, Cena: 13000 }
    },
    2023: {
        Januar: { Kvantitet: 200, Cena: 4000 },
        Februar: { Kvantitet: 250, Cena: 5000 },
        Mart: { Kvantitet: 300, Cena: 6000 },
        April: { Kvantitet: 350, Cena: 7000 },
        Maj: { Kvantitet: 400, Cena: 8000 },
        Jun: { Kvantitet: 450, Cena: 9000 },
        Jul: { Kvantitet: 500, Cena: 10000 },
        Avgust: { Kvantitet: 550, Cena: 11000 },
        Septembar: { Kvantitet: 600, Cena: 12000 },
        Oktobar: { Kvantitet: 650, Cena: 13000 },
        Novembar: { Kvantitet: 700, Cena: 14000 },
        Decembar: { Kvantitet: 750, Cena: 15000 }
    }
};

const StatisticsComponent = () => {
    const [apiData, setApiData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [compareYears, setCompareYears] = useState(false);
    const { loggedInClient} = useContext(ApplicationContext);

    useEffect(() => {
        StatisticsService.getAll()
            .then(response => {
                const actualData = response.data;  // Access the nested data property
                console.log(actualData);  // Log the actual data array to confirm
                const formattedData = formatAPIData(actualData);  // Pass the actual data array to formatAPIData
                setApiData(formattedData);
                if (formattedData) {
                    setSelectedYear(Object.keys(formattedData)[0]);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);



    const getChartData = () => {
        if (!apiData || !selectedYear) return [];
        if (compareYears) {
            return Object.keys(apiData).map(year => ({
                year,
                Kvantitet: Object.values(apiData[year]).reduce((sum, { Kvantitet }) => sum + Kvantitet, 0),
                Cena: Object.values(apiData[year]).reduce((sum, { Cena }) => sum + Cena, 0),
            }));
        }
        const months = Object.keys(apiData[selectedYear]);
        return months.map(month => ({
            month,
            Kvantitet: apiData[selectedYear][month].Kvantitet,
            Cena: apiData[selectedYear][month].Cena,
        }));
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

    const discountedPrice = (price, discount) => {
        return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
    }

    const formatAPIData = (data) => {
        const formattedData = {};
        data.forEach(entry => {
            // Check if indent is defined
            if (!entry.indent) {
                console.error('Undefined indent:', entry);
                return;  // Skip this entry and continue with the next
            }
            // Check if creationTime is defined within indent
            if (!entry.indent.creationTime) {
                console.error('Undefined creationTime:', entry.indent);
                return;  // Skip this entry and continue with the next
            }

            // Split the creationTime into parts
            const dateParts = entry.indent.creationTime.split('-');
            const year = dateParts[0];
            const month = dateParts[1];
            // Convert month number to month name
            const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

            // Initialize year object if not already defined
            if (!formattedData[year]) formattedData[year] = {};
            // Initialize month object within year if not already defined
            if (!formattedData[year][monthName]) formattedData[year][monthName] = { Kvantitet: 0, Cena: 0 };

            // Update quantity and price for the given month
            formattedData[year][monthName].Kvantitet += entry.requestedQuantity;
            const finalPriceWithDiscountForCustomer = discountedPrice(entry.article.wholesalePrice, brandDiscount(entry.article.brand)).toFixed(2);
            formattedData[year][monthName].Cena += entry.requestedQuantity * finalPriceWithDiscountForCustomer;  // using retailPrice as the price
        });
        return formattedData;
    }



    const data = getChartData();

    return (
        <div className="p-4">
            <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Grafikon Test Implementacija</h4>
                <button
                    onClick={() => setCompareYears(!compareYears)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {compareYears ? 'Prikaži mesečne podatke' : 'Uporedite godine'}
                </button>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={compareYears ? 'year' : 'month'} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Kvantitet" fill="#8884d8" />
                        <Bar dataKey="Cena" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <h3 className="text-xl font-bold mb-4">Statistika</h3>
            <label className="block mb-4">
                Izaberite godinu:
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="ml-2 border border-gray-300 rounded"
                >
                    {apiData && Object.keys(apiData).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </label>
            <div className="grid grid-cols-12 gap-4">
                {apiData && selectedYear && Object.entries(apiData[selectedYear]).map(([month, { Kvantitet, Cena }]) => (
                    <div key={month} className="col-span-4 bg-gray-100 p-4 rounded border border-gray-300">
                        <h4 className="text-lg font-semibold mb-2">{month}</h4>
                        <p>Naručena količina: {Kvantitet}</p>
                        <p>Potrošeni novac: {Cena} RSD</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatisticsComponent;
