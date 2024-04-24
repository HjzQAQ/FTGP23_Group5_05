import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Borrowpage from './pages/Borrowpage';
import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Lendingpage from './pages/Lendingpage';
import Newpage from './pages/Newpage';
import PayOffpage from './pages/PayOffpage';
import MarketsPage from './pages/MarketsPage';
import LendingTable from './components/LendingTable';
import Household from './components/Household';
import Mortgage from './components/Mortgage';
import Automotive from './components/Automotive';
import Gardening from './components/Gardening';
import Electronics from './components/Electronics';
import CountryFinancialAid from './components/CountryFinancialAid';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/borrow" element={<Borrowpage />} />
        <Route path="/lend" element={<Lendingpage />}>
          <Route path="crypto" element={<LendingTable />} />
          <Route path="mortgage" element={<Mortgage />} />
          <Route path="electronics" element={<Electronics />} />
          <Route path="automotive" element={<Automotive />} />
          <Route path="gardening" element={<Gardening />} />
          <Route path="CountryFinancialAid" element={<CountryFinancialAid />} />
          <Route path="household" element={<Household />} />
        </Route>
        <Route path="/new" element={<Newpage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/payoff" element={<PayOffpage />} />
        <Route path="/market" element={<MarketsPage />} />
        {/* <Route path="/new" element={<Newpage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
