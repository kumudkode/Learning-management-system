// src/components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { FaBell } from "react-icons/fa";
import NotificationModal from "@/components/notifications/NotificationModal";
import { useTheme } from '@/context/ThemeContext'
import { Bell, Settings, LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import useNotifications from "@/hooks/useNotifications";

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                LMS
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <>
                <div className="relative">
                    {/* Notification bell with badge */}
                    <button
                      onClick={() => setIsNotificationModalOpen(true)}
                      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FaBell className="h-6 w-6 text-gray-600" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  <NotificationModal
                    isOpen={isNotificationModalOpen}
                    onClose={() => setIsNotificationModalOpen(false)}
                    notifications={notifications}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                    
                </div>

                <Link
                  href="/dashboard/settings"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={20} />
                </Link>

                <div className="relative ml-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 pt-2 pb-3">
          <div className="space-y-1 px-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200"
            >
              {theme === "dark" ? (
                <Sun size={18} className="mr-3" />
              ) : (
                <Moon size={18} className="mr-3" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            {user && (
              <>
                <div className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <span className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200"
                >
                  <Bell size={18} className="mr-3" /> Notifications
                </a>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200"
                >
                  <Settings size={18} className="mr-3" /> Settings
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200"
                >
                  <LogOut size={18} className="mr-3" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}