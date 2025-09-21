import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';
import {
  MdOutlineDashboard,
  MdOutlineLogout,
  MdOutlineHistory,
  MdOutlineSettings,
  MdOutlinePersonOutline,
  MdOutlineSchool,
  MdOutlineAnalytics,
  MdOutlineAssessment,
  MdTimeline,
  MdWork,
  MdHelp,
  MdBarChart,
  MdMenu,
  MdClose,
} from 'react-icons/md';
import { FaLaptopCode, FaUserTie, FaChartLine, FaTrophy } from 'react-icons/fa';

const navigationItems = [
  // Main Features (Top Priority)
  {
    name: 'Dashboard',
    icon: MdOutlineDashboard,
    path: '/dashboard',
    type: 'nav',
    priority: 'main'
  },
  {
    name: 'Resume Analyzer',
    icon: MdOutlineAnalytics,
    path: '/resume-analyzer',
    type: 'nav',
    priority: 'main'
  },
  {
    name: 'Skills Gap',
    icon: FaChartLine,
    path: '/skills-gap',
    type: 'nav',
    priority: 'main'
  },
  {
    name: 'Roadmap Generator',
    icon: MdOutlineSchool,
    path: '/roadmap-generator',
    type: 'nav',
    priority: 'main'
  },
  {
    name: 'Career Q&A',
    icon: MdOutlineAssessment,
    path: '/career-qa',
    type: 'nav',
    priority: 'main'
  },
  
  // Work in Progress Features
  {
    name: 'Roadmap',
    icon: MdTimeline,
    path: '/roadmap',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Job Matches',
    icon: MdWork,
    path: '/job-matches',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Job Recommendations',
    icon: FaUserTie,
    path: '/job-recommendations',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'My History',
    icon: MdOutlineHistory,
    path: '/my-history',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Progress & Badges',
    icon: FaTrophy,
    path: '/progress-badges',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Reports',
    icon: MdBarChart,
    path: '/reports',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Help & Support',
    icon: MdHelp,
    path: '/help-support',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Admin & Settings',
    icon: MdOutlineSettings,
    path: '/settings',
    type: 'nav',
    priority: 'wip'
  },
  {
    name: 'Logout',
    icon: MdOutlineLogout,
    path: '/logout',
    type: 'action'
  },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Close the modal
    setShowLogoutModal(false);
    
    // Use centralized logout function
    logout(navigate);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bg-white text-gray-600 h-screen border-r border-gray-200 overflow-y-auto z-50 transition-all duration-300 ${
        isOpen ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden'
      }`}>
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col space-y-2 flex-grow">
            {/* Main Features */}
            {navigationItems.filter(item => item.type === 'nav' && item.priority === 'main').map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md ` +
                  (isActive
                    ? 'bg-indigo-100 text-indigo-800 shadow-md scale-105'
                    : 'hover:bg-gray-100 hover:text-gray-900 hover:translate-x-2')
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
            
            {/* Work in Progress Features */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {navigationItems.filter(item => item.type === 'nav' && item.priority === 'wip').map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:bg-gray-100 hover:text-gray-900 hover:translate-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs text-orange-500 font-medium">Work in Progress</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout button at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {navigationItems.filter(item => item.type === 'action').map((item, index) => (
              <button
                key={index}
                onClick={handleLogoutClick}
                className="flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:bg-red-50 hover:text-red-600 hover:translate-x-2 text-left w-full"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <MdOutlineLogout className="text-red-400" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Confirm Logout</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;