import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import AuthRout from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';

import CategoryPage  from './components/CategoryPage';
import ColorPage from './components/ColorPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import TablePage from './components/TablePage';
import  BasketPage  from './components/BasketPage';
import  Status1Page  from './components/Status1Page';
import  Status2Page  from './components/Status2Page';
import  Status3Page  from './components/Status3Page';
import  Status4Page  from './components/Status4Page';
import ProductPage from './components/ProductPage'


function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRout />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path = '/home' element={<HomePage />} />

        <Route path="/color" element={<ColorPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/history" element={<OrderHistoryPage />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/basket" element={<BasketPage />} />

        <Route path="/status1" element={<Status1Page/>} />
        <Route path="/status2" element={<Status2Page/>} />
        <Route path="/status3" element={<Status3Page/>} />
        <Route path="/status4" element={<Status4Page/>} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:categoryId" element={<ProductPage />} />

      </Route>
    </Routes>
  );
}

export default App;
