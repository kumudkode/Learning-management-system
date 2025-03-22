// src/app/dashboard/courses/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, BookOpen, Clock, BarChart2, Download, Play, CheckCircle,
  Users, Star, MessageSquare, Award, ChevronRight, ChevronDown, Lock
} from 'lucide-react'

// Mock data for a specific course
const courseData = {
  id: '1',
  title: 'Introduction to React 19',
  description: 'Learn the fundamentals of React 19 with this comprehensive course. We cover everything from basic concepts to advanced patterns, helping you build modern web applications with the latest React features.',
  instructor: {
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    bio: 'Senior Frontend Developer with 10+ years of experience. Specializes in React and modern JavaScript.',
    courses: 8
  },
  image: 'https://via.placeholder.com/1200x400?text=React+19+Course',
  duration: '6 hours',
  lessons: 12,
  level: 'Beginner',
  rating: 4.8,
  enrolled: 2453,
  lastUpdated: '2025-02-15',
  language: 'English',
  progress: 45,
  objectives: [
    'Understand React 19 core concepts and hooks',
    'Build responsive UIs with modern React patterns',
    'Implement state management techniques',
    'Create reusable components and custom hooks',
    'Deploy React applications to production'
  ],
  modules: [
    {
      id: 'm1',
      title: 'Getting Started with React 19',
      lessons: [
        { id: 'l1', title: 'Introduction to React', duration: '10:25', completed: true },
        { id: 'l2', title: 'Setting Up Your Development Environment', duration: '15:40', completed: true },
        { id: 'l3', title: 'Creating Your First React Component', duration: '20:15', completed: false }
      ]
    },
    {
      id: 'm2',
      title: 'React Hooks in Depth',
      lessons: [
        { id: 'l4', title: 'Understanding useState and useEffect', duration: '18:30', completed: false },
        { id: 'l5', title: 'Building Custom Hooks', duration: '22:10', completed: false },
        { id: 'l6', title: 'Advanced Hook Patterns', duration: '25:45', completed: false }
      ]
    },
    {
      id: 'm3', 
      title: 'State Management',
      lessons: [
        { id: 'l7', title: 'Local vs Global State', duration: '14:55', completed: false },
        { id: 'l8', title: 'Context API in Depth', duration: '28:20', completed: false },
        { id: 'l9', title: 'Introduction to Redux', duration: '32:15', completed: false }
      ]
    },
    {
      id: 'm4',
      title: 'Building a Complete Project',
      lessons: [
        { id: 'l10', title: 'Project Setup and Planning', duration: '12:30', completed: false },
        { id: 'l11', title: 'Implementing Core Features', duration: '35:20', completed: false },
        { id: 'l12', title: 'Testing and Deployment', duration: '28:40', completed: false }
      ]
    }
  ]
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [expandedModule, setExpandedModule] = useState<string | null>('m1')
  const [activeTab, setActiveTab] = useState<'content' | 'overview' | 'discussion'>('content')
  
  // Calculate course stats
  const totalLessons = courseData.modules.reduce((sum, module) => sum + module.lessons.length, 0)
  const completedLessons = courseData.modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.completed).length, 0)
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)
  
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <Link href="/dashboard/courses" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Courses
        </Link>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Course header */}
          <motion.div 
            variants={itemVariants}
            className="rounded-xl overflow-hidden"
          >
            <div className="relative">
              <img 
                src={courseData.image} 
                alt={courseData.title}
                className="w-full object-cover h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-blue-600 text-xs font-semibold rounded-md mr-2">
                      {courseData.level}
                    </span>
                    <span className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" /> 
                      {courseData.duration}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold">{courseData.title}</h1>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Tabs */}
          <motion.div variants={itemVariants} className="mt-6 border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-4 px-1 ${activeTab === 'content' 
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Course Content
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 ${activeTab === 'overview' 
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`pb-4 px-1 ${activeTab === 'discussion' 
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Discussion
              </button>
            </div>
          </motion.div>
          
          {/* Tab content */}
          {activeTab === 'content' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {completedLessons}/{totalLessons} lessons completed
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {courseData.modules.map(module => (
                    <div key={module.id} className="bg-white dark:bg-gray-800">
                      <button
                        onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`mr-3 ${expandedModule === module.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {expandedModule === module.id ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900 dark:text-white">{module.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{module.lessons.length} lessons</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                        </div>
                      </button>
                      
                      {expandedModule === module.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 dark:bg-gray-700/30"
                        >
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {module.lessons.map(lesson => (
                              <div 
                                key={lesson.id} 
                                className="px-5 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 flex-shrink-0 mr-3">
                                    {lesson.completed ? (
                                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-8 h-8 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                      </div>
                                    ) : (
                                      <div className="rounded-full bg-gray-100 dark:bg-gray-700 w-8 h-8 flex items-center justify-center">
                                        <Play className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration}</p>
                                  </div>
                                </div>
                                {!lesson.completed && <Lock className="h-4 w-4 text-gray-400" />}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === 'overview' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Course</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{courseData.description}</p>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">What You'll Learn</h3>
                <ul className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courseData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto text-gray-500 dark:text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{courseData.duration}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto text-gray-500 dark:text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                    <p className="font-medium text-gray-900 dark:text-white">{totalLessons}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-gray-500 dark:text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                    <p className="font-medium text-gray-900 dark:text-white">{courseData.enrolled.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <BarChart2 className="h-6 w-6 mx-auto text-gray-500 dark:text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                    <p className="font-medium text-gray-900 dark:text-white">{courseData.level}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About the Instructor</h2>
                <div className="flex items-start">
                  <img 
                    src={courseData.instructor.avatar} 
                    alt={courseData.instructor.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{courseData.instructor.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{courseData.instructor.courses} courses</p>
                    <p className="text-gray-700 dark:text-gray-300">{courseData.instructor.bio}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === 'discussion' && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Discussion</h2>
              <p className="text-gray-600 dark:text-gray-400">Join the conversation about this course.</p>
              
              {/* Discussion form */}
              <div className="mt-4">
                <textarea
                  placeholder="Write your question or comment..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Post Comment
                  </button>
                </div>
              </div>
              
              {/* Sample discussion thread - in a real app, this would come from an API */}
              <div className="mt-8 space-y-6">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex">
                    <img 
                      src="https://randomuser.me/api/portraits/men/42.jpg" 
                      alt="User"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white">Michael Brown</h3>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        How do we implement the Context API with TypeScript? I'm having trouble with the types.
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <button className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" /> Reply
                        </button>
                      </div>
                      
                      {/* Instructor reply */}
                      <div className="ml-8 mt-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <div className="flex">
                          <img 
                            src={courseData.instructor.avatar} 
                            alt={courseData.instructor.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-gray-900 dark:text-white">{courseData.instructor.name}</h3>
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">Instructor</span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                              Great question! We'll cover this in detail in module 2, but here's a quick example...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          {/* Progress card */}
          // src/app/dashboard/courses/[id]/page.tsx (continued sidebar)

          {/* Progress card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{completedLessons}/{totalLessons} lessons</span>
                <span className="font-medium text-gray-900 dark:text-white">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <button className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              <Play className="h-4 w-4 mr-2" /> Continue Learning
            </button>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download className="h-4 w-4 mr-2" /> Resources
              </button>
              <button className="flex justify-center items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <MessageSquare className="h-4 w-4 mr-2" /> Get Help
              </button>
            </div>
          </div>
          
          {/* Course stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-lg font-medium text-gray-900 dark:text-white">{courseData.rating}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({courseData.enrolled} students)</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Language:</span>
                <span className="font-medium text-gray-900 dark:text-white">{courseData.language}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Last updated:</span>
                <span className="font-medium text-gray-900 dark:text-white">{courseData.lastUpdated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Certificate:</span>
                <span className="flex items-center font-medium text-gray-900 dark:text-white">
                  <Award className="h-4 w-4 mr-1 text-green-500" /> Available
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Share this course</h3>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <svg className="h-5 w-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.7 6.7c-.8.3-1.6.6-2.4.7.9-.5 1.6-1.4 1.9-2.4-.8.5-1.7.8-2.7 1-.8-.8-1.9-1.3-3.1-1.3-2.3 0-4.2 1.9-4.2 4.2 0 .3 0 .7.1 1-3.5-.2-6.6-1.9-8.7-4.5-.4.7-.6 1.4-.6 2.2 0 1.5.8 2.8 2 3.5-.7 0-1.4-.2-2-.5v.1c0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.7 2 2.9 3.9 2.9-1.4 1.1-3.2 1.8-5.2 1.8-.3 0-.7 0-1-.1 1.9 1.2 4.1 1.9 6.4 1.9 7.7 0 11.9-6.4 11.9-11.9V6.7c.8-.6 1.5-1.3 2-2.2l.2-.2z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <svg className="h-5 w-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <svg className="h-5 w-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}