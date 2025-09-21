import React, { useState } from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import Sidebar from '../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}>
          {/* Menu Button - Mobile */}
          <div className="lg:hidden fixed top-20 left-4 z-30">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
            >
              <MdMenu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          {/* Menu Button - Desktop */}
          <div className="hidden lg:block fixed top-20 left-4 z-30">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
            >
              <MdMenu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;