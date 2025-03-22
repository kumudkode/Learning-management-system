// src/app/dashboard/courses/create/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, Plus, Trash2, Upload, X, Check, Clock, Folder, 
  FileText, HelpCircle, AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'

interface ModuleItem {
  id: string
  title: string
  type: 'video' | 'article' | 'quiz' | 'assignment'
  duration?: number
  content?: string
  expanded?: boolean
}

interface CourseModule {
  id: string
  title: string
  expanded: boolean
  items: ModuleItem[]
}

export default function CreateCoursePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isPublishing, setIsPublishing] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  
  // Form states
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    estimatedDuration: '',
    language: 'English'
  })
  
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'm1',
      title: 'Module 1: Introduction',
      expanded: true,
      items: [
        { id: 'i1', title: 'Welcome to the Course', type: 'video', duration: 10, expanded: false },
        { id: 'i2', title: 'Course Overview', type: 'article', expanded: false }
      ]
    }
  ])
  
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
  
  // if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
  //   return null
  // }
  
  // Handle basic info change
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBasicInfo(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setCoverImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Add new module
  const addNewModule = () => {
    const newModule: CourseModule = {
      id: `m${modules.length + 1}`,
      title: `Module ${modules.length + 1}: New Module`,
      expanded: true,
      items: []
    }
    setModules([...modules, newModule])
  }
  
  // Update module title
  const updateModuleTitle = (moduleId: string, newTitle: string) => {
    setModules(
      modules.map(module => 
        module.id === moduleId 
          ? { ...module, title: newTitle } 
          : module
      )
    )
  }
  
  // Toggle module expanded state
  const toggleModuleExpanded = (moduleId: string) => {
    setModules(
      modules.map(module => 
        module.id === moduleId 
          ? { ...module, expanded: !module.expanded } 
          : module
      )
    )
  }
  
  // Add new content item to module
  const addContentItem = (moduleId: string, type: ModuleItem['type']) => {
    setModules(
      modules.map(module => {
        if (module.id === moduleId) {
          const newItem: ModuleItem = {
            id: `i${Date.now()}`,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            type,
            expanded: true,
            ...(type === 'video' ? { duration: 0 } : {})
          }
          return { ...module, items: [...module.items, newItem] }
        }
        return module
      })
    )
  }
  
  // Update content item
  const updateContentItem = (moduleId: string, itemId: string, updates: Partial<ModuleItem>) => {
    setModules(
      modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            items: module.items.map(item => 
              item.id === itemId 
                ? { ...item, ...updates } 
                : item
            )
          }
        }
        return module
      })
    )
  }
  
  // Delete content item
  const deleteContentItem = (moduleId: string, itemId: string) => {
    setModules(
      modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            items: module.items.filter(item => item.id !== itemId)
          }
        }
        return module
      })
    )
  }
  
  // Delete module
  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId))
  }
  
  // Validate current step
  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!basicInfo.title.trim()) {
        toast.error('Course title is required')
        return false
      }
      if (!basicInfo.description.trim()) {
        toast.error('Course description is required')
        return false
      }
      if (!basicInfo.category) {
        toast.error('Category is required')
        return false
      }
    } else if (currentStep === 2) {
      if (modules.length === 0) {
        toast.error('At least one module is required')
        return false
      }
      
      for (const module of modules) {
        if (!module.title.trim()) {
          toast.error('Module titles cannot be empty')
          return false
        }
        
        if (module.items.length === 0) {
          toast.error(`${module.title} must have at least one content item`)
          return false
        }
        
        for (const item of module.items) {
          if (!item.title.trim()) {
            toast.error('All content items must have titles')
            return false
          }
        }
      }
    }
    
    return true
  }
  
  // Move to next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }
  
  // Move to previous step
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }
  
  // Publish course
  const publishCourse = async () => {
    if (!validateCurrentStep()) return
    
    setIsPublishing(true)
    
    try {
      // This would call the API in a real app
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Course published successfully!')
      router.push('/dashboard/courses')
    } catch (error) {
      console.error('Error publishing course:', error)
      toast.error('Failed to publish course. Please try again.')
    } finally {
      setIsPublishing(false)
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
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
        <p className="text-gray-600 dark:text-gray-400">Publish your knowledge and expertise</p>
      </motion.div>
      
      {/* Progress steps */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center">
          <div className="flex items-center relative">
            <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${
              currentStep >= 1 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              <span className="font-bold text-sm">1</span>
            </div>
            <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
              <span className={currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}>Basic Info</span>
            </div>
          </div>
          <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
            currentStep >= 2 ? 'border-blue-600' : 'border-gray-300 dark:border-gray-600'
          }`}></div>
          <div className="flex items-center relative">
            <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${
              currentStep >= 2 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              <span className="font-bold text-sm">2</span>
            </div>
            <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
              <span className={currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}>Course Content</span>
            </div>
          </div>
          <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
            currentStep >= 3 ? 'border-blue-600' : 'border-gray-300 dark:border-gray-600'
          }`}></div>
          <div className="flex items-center relative">
            <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${
              currentStep >= 3 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              <span className="font-bold text-sm">3</span>
            </div>
            <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
              <span className={currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}>Review & Publish</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-xl font-semibold text-gray-900 dark:text-white mb-6"
          >
            Basic Information
          </motion.h2>
          
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={basicInfo.title}
              onChange={handleBasicInfoChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Advanced JavaScript for Developers"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={basicInfo.description}
              onChange={handleBasicInfoChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe what students will learn in this course..."
              required
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {basicInfo.description.length}/500 characters (minimum 100 recommended)
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={basicInfo.category}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="fullstack">Full Stack Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="data-science">Data Science</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="game-dev">Game Development</option>
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                id="level"
                name="level"
                value={basicInfo.level}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={basicInfo.price}
                  onChange={handleBasicInfoChange}
                  className="w-full pl-7 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00 (free)"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Leave empty or set to 0 for a free course
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Duration (hours)
              </label>
              <input
                type="number"
                id="estimatedDuration"
                name="estimatedDuration"
                min="0"
                step="0.5"
                value={basicInfo.estimatedDuration}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 12.5"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                id="language"
                name="language"
                value={basicInfo.language}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Hindi">Hindi</option>
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                {coverImage ? (
                  <div className="relative w-full">
                    <img 
                      src={coverImage} 
                      alt="Course cover" 
                      className="max-h-32 mx-auto rounded"
                    />
                    <button
                      onClick={() => setCoverImage(null)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="mt-8 flex justify-end">
            <button
              onClick={goToNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next: Course Content
            </button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Step 2: Course Content */}
      {currentStep === 2 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Structure</h2>
              
              <button
                onClick={addNewModule}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Module
              </button>
            </div>
            
            <div className="space-y-6">
              {modules.map((module, index) => (
                <div 
                  key={module.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => toggleModuleExpanded(module.id)}
                        className="text-gray-500 dark:text-gray-400 mr-2"
                      >
                        {module.expanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                        className="flex-1 font-medium text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 focus:outline-none p-0"
                        placeholder="Module Title"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => deleteModule(module.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                        title="Delete module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {module.expanded && (
                    <div className="p-4">
                      {module.items.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <Folder className="h-8 w-8 mx-auto mb-2" />
                          <p>No content items yet.</p>
                          <p className="text-sm">Add videos, articles, quizzes or assignments below.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.items.map((item, itemIndex) => (
                            <div
                              key={item.id}
                              className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {/* {item.type === 'video' && <Play className="h-4 w-4 text-blue-500 mr-2" />} */}
                                  {item.type === 'article' && <FileText className="h-4 w-4 text-green-500 mr-2" />}
                                  {item.type === 'quiz' && <HelpCircle className="h-4 w-4 text-purple-500 mr-2" />}
                                  {item.type === 'assignment' && <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />}
                                  
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateContentItem(module.id, item.id, { title: e.target.value })}
                                    className="flex-1 font-medium text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 focus:outline-none p-0"
                                    placeholder={`${item.type.charAt(0).toUpperCase()}${item.type.slice(1)} Title`}
                                  />
                                </div>
                                
                                <div className="flex items-center">
                                  {item.type === 'video' && (
                                    <div className="flex items-center mr-3 text-sm text-gray-500 dark:text-gray-400">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <input
                                        type="number"
                                        min="0"
                                        className="w-12 bg-transparent border-0 focus:ring-0 focus:outline-none p-0"
                                        value={item.duration || 0}
                                        onChange={(e) => updateContentItem(module.id, item.id, { duration: parseInt(e.target.value) || 0 })}
                                      />
                                      <span className="ml-1">min</span>
                                    </div>
                                  )}
                                  
                                  <button
                                    onClick={() => deleteContentItem(module.id, item.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                                    title="Delete item"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {(item.type === 'article' || item.type === 'quiz' || item.type === 'assignment') && (
                                <div className="mt-3">
                                  <textarea
                                    value={item.content || ''}
                                    onChange={(e) => updateContentItem(module.id, item.id, { content: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder={`Enter ${item.type} content...`}
                                    rows={3}
                                  ></textarea>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-center space-x-2">
                        <button
                          onClick={() => addContentItem(module.id, 'video')}
                          className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/20"
                        >
                          <Plus className="h-4 w-4 inline mr-1" /> Video
                        </button>
                        <button
                          onClick={() => addContentItem(module.id, 'article')}
                          className="px-3 py-1.5 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-800/20"
                        >
                          <Plus className="h-4 w-4 inline mr-1" /> Article
                        </button>
                        <button
                          onClick={() => addContentItem(module.id, 'quiz')}
                          className="px-3 py-1.5 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-800/20"
                        >
                          <Plus className="h-4 w-4 inline mr-1" /> Quiz
                        </button>
                        <button
                          onClick={() => addContentItem(module.id, 'assignment')}
                          className="px-3 py-1.5 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md hover:bg-amber-100 dark:hover:bg-amber-800/20"
                        >
                          <Plus className="h-4 w-4 inline mr-1" /> Assignment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {modules.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Folder className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No modules yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding a module to your course</p>
                  <button
                    onClick={addNewModule}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Your First Module
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back: Basic Info
            </button>
            <button
              onClick={goToNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next: Review & Publish
            </button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Step 3: Review & Publish */}
      {currentStep === 3 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Review Course</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Basic Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                      <p className="font-medium text-gray-900 dark:text-white">{basicInfo.title || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">{basicInfo.category || "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{basicInfo.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                      <p className="font-medium text-gray-900 dark:text-white">{basicInfo.language}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {basicInfo.price ? `$${basicInfo.price}` : "Free"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {basicInfo.estimatedDuration ? `${basicInfo.estimatedDuration} hours` : "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                    <p className="font-medium text-gray-900 dark:text-white">{basicInfo.description || "Not provided"}</p>
                  </div>
                  
                  {coverImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cover Image</p>
                      <img 
                        src={coverImage} 
                        alt="Course cover" 
                        className="mt-2 max-h-40 rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Course Content</h3>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                  {modules.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No modules added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {modules.map((module, index) => (
                        <div key={module.id}>
                          <p className="font-medium text-gray-900 dark:text-white">{module.title}</p>
                          {module.items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 ml-4 mt-1">No content items added.</p>
                          ) : (
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                              {module.items.map((item, itemIndex) => (
                                <li key={item.id} className="text-sm text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">{item.title}</span>
                                  {item.type === 'video' && item.duration && (
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                      ({item.duration} min)
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 capitalize">
                                    {item.type}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Before publishing</h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Make sure your course title and description are clear and reflect the content</li>
                      <li>Check that all modules and content items are properly titled and organized</li>
                      <li>Verify your pricing strategy is appropriate for your target audience</li>
                      <li>Ensure you've added sufficient content to provide value to your students</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back: Course Content
            </button>
            <button
              onClick={publishCourse}
              disabled={isPublishing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Publish Course
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}