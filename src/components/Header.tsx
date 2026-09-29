import React, { useState } from 'react';
import { SlidersHorizontal, User, LogOut, Home, LayoutDashboard, X } from 'lucide-react';
import { UserProfile, ViewMode } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  viewMode: ViewMode;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  viewMode,
  onNavigateHome,
  onNavigateDashboard,
  onOpenAuth,
  onSignOut,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6 md:py-8 max-w-7xl mx-auto w-full">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onNavigateHome}
          id="header-logo-container"
        >
          <div className="w-8 h-8 rounded-full bg-[#4F7396] flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs">
            <div className="w-3 h-3 bg-white rounded-2xs rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#1A2E44]">
              Dyslexia Screening System
            </span>
          </div>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center space-x-3 sm:space-x-6">
          {user ? (
            <div className="flex items-center space-x-3">
              {viewMode !== 'dashboard' && viewMode !== 'admin_dashboard' && (
                <button
                  onClick={onNavigateDashboard}
                  className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-[#4F7396] hover:text-[#1A2E44] transition-colors px-2.5 py-1.5 cursor-pointer"
                  id="header-dashboard-link"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center space-x-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-[#D1D9E6] text-xs font-semibold text-[#4F7396] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Log Out"
                  id="header-signout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {viewMode !== 'login' && viewMode !== 'register' && (
                <>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="text-xs sm:text-sm font-medium text-[#4F7396] hover:text-[#1A2E44] transition-colors px-2 py-1 cursor-pointer"
                    id="header-sign-in-btn"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-5 sm:px-6 py-2.5 bg-[#1A2E44] text-white text-xs sm:text-sm font-medium rounded-full shadow-2xs hover:bg-[#2D4561] transition-all cursor-pointer"
                    id="header-get-started-btn"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A2E44]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl border border-[#E8EDF2] relative scale-in-center">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-[#7A8C9F] hover:text-[#1A2E44] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E44] text-center mb-2">Sign Out</h3>
            <p className="text-sm text-[#5A6D82] text-center mb-8">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  onSignOut();
                }}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors cursor-pointer"
              >
                Yes, sign me out
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 bg-[#F0F2F5] hover:bg-[#E8EDF2] text-[#1A2E44] font-medium rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
