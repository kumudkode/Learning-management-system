// src/app/dashboard/live-sessions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, Calendar, Clock, Users, Clipboard, Link2, Share2, 
  Copy, Check, Edit3, Plus, ArrowRight, X, AlertCircle, 
  Zap, Monitor, Mic, MicOff, Camera, CameraOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'

// Mock data for upcoming and past sessions
const sessionsData = [
  {
    id: '1',
    title: 'React 19 New Features Deep Dive',
    description: 'Explore the latest features in React 19 and how to implement them in your projects.',
    date: '2025-03-22T13:00:00',
    duration: 60,
    instructor: 'Jane Smith',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    courseId: '1',
    courseName: 'Introduction to React 19',
    attendees: 78,
    maxAttendees: 100,
    status: 'upcoming',
    joinUrl: 'https://meet.example.com/react-deep-dive',
    recording: null
  },
  {
    id: '2',
    title: 'Mastering TypeScript Generics',
    description: 'Learn advanced techniques for using generics in TypeScript to create flexible, reusable components.',
    date: '2025-03-24T15:30:00',
    duration: 90,
    instructor: 'John Doe',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    courseId: '2',
    courseName: 'Advanced TypeScript Patterns',
    attendees: 45,
    maxAttendees: 75,
    status: 'upcoming',
    joinUrl: 'https://meet.example.com/typescript-generics',
    recording: null
  },
  {
    id: '3',
    title: 'Building with Tailwind CSS Components',
    description: 'Workshop on creating a component library using Tailwind CSS for rapid UI development.',
    date: '2025-03-18T14:00:00',
    duration: 120,
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    courseId: '3',
    courseName: 'Tailwind CSS 4 Masterclass',
    attendees: 65,
    maxAttendees: 75,
    status: 'past',
    joinUrl: null,
    recording: 'https://recordings.example.com/tailwind-workshop'
  },
  {
    id: '4',
    title: 'Next.js API Routes and Middleware',
    description: 'Learn to implement and optimize API routes and middleware in Next.js applications.',
    date: '2025-03-15T11:00:00',
    duration: 60,
    instructor: 'Mike Wilson',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    courseId: '4',
    courseName: 'Next.js 15 for Production',
    attendees: 92,
    maxAttendees: 100,
    status: 'past',
    joinUrl: null,
    recording: 'https://recordings.example.com/nextjs-api-routes'
  }
]

// Mock data for active session
const mockActiveSession = {
  id: '999',
  title: 'Live Coding Session: Building a React Component Library',
  startTime: new Date(Date.now() - 25 * 60 * 1000), // Started 25 minutes ago
  participants: 42,
  instructor: 'Jane Smith',
  instructorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  courseId: '1',
  courseName: 'Introduction to React 19',
}

