// src/app/dashboard/calendar/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Clock, FileText, BookOpen, Calendar } from 'lucide-react'

// Mock data for calendar events
const events = [
  {
    id: '1',
    title: 'TypeScript Patterns Quiz Due',
    type: 'assignment',
    date: '2025-03-22',
    time: '23:59',
    course: 'Advanced TypeScript Patterns',
    color: 'red'
  },
  {
    id: '2',
    title: 'React 19 Live Session',
    type: 'live-session',
    date: '2025-03-20',
    time: '14:00',
    duration: 60,
    course: 'Introduction to React 19',
    color: 'blue'
  },
  {
    id: '3',
    title: 'UI Component Library Due',
    type: 'assignment',
    date: '2025-03-28',
    time: '23:59',
    course: 'Tailwind CSS 4 Masterclass',
    color: 'red'
  },
  {
    id: '4',
    title: 'MongoDB Office Hours',
    type: 'office-hours',
    date: '2025-03-25',
    time: '16:00',
    duration: 90,
    course: 'MongoDB and Mongoose Mastery',
    color: 'purple'
  },
  {
    id: '5',
    title: 'Next.js Deployment Workshop',
    type: 'workshop',
    date: '2025-03-24',
    time: '10:00',
    duration: 120,
    course: 'Next.js 15 for Production',
    color: 'green'
  }
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  // Helper functions for calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }
  
  // Calendar generation
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  
  // Generate days of the month
  const days = []
  // Add empty slots for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  // Check if a day has events
  const getEventsForDay = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateString)
  }
  
  // Get selected day events
  const selectedDayEvents = selectedDate 
    ? events.filter(event => event.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))
    : []
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Calendar</h1>
        <p className="text-gray-600 dark:text-gray-400">Schedule and manage your learning events</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div 
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Calendar header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{monthName} {year}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={goToPreviousMonth}
                className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Today
              </button>
              <button 
                onClick={goToNextMonth}
                className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 dark:text-gray-400 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }
                
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isToday = new Date().toISOString().split('T')[0] === dateString
                const isSelected = dateString === selectedDate
                const dayEvents = getEventsForDay(day)
                
                return (
                  <motion.button
                    key={`day-${day}`}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(dateString)}
                    className={`aspect-square relative p-2 rounded-lg ${
                      isSelected 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : isToday 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={`text-sm ${
                      isToday || isSelected 
                          ? 'font-semibold text-blue-700 dark:text-blue-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {day}
                      </span>
                      
                      {/* Event indicators */}
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 inset-x-0 flex justify-center space-x-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div 
                              key={event.id} 
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.color === 'red' ? 'bg-red-500' :
                                event.color === 'blue' ? 'bg-blue-500' :
                                event.color === 'green' ? 'bg-green-500' :
                                event.color === 'purple' ? 'bg-purple-500' :
                                'bg-gray-500'
                              }`}
                            />
                          ))}
                          {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
          
          {/* Events panel */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Upcoming Events'
                }
              </h2>
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <Plus size={16} />
              </button>
            </div>
            
            {selectedDayEvents.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {selectedDayEvents.map(event => (
                  <motion.div 
                    key={event.id}
                    variants={itemVariants}
                    className={`p-3 rounded-lg border-l-4 ${
                      event.type === 'assignment' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 
                      event.type === 'live-session' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
                      event.type === 'workshop' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                      'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.course}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {event.time}
                        {event.duration ? ` (${event.duration} min)` : ''}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : !selectedDate ? (
              // Show upcoming events when no date is selected
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {events
                  .filter(event => new Date(event.date) > new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 4)
                  .map(event => (
                    <motion.div 
                      key={event.id}
                      variants={itemVariants}
                      className={`p-3 rounded-lg border-l-4 ${
                        event.type === 'assignment' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 
                        event.type === 'live-session' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
                        event.type === 'workshop' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                        'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}
                      </p>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.course}</div>
                    </motion.div>
                  ))
                }
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">No events scheduled for this day</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Event
                </button>
              </div>
            )}
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Event Types</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assignment Due</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Live Session</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Workshop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Office Hours</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }