// src/app/dashboard/certificates/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Download, ExternalLink, Search, Share2, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock data for certificates
const certificatesData = [
  {
    id: '1',
    title: 'Introduction to React 19',
    courseId: '1',
    issueDate: '2025-03-02',
    instructor: 'Jane Smith',
    grade: 92,
    hours: 45,
    skills: ['React Hooks', 'Component Patterns', 'State Management', 'Modern JavaScript'],
    image: 'https://via.placeholder.com/1000x700?text=React+Certificate'
  },
  {
    id: '2',
    title: 'Next.js 15 for Production',
    courseId: '4',
    issueDate: '2025-02-15',
    instructor: 'Mike Wilson',
    grade: 88,
    hours: 60,
    skills: ['Server Components', 'App Router', 'API Routes', 'Deployment Strategies'],
    image: 'https://via.placeholder.com/1000x700?text=Next.js+Certificate'
  }
]

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null)
  
  // Filter certificates based on search query
  const filteredCertificates = certificatesData.filter(certificate => 
    certificate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
        <p className="text-gray-600 dark:text-gray-400">Your achievements and credentials</p>
      </motion.div>
      
      {/* Search filter */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search certificates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>
      
      {selectedCertificate ? (
        // Certificate detail view
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <button 
              onClick={() => setSelectedCertificate(null)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm flex items-center"
            >
              ← Back to certificates
            </button>
            
            <div className="flex space-x-3">
              <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </button>
              <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <Download className="h-4 w-4 mr-1" /> Download
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Certificate image */}
            <div className="mb-6 flex justify-center">
              <img 
                src={certificatesData.find(cert => cert.id === selectedCertificate)?.image} 
                alt="Certificate" 
                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
              />
            </div>
            
            {/* Certificate details */}
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {certificatesData.find(cert => cert.id === selectedCertificate)?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Instructor: {certificatesData.find(cert => cert.id === selectedCertificate)?.instructor}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Issue Date
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {certificatesData.find(cert => cert.id === selectedCertificate)?.issueDate}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Award className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Final Grade
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {certificatesData.find(cert => cert.id === selectedCertificate)?.grade}%
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Course Hours
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {certificatesData.find(cert => cert.id === selectedCertificate)?.hours} hours
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {certificatesData
                    .find(cert => cert.id === selectedCertificate)
                    ?.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  }
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/dashboard/courses/${certificatesData.find(cert => cert.id === selectedCertificate)?.courseId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go to Course <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Certificates grid
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredCertificates.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
            >
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No certificates found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Complete courses to earn certificates and showcase your skills.
              </p>
              <Link
                href="/dashboard/courses"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Courses
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCertificates.map((certificate) => (
                <motion.div
                  key={certificate.id}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => setSelectedCertificate(certificate.id)}
                  >
                    <img 
                      src={certificate.image} 
                      alt={certificate.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-white rounded-md text-gray-900 font-medium text-sm">
                        View Certificate
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{certificate.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instructor: {certificate.instructor}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {certificate.issueDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Award className="h-4 w-4 mr-1 text-amber-500" />
                        Grade: {certificate.grade}%
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-between items-center">
                      <button 
                        onClick={() => setSelectedCertificate(certificate.id)}
                        className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                      >
                        View Details
                      </button>
                      <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <Download className="h-4 w-4 mr-1" /> Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}