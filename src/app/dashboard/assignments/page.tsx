// src/app/dashboard/assignments/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Mock data
const assignmentsData = [
  {
    id: '1',
    title: 'React Final Project',
    course: 'Introduction to React 19',
    courseId: '1',
    description: 'Build a fully functional React application using hooks and modern React patterns.',
    dueDate: '2025-04-05',
    status: 'upcoming',
    progress: 0
  },
  {
    id: '2',
    title: 'TypeScript Patterns Quiz',
    course: 'Advanced TypeScript Patterns',
    courseId: '2',
    description: 'Multiple choice quiz covering advanced TypeScript patterns and best practices.',
    dueDate: '2025-03-22',
    status: 'due-soon',
    progress: 0
  },
  {
    id: '3',
    title: 'UI Component Library',
    course: 'Tailwind CSS 4 Masterclass',
    courseId: '3',
    description: 'Create a reusable UI component library using Tailwind CSS.',
    dueDate: '2025-03-28',
    status: 'upcoming',
    progress: 25
  },
  {
    id: '4',
    title: 'Server-side Rendering Project',
    course: 'Next.js 15 for Production',
    courseId: '4',
    description: 'Implement SSR and SSG techniques in a Next.js application.',
    dueDate: '2025-03-15',
    status: 'overdue',
    progress: 70
  },
  {
    id: '5',
    title: 'Database Schema Design',
    course: 'MongoDB and Mongoose Mastery',
    courseId: '5',
    description: 'Design an efficient database schema for an e-commerce application.',
    dueDate: '2025-03-18',
    status: 'completed',
    progress: 100
  }
]

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Filter assignments based on search query and status filter
  const filteredAssignments = assignmentsData.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && assignment.status !== 'completed') ||
                         assignment.status === statusFilter
                         
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
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Completed
          </span>
        )
      case 'due-soon':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Due Soon
          </span>
        )
      case 'overdue':
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Overdue
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Upcoming
          </span>
        )
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your assignments</p>
        </div>
      </motion.div>
      
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
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
            <select
              className="form-select rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Assignments</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="due-soon">Due Soon</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {filteredAssignments.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
          >
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No assignments found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search.' : 'You have no assignments matching the selected filter.'}
            </p>
          </motion.div>
        ) : (
          filteredAssignments.map(assignment => (
            <motion.div
              key={assignment.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <div className="ml-3">
                      {getStatusBadge(assignment.status)}
                    </div>
                  </div>
                  
                  <Link
                    href={`/dashboard/courses/${assignment.courseId}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-block mt-1"
                  >
                    {assignment.course}
                  </Link>
                  
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {assignment.description}
                  </p>
                  
                  <div className="mt-3 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {assignment.status !== 'completed' && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {assignment.status === 'overdue' 
                            ? 'Overdue by ' + Math.floor((Date.now() - new Date(assignment.dueDate).getTime()) / (1000 * 60 * 60 * 24)) + ' days'
                            : Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' days left'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-center">
                  {assignment.progress > 0 && (
                    <div className="w-full max-w-[120px] mb-2">
                      <div className="text-xs text-center font-medium mb-1">{assignment.progress}%</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            assignment.status === 'completed' 
                              ? 'bg-green-600' 
                              : assignment.status === 'overdue'
                                ? 'bg-red-600'
                                : 'bg-blue-600'
                          }`}
                          style={{ width: `${assignment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {assignment.status === 'completed' ? (
                    <div className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-md">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Submitted
                    </div>
                  ) : (
                    <Link 
                      href={`/dashboard/assignments/${assignment.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {assignment.progress > 0 ? 'Continue' : 'Start'} Assignment
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}