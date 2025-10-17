import React from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
    { id: 'transactions', label: 'Transactions', icon: '💳', active: false },
    { id: 'analytics', label: 'Analytics', icon: '📈', active: false },
    { id: 'settings', label: 'Settings', icon: '⚙️', active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64 glass-effect transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 mb-8 pt-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-lg font-semibold text-white">NeeO</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                      ${
                        item.active
                          ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                          : 'text-gray-400 hover:text-white hover:bg-dark-100'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6">
            <div className="p-4 bg-dark-100 rounded-lg border border-primary-600/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-400">Connected</span>
              </div>
              <p className="text-xs text-gray-500">Ethereum Mainnet</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;