export default function LiveSessionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    courseId: '',
    maxAttendees: 100
  })
  const [sessionLinkCopied, setSessionLinkCopied] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isJoiningSession, setIsJoiningSession] = useState(false)
  const [showActiveSession, setShowActiveSession] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  
  // Available courses for instructor to create sessions for
  const availableCourses = [
    { id: '1', title: 'Introduction to React 19' },
    { id: '2', title: 'Advanced TypeScript Patterns' },
    { id: '3', title: 'Tailwind CSS 4 Masterclass' },
    { id: '4', title: 'Next.js 15 for Production' },
    { id: '5', title: 'MongoDB and Mongoose Mastery' }
  ]
  
  // Filter sessions based on active tab
  const filteredSessions = sessionsData.filter(session => {
    if (activeTab === 'upcoming') return session.status === 'upcoming'
    if (activeTab === 'past') return session.status === 'past'
    return true
  })
  
  // Handle copy session link
  const copySessionLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setSessionLinkCopied(true)
    
    setTimeout(() => {
      setSessionLinkCopied(false)
    }, 2000)
    
    toast.success('Session link copied to clipboard')
  }
  
  // Handle join session
  const joinSession = async (session: typeof sessionsData[0]) => {
    setIsJoiningSession(true)
    
    try {
      // This would call the API in a real app
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would redirect to the virtual classroom
      setShowActiveSession(true)
    } catch (error) {
      console.error('Error joining session:', error)
      toast.error('Failed to join session. Please try again.')
    } finally {
      setIsJoiningSession(false)
    }
  }
  
  // Handle create session
  const createSession = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSession.title.trim()) {
      toast.error('Session title is required')
      return
    }
    
    if (!newSession.date || !newSession.time) {
      toast.error('Date and time are required')
      return
    }
    
    if (!newSession.courseId) {
      toast.error('Please select a course')
      return
    }
    
    setIsCreatingSession(true)
    
    try {
      // This would call the API in a real app
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Live session created successfully')
      setShowCreateForm(false)
      setNewSession({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        courseId: '',
        maxAttendees: 100
      })
    } catch (error) {
      console.error('Error creating session:', error)
      toast.error('Failed to create session. Please try again.')
    } finally {
      setIsCreatingSession(false)
    }
  }
  
  // Handle new session form changes
  const handleNewSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewSession(prev => ({ ...prev, [name]: value }))
  }
  
  // End active session
  const endActiveSession = () => {
    setShowActiveSession(false)
    toast.success('Live session ended successfully')
  }
  
  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
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
  
  // If active session view is open, show the virtual classroom UI
  if (showActiveSession) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
        <div className="h-full flex flex-col">
          {/* Session header */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-1.5 bg-red-600 rounded-full animate-pulse mr-3">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-bold">{mockActiveSession.title}</h1>
                <p className="text-sm text-gray-300">{mockActiveSession.courseName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {Math.floor((Date.now() - mockActiveSession.startTime.getTime()) / 60000)} min
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">{mockActiveSession.participants} participants</span>
              </div>
              <button 
                onClick={endActiveSession}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                End Session
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 bg-gray-800 flex flex-col md:flex-row">
            {/* Video area */}
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                <div className="text-white text-center">
                  <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-medium">Your video feed would appear here</p>
                  <p className="text-sm text-gray-400 mt-2">This is a mockup of a virtual classroom interface</p>
                </div>
                
                {/* Presenter info overlay */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1.5 rounded-md flex items-center">
                  <img 
                    src={mockActiveSession.instructorAvatar} 
                    alt={mockActiveSession.instructor} 
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{mockActiveSession.instructor}</p>
                    <p className="text-xs text-gray-300">Presenter</p>
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center space-x-4">
                <button 
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-3 rounded-full ${micEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {micEnabled ? <Mic className="h-6 w-6 text-white" /> : <MicOff className="h-6 w-6 text-white" />}
                </button>
                <button 
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-3 rounded-full ${cameraEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {cameraEnabled ? <Camera className="h-6 w-6 text-white" /> : <CameraOff className="h-6 w-6 text-white" />}
                </button>
                <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                  <Share2 className="h-6 w-6 text-white" />
                </button>
                <button 
                  onClick={endActiveSession}
                  className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                >
                  End Session
                </button>
              </div>
            </div>
            
            {/* Chat and participants */}
            <div className="w-full md:w-80 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-700">
              <div className="flex border-b border-gray-700">
                <button className="flex-1 px-4 py-3 text-white font-medium border-b-2 border-blue-600">
                  Chat
                </button>
                <button className="flex-1 px-4 py-3 text-gray-400 hover:text-white">
                  Participants ({mockActiveSession.participants})
                </button>
              </div>
              
              <div className="p-4 h-[calc(100%-48px)] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <div className="flex">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Student" 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <div className="bg-gray-800 rounded-lg p-2 max-w-[80%]">
                      <p className="text-xs text-gray-400 mb-1">William Davis</p>
                      <p className="text-sm text-white">Could you explain the use case for custom hooks again?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-blue-600 rounded-lg p-2 max-w-[80%]">
                      <p className="text-xs text-blue-200 mb-1">You</p>
                      <p className="text-sm text-white">Custom hooks allow you to extract component logic into reusable functions.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <img 
                      src="https://randomuser.me/api/portraits/women/65.jpg" 
                      alt="Student" 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <div className="bg-gray-800 rounded-lg p-2 max-w-[80%]">
                      <p className="text-xs text-gray-400 mb-1">Emma Wilson</p>
                      <p className="text-sm text-white">Thanks for clarifying! That makes sense now.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Live Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400">Join webinars and virtual classes</p>
        </div>
        
        {user?.role === 'instructor' && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Session
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Create session form */}
      {showCreateForm && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Live Session</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={createSession}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newSession.title}
                  onChange={handleNewSessionChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Deep Dive into React Hooks"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newSession.description}
                  onChange={handleNewSessionChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe what you'll cover in this session..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newSession.date}
                    onChange={handleNewSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={newSession.time}
                    onChange={handleNewSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    min="15"
                    step="15"
                    value={newSession.duration}
                    onChange={handleNewSessionChange}
                    // src/app/dashboard/live-sessions/page.tsx (continued)
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    id="maxAttendees"
                    name="maxAttendees"
                    min="1"
                    value={newSession.maxAttendees}
                    onChange={handleNewSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Associated Course <span className="text-red-500">*</span>
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={newSession.courseId}
                  onChange={handleNewSessionChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a course</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-md p-3 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Live sessions will be automatically recorded and made available to enrolled students.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSession}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isCreatingSession ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Session'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {/* Session tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Upcoming Sessions
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'past'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Past Recordings
            </button>
          </nav>
        </div>
      </div>
      
      {/* Sessions list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {filteredSessions.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
          >
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No {activeTab === 'upcoming' ? 'upcoming sessions' : 'past recordings'} found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {activeTab === 'upcoming'
                ? 'Check back later for new sessions or join a course to access its scheduled webinars.'
                : 'Previous sessions will appear here after they conclude and recordings are processed.'}
            </p>
            {activeTab === 'upcoming' && user?.role === 'instructor' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Schedule a Session
              </button>
            )}
          </motion.div>
        ) : (
          filteredSessions.map((session) => (
            <motion.div
              key={session.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {session.status === 'upcoming' ? (
                        <div className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> Upcoming
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium flex items-center">
                          <Video className="mr-1 h-3 w-3" /> Recording
                        </div>
                      )}
                      <Link
                        href={`/dashboard/courses/${session.courseId}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {session.courseName}
                      </Link>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{session.title}</h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{session.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateTime(session.date)}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration} minutes
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        {session.attendees}/{session.maxAttendees} attendees
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0 lg:ml-6 flex items-center lg:flex-col">
                    <div className="flex items-center mb-0 lg:mb-4">
                      <img 
                        src={session.instructorAvatar} 
                        alt={session.instructor} 
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{session.instructor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                      </div>
                    </div>
                    
                    {session.status === 'upcoming' ? (
                      <div className="ml-auto lg:ml-0 flex lg:flex-col gap-2">
                        <button
                          onClick={() => joinSession(session)}
                          disabled={isJoiningSession}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isJoiningSession ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Joining...
                            </>
                          ) : (
                            'Join Session'
                          )}
                        </button>
                        
                        <button
                          onClick={() => copySessionLink(session.joinUrl as string)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                        >
                          {sessionLinkCopied ? (
                            <>
                              <Check className="mr-1 h-4 w-4 text-green-500" /> Copied
                            </>
                          ) : (
                            <>
                              <Link2 className="mr-1 h-4 w-4" /> Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="ml-auto lg:ml-0">
                        <Link
                          href={session.recording as string}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                        >
                          <Video className="mr-1 h-4 w-4" /> Watch Recording
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {user?.role === 'instructor' && session.status === 'upcoming' && (
                <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <Clipboard className="h-4 w-4 inline mr-1" /> Session created by you
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
      
      {/* Add to calendar prompt - only show for students with upcoming sessions */}
      {activeTab === 'upcoming' && filteredSessions.length > 0 && user?.role === 'student' && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-xl p-4 flex items-center"
        >
          <Calendar className="h-10 w-10 text-blue-500 mr-4 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Don't miss your upcoming sessions</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Add these sessions to your calendar to get reminders before they start.
            </p>
          </div>
          <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Add to Calendar
          </button>
        </motion.div>
      )}
    </div>
  )
}
                    