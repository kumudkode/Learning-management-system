import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Circle, Clock, Calendar, Trophy, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '../ui/buttons/Button';
import PropTypes from 'prop-types';

const ProgressTracker = ({ 
  courseId,
  userId,
  onContinue,
  showDetailedStats = true 
}) => {
  const [progress, setProgress] = useState({
    overall: 0,
    modulesCompleted: 0,
    totalModules: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
    quizzesCompleted: 0,
    totalQuizzes: 0,
    assignmentsCompleted: 0,
    totalAssignments: 0,
    lastActivityDate: null,
    totalTimeSpent: 0,
    nextLesson: null,
    estimatedCompletion: null,
    certificates: [],
    modules: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch progress data
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `/api/courses/${courseId}/progress${userId ? `?userId=${userId}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Progress data not found');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view this progress data');
          } else {
            throw new Error('Failed to fetch progress data');
          }
        }
        
        const data = await response.json();
        setProgress(data);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err.message || 'An error occurred while fetching progress data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [courseId, userId, retryCount]);
  
  // Handlers
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  const handleContinueLearning = () => {
    if (progress.nextLesson && onContinue) {
      onContinue(progress.nextLesson);
    }
  };
  
  // Helper functions
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const formatEstimatedCompletion = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(date - now);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays < 7) return `${diffDays} days`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
      return `${Math.ceil(diffDays / 30)} months`;
    } catch (e) {
      return 'Unknown';
    }
  };
  
  // Memoized values
  const progressPercentage = useMemo(() => {
    return Math.min(Math.round(progress.overall || 0), 100);
  }, [progress.overall]);
  
  // Loading state
  if (loading) {
    return (
      <div className="progress-tracker-loading p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full bg-gray-200"></div>
        </div>
        <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="progress-tracker-error p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={32} />
        <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Progress</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outlined" onClick={handleRetry} size="sm">
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="progress-tracker bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="progress-overview p-6 border-b">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="progress-circle-container mb-4 sm:mb-0 flex flex-col items-center">
            <div className="progress-circle relative h-32 w-32">
              <svg viewBox="0 0 36 36" className="h-full w-full">
                <circle 
                  className="circle-bg stroke-current text-gray-200" 
                  fill="none" 
                  strokeWidth="3"
                  cx="18" 
                  cy="18" 
                  r="16"
                />
                <circle 
                  className="circle stroke-current text-primary"
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                  cx="18"
                  cy="18"
                  r="16"
                />
              </svg>
              <div className="progress-percentage absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{progressPercentage}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
            </div>
            <div className="progress-label text-center mt-2 font-medium">
              {progressPercentage === 100 ? 'Course Completed!' : 'Course Progress'}
            </div>
          </div>
          
          {progress.nextLesson && (
            <div className="continue-learning p-4 border rounded-lg bg-gray-50 flex-1 max-w-sm ml-0 sm:ml-6">
              <h3 className="text-lg font-medium mb-1">Continue Learning</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{progress.nextLesson.title}</p>
              <Button 
                variant="primary" 
                onClick={handleContinueLearning}
                fullWidth
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {showDetailedStats && (
        <div className="progress-details p-6">
          <div className="progress-stats grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="stat-item p-3 bg-gray-50 rounded-lg">
              <div className="stat-icon mb-1 text-primary">
                <BookOpen size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label text-sm text-gray-500">Lessons</div>
                <div className="stat-value font-semibold">
                  {progress.lessonsCompleted}/{progress.totalLessons}
                </div>
              </div>
            </div>
            
            <div className="stat-item p-3 bg-gray-50 rounded-lg">
              <div className="stat-icon mb-1 text-purple-500">
                <CheckCircle size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label text-sm text-gray-500">Quizzes</div>
                <div className="stat-value font-semibold">
                  {progress.quizzesCompleted}/{progress.totalQuizzes}
                </div>
              </div>
            </div>
            
            <div className="stat-item p-3 bg-gray-50 rounded-lg">
              <div className="stat-icon mb-1 text-blue-500">
                <Clock size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label text-sm text-gray-500">Time Spent</div>
                <div className="stat-value font-semibold">{formatTime(progress.totalTimeSpent)}</div>
              </div>
            </div>
            
            <div className="stat-item p-3 bg-gray-50 rounded-lg">
              <div className="stat-icon mb-1 text-amber-500">
                <Calendar size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label text-sm text-gray-500">Last Activity</div>
                <div className="stat-value font-semibold">{formatDate(progress.lastActivityDate)}</div>
              </div>
            </div>
          </div>
          
          <div className="completion-estimate flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-6">
            <Trophy size={20} className="text-amber-500 mr-2" />
            <span className="text-gray-700">
              Estimated completion: <span className="font-medium">{formatEstimatedCompletion(progress.estimatedCompletion)}</span>
            </span>
          </div>
          
          <div className="modules-progress mb-6">
            <h3 className="text-lg font-medium mb-3">Module Progress</h3>
            <div className="modules-list space-y-3">
              {progress.modules && progress.modules.map(module => (
                <div key={module.id} className="module-progress-item">
                  <div className="module-progress-header flex justify-between items-center mb-1">
                    <span className="module-title text-sm">{module.title}</span>
                    <span className="module-completion text-sm font-medium">
                      {module.completed ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          Completed
                        </span>
                      ) : (
                        `${Math.round(module.progress)}%`
                      )}
                    </span>
                  </div>
                  <div className="module-progress-bar h-1.5 bg-gray-200 rounded-full">
                    <div 
                      className={`progress-fill h-full rounded-full ${module.completed ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${module.progress}%` }}
                      aria-valuenow={module.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              ))}
              
              {(!progress.modules || progress.modules.length === 0) && (
                <div className="text-center p-4 text-gray-500">
                  No module progress data available
                </div>
              )}
            </div>
          </div>
          
          {progress.certificates && progress.certificates.length > 0 && (
            <div className="certificates">
              <h3 className="text-lg font-medium mb-3">Certificates</h3>
              <div className="certificates-list space-y-3">
                {progress.certificates.map(cert => (
                  <div key={cert.id} className="certificate-item flex justify-between items-center p-3 border rounded-lg">
                    <div className="certificate-info">
                      <div className="certificate-name font-medium">{cert.name}</div>
                      <div className="certificate-date text-sm text-gray-500">Earned on {formatDate(cert.dateEarned)}</div>
                    </div>
                    <Button variant="outlined" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ProgressTracker.propTypes = {
  courseId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  onContinue: PropTypes.func,
  showDetailedStats: PropTypes.bool
};

export default ProgressTracker;