import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { Navbar, Sidebar } from './components';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string>('');

  const handleWalletConnect = () => {
    // Demo wallet address
    const demoWallet = '0x742d35Cc6634C0532925a3b8D375af0f4123C976';
    setWalletAddress(demoWallet);
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        {/* Navbar */}
        <Navbar 
          onWalletConnect={handleWalletConnect}
          walletAddress={walletAddress}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Main Content */}
          <main className="flex-1 min-h-screen lg:ml-64">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route 
                path="*" 
                element={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                      <p className="text-gray-400">Page not found</p>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;