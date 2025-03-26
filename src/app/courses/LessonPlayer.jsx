import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, Video, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '../ui/buttons/Button';
import { Tabs, TabList, Tab, TabPanel } from '../ui/tabs/Tabs';
import VideoPlayer from '../media/VideoPlayer';
import TextContent from './TextContent';
import QuizPlayer from '../assessment/QuizPlayer';
import DiscussionForum from '../discussions/DiscussionForum';
import AssignmentSubmission from '../assessment/AssignmentSubmission';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const LessonPlayer = ({ 
  lesson, 
  course, 
  module,
  onComplete, 
  onNavigate,
  isCompleted = false
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [isLoading, setIsLoading] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(isCompleted ? 'completed' : 'in-progress');
  const [nextLesson, setNextLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Validate required props
  if (!lesson || !course) {
    console.error('LessonPlayer missing required props');
    return <div className="error-state">Error: Lesson data unavailable</div>;
  }
  
  useEffect(() => {
    // Find previous and next lessons for navigation
    if (course && module) {
      try {
        const allLessons = [];
        
        // Flatten all lessons from all modules into a single array with module info
        course.modules.forEach(mod => {
          if (mod.lessons && Array.isArray(mod.lessons)) {
            mod.lessons.forEach(les => {
              allLessons.push({
                ...les,
                moduleId: mod.id,
                moduleTitle: mod.title
              });
            });
          }
        });
        
        // Sort lessons by their overall order
        allLessons.sort((a, b) => a.order - b.order);
        
        // Find current lesson index
        const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
        
        if (currentIndex > 0) {
          setPrevLesson(allLessons[currentIndex - 1]);
        }
        
        if (currentIndex < allLessons.length - 1) {
          setNextLesson(allLessons[currentIndex + 1]);
        }
      } catch (err) {
        console.error('Error processing course lessons:', err);
      }
    }
    
    // Load lesson progress from API
    const fetchProgress = async () => {
      if (!user || !lesson.id || !course.id) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/courses/${course.id}/lessons/${lesson.id}/progress`);
        if (response.ok) {
          const data = await response.json();
          setLessonProgress(data.progress || 0);
          setCurrentStatus(data.completed ? 'completed' : 'in-progress');
        }
      } catch (error) {
        console.error('Error fetching lesson progress:', error);
        setError('Failed to load lesson progress');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgress();
    
    // Reset current status when lesson changes
    setCurrentStatus(isCompleted ? 'completed' : 'in-progress');
    
  }, [course, module, lesson, user, isCompleted]);
  
  // Handle lesson completion
  const handleMarkComplete = useCallback(async () => {
    if (!user || !course.id || !lesson.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to track your progress',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${course.id}/lessons/${lesson.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark lesson as complete');
      }
      
      setCurrentStatus('completed');
      setLessonProgress(100);
      
      // Call the parent component's onComplete handler
      if (onComplete) {
        onComplete(lesson.id);
      }
      
      toast({
        title: 'Lesson completed',
        description: nextLesson ? 'Continue to the next lesson' : 'Module completed',
        type: 'success'
      });
      
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [course.id, lesson.id, nextLesson, onComplete, toast, user]);
  
  // Handle navigation to next/prev lessons
  const handleNavigate = useCallback((lessonData) => {
    if (!lessonData) return;
    
    if (onNavigate) {
      onNavigate(lessonData);
    } else {
      router.push(`/courses/${course.id}/lessons/${lessonData.id}`);
    }
  }, [course.id, onNavigate, router]);
  
  // Handle media progress updates
  const handleProgressUpdate = useCallback(({ progressPercent }) => {
    setLessonProgress(progressPercent);
    
    // Auto-complete lesson if they've watched 90% of the video
    if (progressPercent >= 90 && currentStatus !== 'completed') {
      handleMarkComplete();
    }
  }, [currentStatus, handleMarkComplete]);
  
  // Get icon for lesson type
  const getLessonTypeIcon = useCallback(() => {
    switch (lesson.type) {
      case 'video': return <Video size={16} />;
      case 'text': return <FileText size={16} />;
      case 'quiz': return <span>❓</span>;
      case 'discussion': return <MessageSquare size={16} />;
      case 'assignment': return <span>📝</span>;
      default: return <BookOpen size={16} />;
    }
  }, [lesson.type]);
  
  if (error) {
    return (
      <div className="lesson-error p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Lesson</h2>
        <p className="text-red-600">{error}</p>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="lesson-player">
      <div className="lesson-header mb-6 border-b pb-4">
        <div className="lesson-meta flex justify-between items-center">
          <div>
            <div className="lesson-type flex items-center text-sm text-gray-500 mb-1">
              {getLessonTypeIcon()}
              <span className="ml-1">{lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}</span>
            </div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
          
          <div className="lesson-status">
            {currentStatus === 'completed' ? (
              <span className="completed-status flex items-center text-green-600">
                <CheckCircle size={16} className="mr-1" />
                Completed
              </span>
            ) : (
              <span className="progress-status flex items-center">
                <div className="progress-circle relative mr-2">
                  <svg width="24" height="24" viewBox="0 0 36 36" className="progress-ring">
                    <circle 
                      className="progress-ring-bg"
                      stroke="#e6e6e6" 
                      strokeWidth="3" 
                      fill="transparent" 
                      r="16" 
                      cx="18" 
                      cy="18"
                    />
                    <circle 
                      className="progress-ring-circle" 
                      stroke="#4f46e5" 
                      strokeWidth="3" 
                      fill="transparent" 
                      r="16" 
                      cx="18" 
                      cy="18"
                      strokeDasharray={`${16 * 2 * Math.PI}`}
                      strokeDashoffset={`${16 * 2 * Math.PI * (1 - lessonProgress / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="progress-percentage absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {Math.round(lessonProgress)}%
                  </span>
                </div>
                <span className="text-sm text-gray-600">In Progress</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="lesson-content mb-8">
        <Tabs selectedTab={activeTab} onChange={setActiveTab}>
          <TabList className="border-b mb-6">
            <Tab id="content">Content</Tab>
            {lesson.hasDiscussion && <Tab id="discussion">Discussion</Tab>}
            {lesson.hasResources && <Tab id="resources">Resources</Tab>}
            {lesson.hasNotes && <Tab id="notes">Notes</Tab>}
          </TabList>
          
          <TabPanel id="content">
            {isLoading && (
              <div className="loading-state py-12 text-center">
                <div className="spinner mb-4"></div>
                <p>Loading lesson content...</p>
              </div>
            )}
            
            {!isLoading && lesson.type === 'video' && (
              <VideoPlayer
                src={lesson.videoUrl}
                poster={lesson.posterImage}
                title={lesson.title}
                courseId={course.id}
                lessonId={lesson.id}
                onProgress={handleProgressUpdate}
              />
            )}
            
            {!isLoading && lesson.type === 'text' && (
              <TextContent
                content={lesson.content}
                courseId={course.id}
                lessonId={lesson.id}
                onProgress={handleProgressUpdate}
              />
            )}
            
            {!isLoading && lesson.type === 'quiz' && (
              <QuizPlayer
                quiz={lesson.quiz}
                onComplete={(results) => {
                  handleMarkComplete();
                  // Additional logic for quiz completion
                }}
              />
            )}
            
            {!isLoading && lesson.type === 'assignment' && (
              <AssignmentSubmission
                assignment={lesson.assignment}
                courseId={course.id}
              />
            )}
            
            {lesson.description && (
              <div className="lesson-description mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">About This Lesson</h3>
                <p className="text-gray-700">{lesson.description}</p>
              </div>
            )}
          </TabPanel>
          
          {lesson.hasDiscussion && (
            <TabPanel id="discussion">
              <DiscussionForum
                courseId={course.id}
                lessonId={lesson.id}
              />
            </TabPanel>
          )}
          
          {lesson.hasResources && (
            <TabPanel id="resources">
              <div className="resources-list">
                <h2 className="text-xl font-bold mb-4">Additional Resources</h2>
                {lesson.resources?.length > 0 ? (
                  <ul className="divide-y">
                    {lesson.resources.map((resource, index) => (
                      <li key={index} className="py-3">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <span className="resource-icon mr-2">
                            {getResourceIcon(resource.type)}
                          </span>
                          <div>
                            <div>{resource.title}</div>
                            {resource.description && (
                              <p className="text-sm text-gray-500">{resource.description}</p>
                            )}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No additional resources available.</p>
                )}
              </div>
            </TabPanel>
          )}
          
          {lesson.hasNotes && (
            <TabPanel id="notes">
              <div className="notes-container">
                <h2 className="text-xl font-bold mb-4">Your Notes</h2>
                <textarea 
                  className="notes-editor w-full p-4 border border-gray-300 rounded-lg min-h-[200px]"
                  placeholder="Take notes for this lesson..."
                />
                <div className="mt-4">
                  <Button variant="outlined" className="save-notes-btn">Save Notes</Button>
                </div>
              </div>
            </TabPanel>
          )}
        </Tabs>
      </div>
      
      <div className="lesson-navigation flex items-center justify-between border-t pt-6">
        <Button
          variant="outlined"
          onClick={() => handleNavigate(prevLesson)}
          disabled={!prevLesson || isLoading}
          className="prev-btn"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous Lesson
        </Button>
        
        <div className="flex-shrink-0 mx-2">
          {currentStatus !== 'completed' ? (
            <Button
              variant="primary"
              onClick={handleMarkComplete}
              isLoading={isLoading}
              disabled={isLoading}
              className="complete-btn"
            >
              Mark as Complete
            </Button>
          ) : (
            <div className="completed-indicator inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-md">
              <CheckCircle size={20} className="mr-2" />
              Completed
            </div>
          )}
        </div>
        
        <Button
          variant={nextLesson ? 'primary' : 'outlined'}
          onClick={() => handleNavigate(nextLesson)}
          disabled={!nextLesson || isLoading}
          className="next-btn"
        >
          Next Lesson
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

// Helper function for resource icons
function getResourceIcon(type) {
  switch (type?.toLowerCase()) {
    case 'pdf': return '📄';
    case 'video': return '🎥';
    case 'code': return '💻';
    case 'link': return '🔗';
    default: return '📎';
  }
}

LessonPlayer.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string,
    content: PropTypes.string,
    videoUrl: PropTypes.string,
    posterImage: PropTypes.string,
    quiz: PropTypes.object,
    assignment: PropTypes.object,
    hasDiscussion: PropTypes.bool,
    hasResources: PropTypes.bool,
    hasNotes: PropTypes.bool,
    resources: PropTypes.array,
    userProgress: PropTypes.object
  }).isRequired,
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    modules: PropTypes.array.isRequired
  }).isRequired,
  module: PropTypes.object,
  onComplete: PropTypes.func,
  onNavigate: PropTypes.func,
  isCompleted: PropTypes.bool
};

export default LessonPlayer;