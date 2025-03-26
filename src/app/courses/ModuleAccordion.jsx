import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Play, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

const ModuleAccordion = ({ 
  modules = [], 
  courseId, 
  userProgress = {}, 
  activeModuleId = null,
  activeLessonId = null,
  isPremium = false,
  isEnrolled = false
}) => {
  const [expandedModules, setExpandedModules] = useState(activeModuleId ? [activeModuleId] : []);
  const router = useRouter();
  
  // Initialize with active module expanded
  useEffect(() => {
    if (activeModuleId && !expandedModules.includes(activeModuleId)) {
      setExpandedModules(prev => [...prev, activeModuleId]);
    }
  }, [activeModuleId, expandedModules]);
  
  // Toggle module expansion
  const toggleModule = useCallback((moduleId) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  }, []);
  
  // Calculate module completion percentage
  const getModuleCompletion = useCallback((moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.lessons || !module.lessons.length) return 0;
    
    let completedCount = 0;
    module.lessons.forEach(lesson => {
      if (userProgress[lesson.id]?.completed) {
        completedCount++;
      }
    });
    
    return Math.round((completedCount / module.lessons.length) * 100);
  }, [modules, userProgress]);
  
  // Check if a lesson is locked
  const isLessonLocked = useCallback((lesson, moduleIndex) => {
    if (!isPremium) return false; // Free course - no locked content
    if (isEnrolled) return false; // User is enrolled - all content accessible
    
    // For premium courses, only first module's first lesson is accessible
    return moduleIndex > 0 || lesson.order > 0;
  }, [isPremium, isEnrolled]);
  
  // Handle lesson click
  const handleLessonClick = useCallback((lesson, moduleIndex) => {
    if (isLessonLocked(lesson, moduleIndex)) {
      // Show enrollment modal
      window.dispatchEvent(new CustomEvent('open-enrollment-modal', {
        detail: { courseId }
      }));
      return;
    }
    
    router.push(`/courses/${courseId}/lessons/${lesson.id}`);
  }, [courseId, isLessonLocked, router]);
  
  // Display message if no modules
  if (!modules || modules.length === 0) {
    return (
      <div className="no-modules bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">No course content available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="module-accordion divide-y border rounded-lg overflow-hidden">
      {modules.map((module, moduleIndex) => {
        if (!module) return null;
        
        const isExpanded = expandedModules.includes(module.id);
        const completionPercentage = getModuleCompletion(module.id);
        const isFullyComplete = completionPercentage === 100;
        const hasLessons = module.lessons && module.lessons.length > 0;
        
        return (
          <div 
            key={module.id || moduleIndex} 
            className={`module-item ${isExpanded ? 'expanded' : ''} ${isFullyComplete ? 'completed' : ''}`}
          >
            <div 
              className="module-header py-4 px-5 bg-white hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => toggleModule(module.id)}
              aria-expanded={isExpanded}
              aria-controls={`module-content-${module.id}`}
            >
              <div className="module-expand-icon mr-3">
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              
              <div className="module-info flex-grow">
                <h3 className="module-title font-medium text-gray-900">
                  {moduleIndex + 1}. {module.title}
                </h3>
                <div className="module-meta text-sm text-gray-500 flex items-center mt-1">
                  <span>{hasLessons ? module.lessons.length : 0} lessons</span>
                  {module.duration && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{module.duration}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="module-progress ml-4 flex items-center">
                {isFullyComplete ? (
                  <div className="completed-icon text-green-500">
                    <CheckCircle size={18} />
                  </div>
                ) : (
                  <div className="progress-indicator flex items-center">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${completionPercentage}%` }}
                        aria-valuenow={completionPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        role="progressbar"
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{completionPercentage}%</span>
                  </div>
                )}
              </div>
            </div>
            
            {isExpanded && hasLessons && (
              <div 
                id={`module-content-${module.id}`}
                className="lessons-list divide-y border-t bg-gray-50"
              >
                {module.lessons.map(lesson => {
                  if (!lesson) return null;
                  
                  const isActive = lesson.id === activeLessonId;
                  const isCompleted = userProgress[lesson.id]?.completed;
                  const isLocked = isLessonLocked(lesson, moduleIndex);
                  
                  return (
                    <div 
                      key={lesson.id || `lesson-${moduleIndex}-${lesson.order}`}
                      className={`
                        lesson-item py-3 px-5 flex items-center cursor-pointer
                        ${isActive ? 'active bg-blue-50' : ''}
                        ${isCompleted ? 'completed' : ''}
                        ${isLocked ? 'locked opacity-70' : 'hover:bg-gray-100'}
                      `}
                      onClick={() => handleLessonClick(lesson, moduleIndex)}
                      role="button"
                      tabIndex={0}
                      aria-disabled={isLocked}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLessonClick(lesson, moduleIndex);
                        }
                      }}
                    >
                      <div className="lesson-icon w-6 h-6 mr-3 flex items-center justify-center rounded-full">
                        {isCompleted ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : isLocked ? (
                          <Lock size={16} className="text-gray-400" />
                        ) : (
                          getLessonTypeIcon(lesson.type)
                        )}
                      </div>
                      
                      <div className="lesson-info flex-grow">
                        <div className="lesson-title text-sm font-medium text-gray-800">
                          {lesson.title}
                        </div>
                        <div className="lesson-meta flex items-center mt-0.5">
                          <span className="lesson-type text-xs text-gray-500 capitalize">{lesson.type}</span>
                          {lesson.duration && (
                            <>
                              <span className="mx-1 text-gray-300">•</span>
                              <span className="lesson-duration text-xs text-gray-500">{lesson.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {isLocked && (
                        <div className="premium-badge ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded">
                          Premium
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to get lesson type icon
function getLessonTypeIcon(type) {
  switch (type) {
    case 'video':
      return <Play size={16} className="text-blue-500" />;
    case 'quiz':
      return <span className="text-purple-500">❓</span>;
    case 'assignment':
      return <span className="text-amber-500">📝</span>;
    case 'discussion':
      return <span className="text-green-500">💬</span>;
    default:
      return <span className="text-gray-500">📄</span>;
  }
}

ModuleAccordion.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      duration: PropTypes.string,
      order: PropTypes.number,
      lessons: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          duration: PropTypes.string,
          order: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  courseId: PropTypes.string.isRequired,
  userProgress: PropTypes.object,
  activeModuleId: PropTypes.string,
  activeLessonId: PropTypes.string,
  isPremium: PropTypes.bool,
  isEnrolled: PropTypes.bool
};

export default ModuleAccordion;