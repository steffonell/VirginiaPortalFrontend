import React, { useState, useEffect, useContext } from "react";
import StatisticsService from "../services/StatisticsService";
import ArticleService from "../services/ArticleService";
import CustomerService from '../services/CustomerService';
import BrandService from '../services/BrandService';
import { ApplicationContext } from "./ApplicationContext";
import DataTable from "../components/StatisticsDataTable";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const StatisticsComponent = () => {
    const [apiData, setApiData] = useState(null);
    const [brands, setBrands] = useState([]);
    const [articles, setArticles] = useState([]);
    const [clients, setClients] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const { loggedInClient } = useContext(ApplicationContext);

    useEffect(() => {
        retrieveArticles();
        retrieveClients();
        retrieveYears();
        retrieveBrands();
    }, []);

    const retrieveArticles = () => {
        ArticleService.getAll()
            .then(response => {
                setArticles(response.data);
            })
            .catch(e => {
                console.log(e);
            });
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

    const retrieveClients = () => {
        CustomerService.getAll()
            .then(response => {
                setClients(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const retrieveYears = () => {
        StatisticsService.getYears()
            .then(response => {
                setYears(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    // Logging the states after data retrieval
    useEffect(() => {
        console.log('Brands:', brands);
        console.log('Articles:', articles);
        console.log('Clients:', clients);
        console.log('Years:', years);
    }, [brands, articles, clients, years]);

    /* Button methods */
    const orderedQuantityAndRevenueForChosenYearByMonths = async () => {
        const data = await StatisticsService.getOrderedQuantityAndRevenueForGivenYearByMonths(selectedYear);
        setApiData(data);
    }

    const compareYears = () => {
        const data = StatisticsService.getComparedYears();
        setApiData(data);
    }

    const compareAllClientsForChosenYear = async () => {
        const data = await StatisticsService.getCompareAllClientsForChosenYear(selectedYear);
        setApiData(data);
    }

    const compareAllBrandsForChosenYear = async () => {
        const data = await StatisticsService.getCompareAllBrandsForChosenYear(selectedYear);
        setApiData(data);
    }

    const orderedQuantityAndRevenueForChosenYearAndClientByMonths = async () => {
        const data = await StatisticsService.getOrderedQuantityAndRevenueForChosenYearAndClientByMonths(selectedYear, selectedCustomer);
        setApiData(data);
    }

    const orderedQuantityAndRevenueForChosenYearAndBrandByMonths = async () => {
        console.log("SELECTED BRAND : " + selectedBrand);
        const data = await StatisticsService.getOrderedQuantityAndRevenueForChosenYearAndBrandByMonths(selectedYear, selectedBrand);
        setApiData(data);
    }

    const orderedQuantityAndRevenueForChosenClientTotal = async () => {
        const data = await StatisticsService.getOrderedQuantityAndRevenueForClientTotal(selectedCustomer);
        setApiData(data);
    }

    const orderedQuantityForSelectedArticleTotal = async () => {
        const data = await StatisticsService.getOrderedQuantityForSelectedArticleTotal(selectedArticle);
        setApiData(data);
    }

    const orderedQuantityForSelectedArticleAndYear = async () => {
        console.log("SELECTED ARTICLE : " + selectedArticle);
        const data = await StatisticsService.getOrderedQuantityForSelectedArticleAndYear(selectedYear, selectedArticle);
        setApiData(data);
    }

    useEffect(() => {
        console.log('Updated apiData:', apiData);
    }, [apiData]);

    const getChartData = () => {
        if (!apiData) return [];
        let parsedData;
        try {
            parsedData = JSON.parse(apiData);
        } catch (e) {
            console.error("Error parsing apiData", e);
            return [];
        }

        return Object.keys(parsedData).map(name => {
            const { quantity, revenue } = parsedData[name];
            return {
                name: name,
                Kvantitet: Number(quantity).toFixed(2),
                Cena: Number(revenue).toFixed(2),
            };
        });
    };

    /*     // Assuming you know the range of your data, set a fixed domain
    const yAxisDomain = [0, 1000]; // Example fixed domain */

    // Define custom ticks for Y-axis
    const yAxisTicks = [0, 200, 400, 600, 800, 1000];

    const formatYAxisTick = (value) => {
        // Example formatter: formats thousands as 'K', millions as 'M'
        if (value >= 1000000) {
            return `${value / 1000000}M`;
        } else if (value >= 1000) {
            return `${value / 1000}K`;
        }
        return value;
    };

    const data = getChartData();

    // Calculate the maximum Y value for a dynamic range
    const maxYValue = data.reduce((max, item) => Math.max(max, item.Kvantitet, item.Cena), 0);
    const yAxisDomain = [0, 1000];

    return (
        <div className="overflow-x-auto">
            <div className="overflow-x-auto">
                <h4 className="text-lg font-bold mb-3">Statistički Panel</h4>
                <div className="flex divide-x divide-gray-200">
                    <div className="flex-1 p-4">
                        <div className="flex flex-col space-y-4">
                            {/* Each label-select pair is a flex item for better alignment */}
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold">Izaberite Brend:</label>
                                <select
                                    value={selectedBrand ? selectedBrand.brand_id : ''}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        console.log("Selected ID:", selectedId); // Debug log

                                        if (selectedId) {
                                            // Convert selectedId to the same type as your article.id
                                            const foundBrand = brands.find(brand => brand.brand_id === Number(selectedId));
                                            console.log("Found Brand:", foundBrand); // Debug log
                                            setSelectedBrand(foundBrand);
                                        } else {
                                            setSelectedBrand(null);
                                        }
                                    }}
                                    className="border border-gray-300 rounded p-2"
                                >
                                    <option key="0" value=""></option>
                                    {brands.map((brand, index) => (
                                        <option key={index + 1} value={brand.brand_id}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold">Izaberite Artikal:</label>
                                <select
                                    value={selectedArticle ? selectedArticle.article_id : ''}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        console.log("Selected ID:", selectedId); // Debug log

                                        if (selectedId) {
                                            // Convert selectedId to the same type as your article.id
                                            const foundArticle = articles.find(article => article.article_id === Number(selectedId));
                                            console.log("Found Article:", foundArticle); // Debug log
                                            setSelectedArticle(foundArticle);
                                        } else {
                                            setSelectedArticle(null);
                                        }
                                    }}
                                    className="border border-gray-300 rounded p-2"
                                >
                                    <option key="0" value=""></option>
                                    {articles.map((article, index) => (
                                        <option key={index + 1} value={article.article_id}>
                                            {article.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold">Izaberite Klijenta:</label>
                                <select
                                    value={selectedCustomer ? selectedCustomer.customer_id : ''}  // Assuming each customer has a unique 'id' property
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        console.log("Selected ID:", selectedId); // Debug log

                                        if (selectedId) {
                                            // Convert selectedId to the same type as your customer.id
                                            const foundCustomer = clients.find(client => client.customer_id === Number(selectedId));
                                            console.log("Found Customer:", foundCustomer); // Debug log
                                            setSelectedCustomer(foundCustomer);
                                        } else {
                                            setSelectedCustomer(null);
                                        }
                                    }}
                                    className="border border-gray-300 rounded p-2"
                                >
                                    <option key="0" value=""></option>
                                    {clients.map((client, index) => (
                                        <option key={index + 1} value={client.customer_id}>  {/* Assuming each client has an 'id' property */}
                                            {client.nameOfTheLegalEntity}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold">Izaberite Godinu:</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="border border-gray-300 rounded p-2"
                                >
                                    <option key="0" value="">

                                    </option>
                                    {years.map((year, index) => {
                                        return (
                                            <option key={index + 1} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={orderedQuantityAndRevenueForChosenYearByMonths}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${!selectedYear ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedYear}
                            >
                                Poručen Kvanitet I Prihodi Za Izabranu Godinu Po Mesecima
                            </button>
                            {/*                             <button
                                onClick={() => compareYears}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            >
                                Uporedite godine
                            </button> */}
                            <button
                                onClick={compareAllClientsForChosenYear}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${!selectedYear ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedYear}
                            >
                                Uporedite Sve Klijente Za Izabranu Godinu
                            </button>
                            <button
                                onClick={orderedQuantityAndRevenueForChosenYearAndClientByMonths}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${(!selectedYear || !selectedCustomer) ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedYear || !selectedCustomer}
                            >
                                Poručen Kvanitet I Prihodi Za Izabranu Godinu I Klijenta Po Mesecima
                            </button>
                            <button
                                onClick={orderedQuantityAndRevenueForChosenClientTotal}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${!selectedCustomer ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedCustomer}
                            >
                                Poručen Kvanitet I Prihodi Za Izabranog Klijenta Ukupno
                            </button>
                            <button
                                onClick={orderedQuantityForSelectedArticleTotal}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${!selectedArticle ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedArticle}
                            >
                                Poručen Kvanitet Za Izabrani Artikal Ukupno
                            </button>
                            <button
                                onClick={orderedQuantityForSelectedArticleAndYear}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${(!selectedArticle || !selectedYear) ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedArticle || !selectedYear}
                            >
                                Poručen Kvanitet Za Izabrani Artikal I Godinu Po Mesecima
                            </button>
                            <button
                                onClick={orderedQuantityAndRevenueForChosenYearAndBrandByMonths}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${(!selectedYear || !selectedBrand) ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedYear || !selectedBrand}
                            >
                                Poručen Kvanitet I Prihodi Za Izabranu Godinu I Brend Po Mesecima
                            </button>
                            <button
                                onClick={compareAllBrandsForChosenYear}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${!selectedYear ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={!selectedYear}
                            >
                                Uporedite Sve Brendove Za Izabranu Godinu
                            </button>
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={yAxisDomain} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Kvantitet" fill="#8884d8" />
                <Bar dataKey="Cena" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
                <div className="mt-4">
                    <DataTable data={data} />
                </div>
            </div>
            {/*             <h3 className="text-xl font-bold mb-4">Statistika</h3>
            <div className="grid grid-cols-12 gap-4">
                {apiData && selectedYear && Object.entries(apiData[selectedYear]).map(([month, { Kvantitet, Cena }]) => (
                    <div key={month} className="col-span-4 bg-gray-100 p-4 rounded border border-gray-300">
                        <h4 className="text-lg font-semibold mb-2">{month}</h4>
                        <p>Naručena količina: {Kvantitet}</p>
                        <p>Potrošeni novac: {Cena} RSD</p>
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default StatisticsComponent;
