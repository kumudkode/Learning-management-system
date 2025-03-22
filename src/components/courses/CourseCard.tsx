// src/components/courses/CourseCard.tsx
'use client'

import Link from 'next/link'
import { Clock, BookOpen, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface CourseCardProps {
  id: string
  title: string
  description: string
  instructor: string
  image: string
  duration: number
  lessons: number
  level: 'beginner' | 'intermediate' | 'advanced'
  rating?: number
  enrolled?: number
  progress?: number
  isFeatured?: boolean
}

export default function CourseCard({
  id,
  title,
  description,
  instructor,
  image,
  duration,
  lessons,
  level,
  rating = 0,
  enrolled = 0,
  progress = 0,
  isFeatured = false
}: CourseCardProps) {
  // Color based on level
  const levelColor = {
    'beginner': 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
    'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300',
    'advanced': 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300',
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      className={`rounded-xl overflow-hidden bg-white dark:bg-gray-800 border ${
        isFeatured ? 'border-blue-200 dark:border-blue-800' : 'border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColor[level]}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <Link href={`/dashboard/courses/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>By {instructor}</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>{duration} hrs</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
              <span>{lessons} lessons</span>
            </div>
          </div>
          
          {rating > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {enrolled > 0 && (
          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4 mr-1" />
            <span>{enrolled.toLocaleString()} students enrolled</span>
          </div>
        )}
        
        {progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-300">Your progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="mt-5">
          <Link 
            href={`/dashboard/courses/${id}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}