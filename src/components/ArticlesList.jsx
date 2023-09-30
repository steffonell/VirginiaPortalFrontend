import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import ArticleDataService from '../services/ArticleService';
import { useNavigate, Link } from "react-router-dom"; 
import 'tailwindcss/tailwind.css';

const ArticleTable = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    retrieveArticles();
  }, []);

  const retrieveArticles = () => {
    ArticleDataService.getAll()
      .then((response) => {
        setArticles(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article =>
      article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: 'Šifra Artikla',
        accessor: 'code',
      },
      {
        Header: 'GTIN',
        accessor: 'barcode',
      },
      {
        Header: 'Naziv',
        accessor: 'name',
      },
      {
        Header: 'Jedinica Mere',
        accessor: 'unitOfMeasurement',
      },
      {
        Header: 'Brend',
        accessor: 'brand.brandName',
      },
      {
        Header: 'Fakturna Cena',
        accessor: 'wholesalePrice',
        Cell: ({ value }) => (
          <span>{Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
        ),
      },
      {
        Header: 'Stopa PDV-a',
        accessor: 'pdv',
        Cell: ({ value }) => <span>{value}%</span>,
      },
      {
        Header: 'Broj Komada U Paketu',
        accessor: 'quantityPerTransportPackage',
      },
      {
        Header: 'Minimum Za Trebovanje',
        accessor: 'minimumQuantityDemand',
      },
      {
        Header: 'Bruto Težina Proizvoda (KG)',
        accessor: 'brutoMass',
        Cell: ({ cell: { value } }) => {
          return value + " KG";
        },
      },
      {
        Header: 'Slika',
        accessor: 'imageSource',
      },
      {
        Header: 'Maloprodajna Cena',
        accessor: 'retailPrice',
        Cell: ({ value }) => (
          <span>{Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
        ),
      },
      {
        Header: 'Akcije',
        accessor: 'actions',
        Cell: () => (
          <div className="flex space-x-2">
            <button className="px-2 py-1 bg-blue-500 text-white rounded">Izmeni</button>
            <button className="px-2 py-1 bg-yellow-500 text-white rounded">Deaktiviraj</button>
            <button className="px-2 py-1 bg-green-500 text-white rounded">Aktiviraj</button>
          </div>
        ),
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
  } = useTable({ columns, data: filteredArticles });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Unesite naziv artikla radi pretrage..."
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-4 py-2 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-4 py-2 border-b border-gray-300 text-sm leading-5 text-gray-900">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4">
                <Link
                    to="/articles/add"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-green py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
                >
                    Dodaj Artikal
                </Link>
            </div>
      </div>
    </div>
  );
};

export default ArticleTable;
