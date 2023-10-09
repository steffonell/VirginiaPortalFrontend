import React, { useState } from "react";
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
    const [selectedYear, setSelectedYear] = useState(Object.keys(testData)[0]);
    const [compareYears, setCompareYears] = useState(false);

    const getChartData = () => {
        if (compareYears) {
            return Object.keys(testData).map(year => ({
                year,
                Kvantitet: Object.values(testData[year]).reduce((sum, { Kvantitet }) => sum + Kvantitet, 0),
                Cena: Object.values(testData[year]).reduce((sum, { Cena }) => sum + Cena, 0),
            }));
        }
        const months = Object.keys(testData[selectedYear]);
        return months.map(month => ({
            month,
            Kvantitet: testData[selectedYear][month].Kvantitet,
            Cena: testData[selectedYear][month].Cena,
        }));
    };

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
                    {Object.keys(testData).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </label>
            <div className="grid grid-cols-12 gap-4">
                {Object.entries(testData[selectedYear]).map(([month, { Kvantitet, Cena }]) => (
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
