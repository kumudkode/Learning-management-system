import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Calendar, Trophy, BookOpen } from 'lucide-react';
import { Button } from '../ui/buttons/Button';

export default function ProgressTracker({ 
  courseId, 
  userId,
  onContinue,
  showDetailedStats = true
}) {
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
    certificates: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/progress${userId ? `?userId=${userId}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch progress data');
        
        const data = await response.json();
        setProgress(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [courseId, userId]);
  
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatEstimatedCompletion = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };
  
  if (loading) {
    return <div className="progress-tracker-loading">Loading progress...</div>;
  }
  
  if (error) {
    return <div className="progress-tracker-error">Error: {error}</div>;
  }
  
  return (
    <div className="progress-tracker">
      <div className="progress-overview">
        <div className="progress-circle-container">
          <div className="progress-circle">
            <svg viewBox="0 0 36 36">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${progress.overall}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="progress-percentage">{Math.round(progress.overall)}%</div>
          </div>
          <div className="progress-label">Course Completion</div>
        </div>
        
        {progress.nextLesson && (
          <div className="continue-learning">
            <h3>Continue Learning</h3>
            <p>{progress.nextLesson.title}</p>
            <Button 
              variant="primary" 
              onClick={() => onContinue(progress.nextLesson)}
              fullWidth
            >
              Continue
            </Button>
          </div>
        )}
      </div>
      
      {showDetailedStats && (
        <div className="progress-details">
          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <BookOpen size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Lessons</div>
                <div className="stat-value">
                  {progress.lessonsCompleted}/{progress.totalLessons}
                </div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <CheckCircle size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Quizzes</div>
                <div className="stat-value">
                  {progress.quizzesCompleted}/{progress.totalQuizzes}
                </div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <Clock size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Time Spent</div>
                <div className="stat-value">{formatTime(progress.totalTimeSpent)}</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <Calendar size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Last Activity</div>
                <div className="stat-value">{formatDate(progress.lastActivityDate)}</div>
              </div>
            </div>
          </div>
          
          <div className="completion-estimate">
            <Trophy size={20} />
            <span>
              Estimated completion: {formatEstimatedCompletion(progress.estimatedCompletion)}
            </span>
          </div>
          
          <div className="modules-progress">
            <h3>Module Progress</h3>
            <div className="modules-list">
              {progress.modules && progress.modules.map(module => (
                <div key={module.id} className="module-progress-item">
                  <div className="module-progress-header">
                    <span className="module-title">{module.title}</span>
                    <span className="module-completion">
                      {module.completed ? (
                        <CheckCircle size={16} className="completed-icon" />
                      ) : (
                        `${Math.round(module.progress)}%`
                      )}
                    </span>
                  </div>
                  <div className="module-progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {progress.certificates && progress.certificates.length > 0 && (
            <div className="certificates">
              <h3>Certificates</h3>
              <div className="certificates-list">
                {progress.certificates.map(cert => (
                  <div key={cert.id} className="certificate-item">
                    <div className="certificate-info">
                      <div className="certificate-name">{cert.name}</div>
                      <div className="certificate-date">Earned on {formatDate(cert.dateEarned)}</div>
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
}

// Sample progress data for Full Stack Web Development Course
export const fullStackProgressData = {
  overall: 62,
  modulesCompleted: 2,
  totalModules: 5,
  lessonsCompleted: 15,
  totalLessons: 25,
  quizzesCompleted: 3,
  totalQuizzes: 5,
  assignmentsCompleted: 2,
  totalAssignments: 5,
  lastActivityDate: "2025-03-25T14:30:00Z",
  totalTimeSpent: 840, // 14 hours in minutes
  nextLesson: {
    id: "less3-3",
    title: "RESTful API Design",
    moduleId: "mod3",
    type: "video"
  },
  estimatedCompletion: "2025-04-15T00:00:00Z",
  certificates: [],
  modules: [
    {
      id: "mod1",
      title: "Frontend Fundamentals",
      progress: 100,
      completed: true
    },
    {
      id: "mod2",
      title: "React.js Development",
      progress: 100,
      completed: true
    },
    {
      id: "mod3",
      title: "Backend Development with Node.js",
      progress: 40,
      completed: false
    },
    {
      id: "mod4",
      title: "Database Integration",
      progress: 0,
      completed: false
    },
    {
      id: "mod5",
      title: "Full Stack Integration",
      progress: 0,
      completed: false
    }
  ]
};