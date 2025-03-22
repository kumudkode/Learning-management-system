// src/app/dashboard/grades/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Download, FileText, Filter, Search, ExternalLink, TrendingUp, Clock, BarChart2 } from 'lucide-react'
import Link from 'next/link'

// Mock data for grades and certificates
const coursesWithGrades = [
  {
    id: '1',
    title: 'Introduction to React 19',
    instructor: 'Jane Smith',
    progress: 100,
    completed: true,
    finalGrade: 92,
    certificate: true,
    passingGrade: 70,
    lastActivity: '2025-03-15',
    assignments: [
      { title: 'React Basics Quiz', score: 85, maxScore: 100, weight: 20 },
      { title: 'Hooks Implementation', score: 95, maxScore: 100, weight: 30 },
      { title: 'Final Project', score: 92, maxScore: 100, weight: 50 }
    ]
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    instructor: 'John Doe',
    progress: 68,
    completed: false,
    finalGrade: null,
    certificate: false,
    passingGrade: 75,
    lastActivity: '2025-03-18',
    assignments: [
      { title: 'TypeScript Basics', score: 90, maxScore: 100, weight: 15 },
      { title: 'Generics Quiz', score: 82, maxScore: 100, weight: 25 },
      { title: 'Advanced Types', score: null, maxScore: 100, weight: 30 },
      { title: 'Final Project', score: null, maxScore: 100, weight: 30 }
    ]
  },
  {
    id: '4',
    title: 'Next.js 15 for Production',
    instructor: 'Mike Wilson',
    progress: 100,
    completed: true,
    finalGrade: 88,
    certificate: true,
    passingGrade: 70,
    lastActivity: '2025-02-20',
    assignments: [
      { title: 'Server Components Quiz', score: 80, maxScore: 100, weight: 20 },
      { title: 'Data Fetching Assignment', score: 92, maxScore: 100, weight: 30 },
      { title: 'Production App', score: 90, maxScore: 100, weight: 50 }
    ]
  },
  {
    id: '3',
    title: 'Tailwind CSS 4 Masterclass',
    instructor: 'Sarah Johnson',
    progress: 75,
    completed: false,
    finalGrade: null,
    certificate: false,
    passingGrade: 70,
    lastActivity: '2025-03-10',
    assignments: [
      { title: 'Utility Classes Quiz', score: 95, maxScore: 100, weight: 20 },
      { title: 'Responsive Design', score: 88, maxScore: 100, weight: 25 },
      { title: 'UI Components', score: 92, maxScore: 100, weight: 25 },
      { title: 'Final Project', score: null, maxScore: 100, weight: 30 }
    ]
  }
]

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedCourse, setExpandedCourse] = useState<string | null>('1')
  
  // Filter courses based on search query and status filter
  const filteredCourses = coursesWithGrades.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'completed' && course.completed) || 
      (filterStatus === 'inProgress' && !course.completed) ||
      (filterStatus === 'withCertificates' && course.certificate)
      
    return matchesSearch && matchesStatus
  })
  
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
  
  // Calculate current GPA
  const completedCourses = coursesWithGrades.filter(course => course.completed)
  const gpa = completedCourses.length > 0 
    ? Math.round(completedCourses.reduce((acc, course) => acc + (course.finalGrade || 0), 0) / completedCourses.length) 
    : 0
  
  // Calculate average grade for all attempts
  const allGrades = coursesWithGrades.flatMap(course => 
    course.assignments
      .filter(assignment => assignment.score !== null)
      .map(assignment => assignment.score || 0)
  )
  
  const averageGrade = allGrades.length > 0 
    ? Math.round(allGrades.reduce((acc, grade) => acc + grade, 0) / allGrades.length) 
    : 0

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grades & Certificates</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your academic progress and achievements</p>
      </motion.div>
      
      {/* Stats cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current GPA</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{gpa}%</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">+3%</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">vs previous</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Courses</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{completedCourses.length}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {coursesWithGrades.length - completedCourses.length} in progress
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Earned</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {coursesWithGrades.filter(course => course.certificate).length}
              </p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Link href="/dashboard/certificates" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View certificates →
            </Link>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Filters */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
            <select
              className="form-select rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="completed">Completed</option>
              <option value="inProgress">In Progress</option>
              <option value="withCertificates">With Certificates</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Courses with grades */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {filteredCourses.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
          >
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search.' : 'You have no courses matching the selected filter.'}
            </p>
          </motion.div>
        ) : (
          filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      {course.certificate && (
                        <div className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          <Award className="h-3 w-3 mr-1" /> Certified
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Instructor: {course.instructor}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-4">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Last activity: {new Date(course.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.completed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {course.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col items-center">
                    {course.finalGrade !== null ? (
                      <div className={`text-center p-3 rounded-lg ${
                        course.finalGrade >= course.passingGrade 
                          ? 'bg-green-50 dark:bg-green-900/10' 
                          : 'bg-red-50 dark:bg-red-900/10'
                      }`}>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Final Grade</p>
                        <p className={`text-2xl font-bold ${
                          course.finalGrade >= course.passingGrade 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {course.finalGrade}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Passing: {course.passingGrade}%
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {course.progress}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Passing: {course.passingGrade}%
                        </p>
                      </div>
                    )}
                    
                    {course.certificate && (
                      <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <Download className="h-4 w-4 mr-1" /> Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded details with assignments */}
              {expandedCourse === course.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                      Assignments & Assessments
                    </h4>
                    
                    // src/app/dashboard/grades/page.tsx (continued)
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Assignment
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Score
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Weight
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {course.assignments.map((assignment, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {assignment.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {assignment.score !== null ? (
                                  <span className={`${
                                    (assignment.score / assignment.maxScore) * 100 >= course.passingGrade
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {assignment.score}/{assignment.maxScore}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-500">Not submitted</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {assignment.weight}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {assignment.score !== null ? (
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    (assignment.score / assignment.maxScore) * 100 >= course.passingGrade
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  }`}>
                                    {(assignment.score / assignment.maxScore) * 100 >= course.passingGrade ? 'Passed' : 'Failed'}
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-end">
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Course <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
                