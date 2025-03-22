// src/components/layout/MobileNav.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Users, FileText, Calendar, MessageSquare, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  ]
  
  const instructorNavigation = [
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]
  
  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-40 bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg"
      >
        <Menu size={24} />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">LMS</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } group flex items-center px-3 py-3 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive(item.href)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              ))}
              
              {(user?.role === 'instructor' || user?.role === 'admin') && (
                <>
                  <div className="pt-2 pb-1">
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  
                  {instructorNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`${
                        isActive(item.href)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } group flex items-center px-3 py-3 text-base font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          isActive(item.href)
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        } mr-4 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}