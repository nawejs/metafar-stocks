import { BrowserRouter, Route, Routes } from "react-router-dom";
import StocksPage from "./pages/StocksPage";
import StockDetail from "./pages/StockDetail";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StocksPage />} />
        <Route
          path="/stock-detail/:symbol/:mic_code"
          element={<StockDetail />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
