// src/app/dashboard/analytics/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, CalendarRange, TrendingUp, Users, BookOpen, Award, BarChart2, PieChart, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Mock data for charts
const overviewStats = [
  { title: 'Total Students', value: '248', change: '+12%', icon: Users, color: 'blue' },
  { title: 'Course Completion', value: '64%', change: '+7%', icon: BookOpen, color: 'green' },
  { title: 'Avg. Engagement', value: '38 min', change: '+16%', icon: Clock, color: 'purple' },
  { title: 'Certifications', value: '156', change: '+4%', icon: Award, color: 'amber' },
]

// Course enrollment data for chart
const enrollmentData = [
  { month: 'Jan', count: 65 },
  { month: 'Feb', count: 75 },
  { month: 'Mar', count: 100 },
  { month: 'Apr', count: 85 },
  { month: 'May', count: 110 },
  { month: 'Jun', count: 130 },
  { month: 'Jul', count: 120 },
  { month: 'Aug', count: 140 },
  { month: 'Sep', count: 155 },
  { month: 'Oct', count: 165 },
  { month: 'Nov', count: 185 },
  { month: 'Dec', count: 200 },
]

// Course completion rates
const completionRates = [
  { course: 'React 19 Introduction', completion: 78 },
  { course: 'TypeScript Patterns', completion: 65 },
  { course: 'Tailwind CSS 4', completion: 82 },
  { course: 'Next.js 15 for Production', completion: 45 },
  { course: 'MongoDB and Mongoose', completion: 58 },
]

// Student activity by day
const studentActivity = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 5.2 },
  { day: 'Wed', hours: 3.8 },
  { day: 'Thu', hours: 4.9 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 2.7 },
  { day: 'Sun', hours: 2.1 },
]

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('last30Days')
  
  // Redirect non-instructors
  useEffect(() => {
    if (!isLoading && user && user.role !== 'instructor' && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isLoading, user, router])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return null
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track student progress and course performance</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="relative">
            <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
              <CalendarRange className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              {timeRange === 'last7Days' && 'Last 7 Days'}
              {timeRange === 'last30Days' && 'Last 30 Days'}
              {timeRange === 'last90Days' && 'Last 90 Days'}
              {timeRange === 'year' && 'This Year'}
              <ChevronDown className="ml-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            
            {/* Time range dropdown would go here */}
          </div>
        </div>
      </motion.div>
      
      {/* Overview stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {overviewStats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">vs previous period</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enrollment Trends */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enrollment Trends</h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View Details
            </button>
          </div>
          
          <div className="h-64">
            {/* This would be a chart in a real app */}
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end h-full">
                {enrollmentData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center w-full">
                    <div 
                      className="w-4/5 bg-blue-500 dark:bg-blue-600 rounded-t-sm transition-all duration-1000"
                      style={{ height: `${(item.count / 200) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Enrollments</p>
              <p className="font-semibold text-gray-900 dark:text-white">1,328</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Growth Rate</p>
              <p className="font-semibold text-green-600 dark:text-green-400">+22.4%</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Avg. Per Course</p>
              <p className="font-semibold text-gray-900 dark:text-white">265</p>
            </div>
          </div>
        </motion.div>
        
        {/* Course Completion Rates */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Completion Rates</h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {completionRates.map((course) => (
              <div key={course.course} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-4">
                    {course.course}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.completion}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      course.completion >= 75 ? 'bg-green-600' : 
                      course.completion >= 50 ? 'bg-blue-600' : 
                      course.completion >= 25 ? 'bg-yellow-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${course.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-1"></div>
                <span className="text-gray-600 dark:text-gray-400">75%+ Completion</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
                <span className="text-gray-600 dark:text-gray-400">50%+ Completion</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span className="text-gray-600 dark:text-gray-400">25%+ Completion</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Activity */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Activity</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average time spent per day</p>
          </div>
          
          <div className="h-64">
            {/* This would be a chart in a real app */}
            <div className="relative h-full flex items-end">
              {studentActivity.map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-4/5 bg-purple-500 dark:bg-purple-600 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${(item.hours / 6) * 100}%` }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Peak Day</p>
                <p className="font-semibold text-gray-900 dark:text-white">Tuesday</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Avg. Daily</p>
                <p className="font-semibold text-gray-900 dark:text-white">3.8 hours</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Student Demographics */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Demographics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Distribution by experience</p>
          </div>
          
          <div className="flex justify-center items-center h-40">
            {/* Would use a real pie chart component like Chart.js in a real app */}
            <div className="relative w-32 h-32">
              <PieChart className="w-32 h-32 text-gray-300 dark:text-gray-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">248 total</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Beginner</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">45%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Intermediate</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">32%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">18%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Expert</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5%</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          // src/app/dashboard/analytics/page.tsx (continued)
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Latest student interactions</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  32 students completed React Module 1
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Today, 14:32
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Sarah Johnson published 2 new lessons
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Today, 10:15
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  5 students enrolled in TypeScript Patterns
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Yesterday, 18:42
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Assignment deadline extended for Next.js course
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Yesterday, 09:24
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all activity →
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Top performing content */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Content</h2>
          <div>
            <select className="text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>All Courses</option>
              <option>React 19 Introduction</option>
              <option>TypeScript Patterns</option>
              <option>Tailwind CSS 4</option>
              <option>Next.js 15 for Production</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completion
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Hooks in Depth</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Video Lesson</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">React 19 Introduction</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">78%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">224 views</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    92%
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    <span className="ml-1 text-sm text-gray-900 dark:text-white">4.9</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Advanced Types Quiz</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Assessment</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">TypeScript Patterns</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">65%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">186 attempts</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    78%
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    <span className="ml-1 text-sm text-gray-900 dark:text-white">4.5</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                      <PieChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Utility Classes Workshop</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Interactive</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">Tailwind CSS 4</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">82%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">253 participants</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    95%
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    <span className="ml-1 text-sm text-gray-900 dark:text-white">4.8</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}