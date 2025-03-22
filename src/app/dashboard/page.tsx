// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { 
  BookOpen, Calendar, Award, TrendingUp,  //Users, //Clock,
  Bell, FileText, CheckCircle, //AlertCircle 
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const recentCourses = [
  { id: '1', title: 'Introduction to React 19', progress: 45, image: 'https://via.placeholder.com/100?text=React' },
  { id: '2', title: 'Advanced TypeScript Patterns', progress: 10, image: 'https://via.placeholder.com/100?text=TS' },
  { id: '3', title: 'Tailwind CSS 4 Masterclass', progress: 75, image: 'https://via.placeholder.com/100?text=CSS' },
]

const upcomingAssignments = [
  { id: '1', title: 'React Final Project', course: 'Introduction to React 19', dueDate: '2025-03-25', status: 'pending' },
  { id: '2', title: 'TypeScript Patterns Quiz', course: 'Advanced TypeScript Patterns', dueDate: '2025-03-22', status: 'pending' },
]

const recentAnnouncements = [
  { id: '1', title: 'New Course Available', message: 'Check out our new course on AI and Machine Learning', date: '2025-03-18' },
  { id: '2', title: 'System Maintenance', message: 'The platform will be down for maintenance on Sunday', date: '2025-03-17' },
]

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [greeting, setGreeting] = useState('')
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
    
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [isLoading, isAuthenticated, router])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  // Child animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome section */}
      <motion.div 
        variants={itemVariants} 
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {greeting}, {user?.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to your learning dashboard. Here&apos;s what&apos;s happening today.
        </p>
      </motion.div>
      
      {/* Stats overview */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div 
          whileHover={{ y: -5 }} 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Courses</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            <Link href="/dashboard/courses" className="flex items-center">
              View all courses <span className="ml-1">→</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }} 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Assignments</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-green-600 dark:text-green-400">
            <Link href="/dashboard/assignments" className="flex items-center">
              View assignments <span className="ml-1">→</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }} 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Average Score</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-purple-600 dark:text-purple-400">
            <Link href="/dashboard/grades" className="flex items-center">
              View grades <span className="ml-1">→</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }} 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Certifications</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            <Link href="/dashboard/certificates" className="flex items-center">
              View certificates <span className="ml-1">→</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent courses */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Courses</h2>
            <Link href="/dashboard/courses" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-14 h-14 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-white">{course.title}</h3>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/courses/${course.id}`} 
                  className="ml-4 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Resume →
                </Link>
              </motion.div>
            ))}
          </div>
          
          {recentCourses.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">No courses yet. Start learning today!</p>
              <Link 
                href="/dashboard/courses" 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Explore Courses
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Upcoming assignments */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Due Soon</h2>
            <Link href="/dashboard/assignments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingAssignments.map((assignment, index) => (
              <motion.div 
                key={assignment.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.course}</p>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-md">
                    Due soon
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                  <span className="text-gray-600 dark:text-gray-400">Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
            
            {upcomingAssignments.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">No upcoming assignments. You&apos;re all caught up!</p>
              </div>
            )}
          </div>
          
          {/* Recent announcements */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Announcements</h2>
            <div className="space-y-3">
              {recentAnnouncements.map((announcement, index) => (
                <motion.div 
                  key={announcement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (0.1 * index), duration: 0.4 }}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                    <h3 className="font-medium text-gray-800 dark:text-white">{announcement.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{announcement.message}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{announcement.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}