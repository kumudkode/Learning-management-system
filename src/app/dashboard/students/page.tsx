// src/app/dashboard/students/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Mail, Download, MoreHorizontal, 
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle, 
  Clock, Award, Book, UserPlus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'

// Mock student data
const studentsData = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    enrollmentDate: '2025-01-15',
    coursesEnrolled: 3,
    completionRate: 85,
    lastActive: '2025-03-18',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    enrollmentDate: '2025-02-03',
    coursesEnrolled: 2,
    completionRate: 45,
    lastActive: '2025-03-15',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    enrollmentDate: '2025-01-28',
    coursesEnrolled: 4,
    completionRate: 62,
    lastActive: '2025-03-19',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
  },
  {
    id: '4',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    enrollmentDate: '2025-02-17',
    coursesEnrolled: 1,
    completionRate: 30,
    lastActive: '2025-03-12',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    id: '5',
    name: 'James Martinez',
    email: 'james.martinez@example.com',
    enrollmentDate: '2025-01-10',
    coursesEnrolled: 5,
    completionRate: 92,
    lastActive: '2025-03-19',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  {
    id: '6',
    name: 'Olivia Thompson',
    email: 'olivia.thompson@example.com',
    enrollmentDate: '2025-02-22',
    coursesEnrolled: 2,
    completionRate: 15,
    lastActive: '2025-03-05',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
  },
  {
    id: '7',
    name: 'William Davis',
    email: 'william.davis@example.com',
    enrollmentDate: '2025-01-20',
    coursesEnrolled: 3,
    completionRate: 78,
    lastActive: '2025-03-17',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg'
  },
  {
    id: '8',
    name: 'Ava Robinson',
    email: 'ava.robinson@example.com',
    enrollmentDate: '2025-02-08',
    coursesEnrolled: 1,
    completionRate: 100,
    lastActive: '2025-03-14',
    avatar: 'https://randomuser.me/api/portraits/women/77.jpg'
  }
]

// Student courses data - this would typically come from your API
const studentCourses = {
  '1': [
    { id: '1', title: 'Introduction to React 19', progress: 100, lastActivity: '2025-03-15', grade: 92 },
    { id: '3', title: 'Tailwind CSS 4 Masterclass', progress: 75, lastActivity: '2025-03-18', grade: null },
    { id: '5', title: 'MongoDB and Mongoose Mastery', progress: 60, lastActivity: '2025-03-10', grade: null }
  ],
  '2': [
    { id: '2', title: 'Advanced TypeScript Patterns', progress: 35, lastActivity: '2025-03-15', grade: null },
    { id: '4', title: 'Next.js 15 for Production', progress: 55, lastActivity: '2025-03-12', grade: null }
  ]
}

export default function StudentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)
  
  const itemsPerPage = 5
  
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
  
  // Filter students based on search query and status filter
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && new Date(student.lastActive) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) || 
      (filterStatus === 'inactive' && new Date(student.lastActive) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterStatus === 'completed' && student.completionRate === 100)
      
    return matchesSearch && matchesStatus
  })
  
  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)
  
  // Handle invite student
  const handleInviteStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inviteEmail.trim()) {
      toast.error('Email is required')
      return
    }
    
    setIsInviting(true)
    
    try {
      // This would call the API in a real app
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setShowInviteForm(false)
    } catch (error) {
      console.error('Error inviting student:', error)
      toast.error('Failed to send invitation. Please try again.')
    } finally {
      setIsInviting(false)
    }
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
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Students</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your students and track their progress</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowInviteForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Invite Student
          </button>
        </div>
      </motion.div>
      
      {/* Invite student form */}
      {showInviteForm && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite New Student</h2>
              <button 
                onClick={() => setShowInviteForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleInviteStudent}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="student@example.com"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isInviting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" /> Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      
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
              placeholder="Search students..."
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
              <option value="all">All Students</option>
              <option value="active">Active (Last 7 days)</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed Courses</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Student list and details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student list */}
        <motion.div 
          className="md:col-span-3 lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {paginatedStudents.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No students found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search.' : 'There are no students matching the selected filter.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Enrollment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedStudents.map((student) => (
                      <tr 
                        key={student.id}
                        onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          selectedStudent === student.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={student.avatar} 
                                alt={student.name} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{new Date(student.enrollmentDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.coursesEnrolled} courses</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                            <div 
                              className={`h-2.5 rounded-full ${
                                student.completionRate >= 80 ? 'bg-green-600' : 
                                student.completionRate >= 40 ? 'bg-blue-600' : 
                                'bg-amber-500'
                              }`}
                              style={{ width: `${student.completionRate}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{student.completionRate}% complete</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(student.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(startIndex + itemsPerPage, filteredStudents.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredStudents.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === index + 1
                                ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            } text-sm font-medium`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
        
        {/* Student details */}
        {selectedStudent && (
          <motion.div
            className="md:col-span-3 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {(() => {
              const student = studentsData.find(s => s.id === selectedStudent)
              
              if (!student) return null
              
              return (
                <div>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Details</h2>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1">
                          <Mail className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{student.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Enrolled On</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(student.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Last Active</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(student.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Courses Enrolled</p>
                        <p className="font-medium text-gray-900 dark:text-white">{student.coursesEnrolled}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Completion Rate</p>
                        <p className="font-medium text-gray-900 dark:text-white">{student.completionRate}%</p>
                    </div>
                  </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Enrolled Courses</h3>
                    
                    {studentCourses[selectedStudent] ? (
                      <div className="space-y-4">
                        {studentCourses[selectedStudent].map(course => (
                          <div key={course.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                            
                            <div className="mt-2 flex items-center justify-between text-xs">
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Last active: {new Date(course.lastActivity).toLocaleDateString()}
                              </div>
                              
                              {course.grade !== null ? (
                                <div className="flex items-center">
                                  <div className={`px-2 py-0.5 rounded-full ${
                                    course.grade >= 70 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  }`}>
                                    Grade: {course.grade}%
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    In Progress
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    course.progress >= 80 ? 'bg-green-600' : 
                                    course.progress >= 40 ? 'bg-blue-600' : 
                                    'bg-amber-500'
                                  }`}
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                                {course.progress}% complete
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg text-center">
                        <Book className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">No course data available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Activity Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Assignments Completed</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
                          </div>
                        </div>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">8</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Average Session</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Time spent learning</p>
                          </div>
                        </div>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">45m</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Certificates Earned</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                          </div>
                        </div>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">2</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </div>
    </div>
  )
}