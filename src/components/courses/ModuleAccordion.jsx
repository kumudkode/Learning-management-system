import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ModuleAccordion({ 
  modules, 
  courseId, 
  userProgress = {}, 
  activeModuleId = null,
  activeLessonId = null,
  isPremium = false,
  isEnrolled = false
}) {
  const [expandedModules, setExpandedModules] = useState(activeModuleId ? [activeModuleId] : []);
  const router = useRouter();
  
  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };
  
  // Calculate module completion percentage
  const getModuleCompletion = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.lessons.length) return 0;
    
    let completedCount = 0;
    module.lessons.forEach(lesson => {
      if (userProgress[lesson.id]?.completed) {
        completedCount++;
      }
    });
    
    return Math.round((completedCount / module.lessons.length) * 100);
  };
  
  // Check if a lesson is locked
  const isLessonLocked = (lesson, moduleIndex) => {
    if (!isPremium) return false; // Free course - no locked content
    if (isEnrolled) return false; // User is enrolled - all content accessible
    
    // For premium courses, only first module's first lesson is accessible
    return moduleIndex > 0 || lesson.order > 0;
  };
  
  // Handle lesson click
  const handleLessonClick = (lesson, moduleIndex) => {
    if (isLessonLocked(lesson, moduleIndex)) {
      // Show enrollment modal
      window.dispatchEvent(new CustomEvent('open-enrollment-modal', {
        detail: { courseId }
      }));
      return;
    }
    
    router.push(`/courses/${courseId}/lessons/${lesson.id}`);
  };
  
  return (
    <div className="module-accordion">
      {modules.map((module, moduleIndex) => {
        const isExpanded = expandedModules.includes(module.id);
        const completionPercentage = getModuleCompletion(module.id);
        
        return (
          <div 
            key={module.id} 
            className={`module-item ${isExpanded ? 'expanded' : ''}`}
          >
            <div 
              className="module-header"
              onClick={() => toggleModule(module.id)}
            >
              <div className="module-expand-icon">
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              
              <div className="module-info">
                <h3 className="module-title">{module.title}</h3>
                <div className="module-meta">
                  <span>{module.lessons.length} lessons</span>
                  <span>{module.duration || '1h 20m'}</span>
                </div>
              </div>
              
              <div className="module-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">{completionPercentage}%</span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="lessons-list">
                {module.lessons.map(lesson => {
                  const isActive = lesson.id === activeLessonId;
                  const isCompleted = userProgress[lesson.id]?.completed;
                  const isLocked = isLessonLocked(lesson, moduleIndex);
                  
                  return (
                    <div 
                      key={lesson.id}
                      className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                      onClick={() => handleLessonClick(lesson, moduleIndex)}
                    >
                      <div className="lesson-icon">
                        {isCompleted ? (
                          <CheckCircle size={16} className="completed-icon" />
                        ) : isLocked ? (
                          <Lock size={16} className="locked-icon" />
                        ) : (
                          <Play size={16} className="play-icon" />
                        )}
                      </div>
                      
                      <div className="lesson-info">
                        <span className="lesson-title">{lesson.title}</span>
                        <div className="lesson-meta">
                          <span className="lesson-type">{lesson.type}</span>
                          <span className="lesson-duration">{lesson.duration || '10m'}</span>
                        </div>
                      </div>
                      
                      {isLocked && (
                        <div className="premium-badge">Premium</div>
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
}

// Sample data for Full Stack Web Development Course
export const fullStackModules = [
  {
    id: 'mod1',
    title: 'Frontend Fundamentals',
    duration: '6h 45m',
    lessons: [
      {
        id: 'less1-1',
        title: 'Introduction to HTML5',
        type: 'video',
        duration: '15m',
        order: 0
      },
      {
        id: 'less1-2',
        title: 'CSS3 & Responsive Design',
        type: 'video',
        duration: '25m',
        order: 1
      },
      {
        id: 'less1-3',
        title: 'JavaScript Basics',
        type: 'video',
        duration: '35m',
        order: 2
      },
      {
        id: 'less1-4',
        title: 'DOM Manipulation',
        type: 'video',
        duration: '30m',
        order: 3
      },
      {
        id: 'less1-5',
        title: 'Frontend Project: Portfolio Website',
        type: 'assignment',
        duration: '1h 30m',
        order: 4
      }
    ]
  },
  {
    id: 'mod2',
    title: 'React.js Development',
    duration: '8h 20m',
    lessons: [
      {
        id: 'less2-1',
        title: 'React Fundamentals',
        type: 'video',
        duration: '40m',
        order: 0
      },
      {
        id: 'less2-2',
        title: 'Component Architecture',
        type: 'video',
        duration: '35m',
        order: 1
      },
      {
        id: 'less2-3',
        title: 'State & Props Management',
        type: 'video',
        duration: '45m',
        order: 2
      },
      {
        id: 'less2-4',
        title: 'Hooks & Context API',
        type: 'video',
        duration: '50m',
        order: 3
      },
      {
        id: 'less2-5',
        title: 'React Project: Task Management App',
        type: 'assignment',
        duration: '2h',
        order: 4
      }
    ]
  },
  {
    id: 'mod3',
    title: 'Backend Development with Node.js',
    duration: '7h 30m',
    lessons: [
      {
        id: 'less3-1',
        title: 'Node.js Basics',
        type: 'video',
        duration: '30m',
        order: 0
      },
      {
        id: 'less3-2',
        title: 'Express.js Framework',
        type: 'video',
        duration: '40m',
        order: 1
      },
      {
        id: 'less3-3',
        title: 'RESTful API Design',
        type: 'video',
        duration: '45m',
        order: 2
      },
      {
        id: 'less3-4',
        title: 'Authentication & Authorization',
        type: 'video',
        duration: '50m',
        order: 3
      },
      {
        id: 'less3-5',
        title: 'Backend Project: API Development',
        type: 'assignment',
        duration: '1h 45m',
        order: 4
      }
    ]
  },
  {
    id: 'mod4',
    title: 'Database Integration',
    duration: '5h 15m',
    lessons: [
      {
        id: 'less4-1',
        title: 'SQL vs NoSQL Databases',
        type: 'video',
        duration: '25m',
        order: 0
      },
      {
        id: 'less4-2',
        title: 'MongoDB & Mongoose',
        type: 'video',
        duration: '40m',
        order: 1
      },
      {
        id: 'less4-3',
        title: 'Data Modeling',
        type: 'video',
        duration: '35m',
        order: 2
      },
      {
        id: 'less4-4',
        title: 'CRUD Operations',
        type: 'video',
        duration: '45m',
        order: 3
      },
      {
        id: 'less4-5',
        title: 'Integration Project: Full Stack Data Management',
        type: 'assignment',
        duration: '2h',
        order: 4
      }
    ]
  },
  {
    id: 'mod5',
    title: 'Full Stack Integration',
    duration: '9h 30m',
    lessons: [
      {
        id: 'less5-1',
        title: 'Connecting Frontend & Backend',
        type: 'video',
        duration: '45m',
        order: 0
      },
      {
        id: 'less5-2',
        title: 'State Management with Redux',
        type: 'video',
        duration: '50m',
        order: 1
      },
      {
        id: 'less5-3',
        title: 'Deployment Strategies',
        type: 'video',
        duration: '40m',
        order: 2
      },
      {
        id: 'less5-4',
        title: 'Performance Optimization',
        type: 'video',
        duration: '35m',
        order: 3
      },
      {
        id: 'less5-5',
        title: 'Capstone Project: Full Stack E-Commerce Platform',
        type: 'assignment',
        duration: '4h',
        order: 4
      }
    ]
  }
];