import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import WalletSettingsPage from './pages/WalletSettingsPage';
import { Navbar, Sidebar } from './components';
import { WalletProvider } from './contexts/WalletContext';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-dark-900">
          {/* Navbar */}
          <Navbar />

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
                <Route path="/settings" element={<WalletSettingsPage />} />
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
    </WalletProvider>
  );
}

export default App;