import { Link } from "react-router-dom";
import { StockInterface } from "../interfaces";
import "./ListStocks.css";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";

interface ListStocksProps {
  filterStocks: StockInterface[]; // Cambiado el tipo de filterStocks
  symbol: string;
  name: string;
}

const stocksPerPage = 25;
const ListStocks: React.FC<ListStocksProps> = ({
  filterStocks,
  name,
  symbol,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [name, symbol]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * stocksPerPage;

  const currentData = filterStocks.slice(
    startIndex,
    startIndex + stocksPerPage
  );

  return (
    <div className="list-stocks-container">
      <table>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Nombre</th>
            <th>Moneda</th>
            <th>Tipo</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((stock: StockInterface) => (
            <tr key={`${stock.symbol}+${stock.mic_code}`}>
              <td>
                <Link to={`/stock-detail/${stock.symbol}/${stock.mic_code}`}>
                  {stock.symbol}
                </Link>
              </td>
              <td>{stock.name}</td>
              <td>{stock.currency}</td>
              <td>{stock.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentData.length ? (
        <ReactPaginate
          pageCount={Math.ceil(filterStocks.length / stocksPerPage)}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      ) : (
        <div className="no-data-message">
          No hay datos que correspondan con la búsqueda
        </div>
      )}
    </div>
  );
};
export default ListStocks;
