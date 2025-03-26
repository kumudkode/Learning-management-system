import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash, Edit, ChevronDown, ChevronUp, MessageSquare, Video, FileText } from 'lucide-react';
import { Button } from '../ui/buttons/Button';
import { useToast } from '../../hooks/useToast';

export default function CourseBuilder({ courseId, initialData }) {
  const [modules, setModules] = useState(initialData?.modules || []);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const handleModuleExpand = (moduleId) => {
    setActiveModuleId(prev => prev === moduleId ? null : moduleId);
  };
  
  const handleAddModule = () => {
    const newModule = {
      id: `temp-${Date.now()}`,
      title: 'New Module',
      description: '',
      lessons: [],
      order: modules.length
    };
    
    setModules([...modules, newModule]);
    setActiveModuleId(newModule.id);
  };
  
  const handleUpdateModule = (moduleId, data) => {
    setModules(prev => 
      prev.map(mod => 
        mod.id === moduleId ? { ...mod, ...data } : mod
      )
    );
  };
  
  const handleDeleteModule = (moduleId) => {
    if (confirm('Are you sure you want to delete this module and all its lessons?')) {
      setModules(prev => prev.filter(mod => mod.id !== moduleId));
      if (activeModuleId === moduleId) {
        setActiveModuleId(null);
      }
    }
  };
  
  const handleAddLesson = (moduleId) => {
    const newLesson = {
      id: `temp-${Date.now()}`,
      title: 'New Lesson',
      description: '',
      content: '',
      type: 'video',
      order: modules.find(m => m.id === moduleId)?.lessons.length || 0
    };
    
    setModules(prev => 
      prev.map(mod => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            lessons: [...mod.lessons, newLesson]
          };
        }
        return mod;
      })
    );
  };
  
  const handleUpdateLesson = (moduleId, lessonId, data) => {
    setModules(prev => 
      prev.map(mod => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            lessons: mod.lessons.map(lesson => 
              lesson.id === lessonId ? { ...lesson, ...data } : lesson
            )
          };
        }
        return mod;
      })
    );
  };
  
  const handleDeleteLesson = (moduleId, lessonId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setModules(prev => 
        prev.map(mod => {
          if (mod.id === moduleId) {
            return {
              ...mod,
              lessons: mod.lessons.filter(lesson => lesson.id !== lessonId)
            };
          }
          return mod;
        })
      );
    }
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, type } = result;
    
    // Reordering modules
    if (type === 'MODULE') {
      const reorderedModules = [...modules];
      const [movedModule] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, movedModule);
      
      // Update order property
      const updatedModules = reorderedModules.map((mod, index) => ({
        ...mod,
        order: index
      }));
      
      setModules(updatedModules);
      return;
    }
    
    // Reordering lessons within a module
    if (type === 'LESSON') {
      const moduleId = source.droppableId;
      const sourceModule = modules.find(m => m.id === moduleId);
      const destModule = modules.find(m => m.id === destination.droppableId);
      
      if (sourceModule && destModule) {
        // Same module reordering
        if (sourceModule.id === destModule.id) {
          const newLessons = [...sourceModule.lessons];
          const [movedLesson] = newLessons.splice(source.index, 1);
          newLessons.splice(destination.index, 0, movedLesson);
          
          // Update lesson orders
          const updatedLessons = newLessons.map((lesson, index) => ({
            ...lesson,
            order: index
          }));
          
          setModules(prev => 
            prev.map(mod => 
              mod.id === moduleId ? { ...mod, lessons: updatedLessons } : mod
            )
          );
        } else {
          // Moving between modules
          const sourceModuleLessons = [...sourceModule.lessons];
          const [movedLesson] = sourceModuleLessons.splice(source.index, 1);
          const destModuleLessons = [...destModule.lessons];
          destModuleLessons.splice(destination.index, 0, movedLesson);
          
          // Update both modules with reordered lessons
          setModules(prev =>
            prev.map(mod => {
              if (mod.id === sourceModule.id) {
                return {
                  ...mod,
                  lessons: sourceModuleLessons.map((lesson, idx) => ({ ...lesson, order: idx }))
                };
              }
              if (mod.id === destModule.id) {
                return {
                  ...mod,
                  lessons: destModuleLessons.map((lesson, idx) => ({ ...lesson, order: idx }))
                };
              }
              return mod;
            })
          );
        }
      }
    }
  };
  
  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/structure`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modules })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save course structure');
      }
      
      toast({
        title: 'Course saved',
        description: 'Your course structure has been updated',
        type: 'success'
      });
      
      // Update any temporary IDs with ones from the server
      const savedData = await response.json();
      setModules(savedData.modules);
      
    } catch (error) {
      toast({
        title: 'Error saving course',
        description: error.message,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="course-builder">
      <div className="builder-header">
        <h1>Course Structure</h1>
        <Button 
          variant="primary"
          onClick={handleSaveCourse}
          isLoading={saving}
        >
          Save Changes
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules" type="MODULE">
          {(provided) => (
            <div
              className="modules-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <div
                      className="module-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="module-header">
                        <div 
                          className="drag-handle" 
                          {...provided.dragHandleProps}
                        ></div>
                        
                        <button
                          className="expand-button"
                          onClick={() => handleModuleExpand(module.id)}
                        >
                          {activeModuleId === module.id ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        
                        <div className="module-title">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => handleUpdateModule(module.id, { title: e.target.value })}
                            placeholder="Module Title"
                            disabled={saving}
                          />
                        </div>
                        
                        <div className="module-actions">
                          <button
                            className="add-lesson-button"
                            onClick={() => handleAddLesson(module.id)}
                            disabled={saving}
                          >
                            <Plus size={16} /> Lesson
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteModule(module.id)}
                            disabled={saving}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {activeModuleId === module.id && (
                        <>
                          <div className="module-description">
                            <textarea
                              value={module.description}
                              onChange={(e) => handleUpdateModule(module.id, { description: e.target.value })}
                              placeholder="Module description"
                              disabled={saving}
                            />
                          </div>
                          
                          <Droppable droppableId={module.id} type="LESSON">
                            {(provided) => (
                              <div
                                className="lessons-container"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <Draggable
                                    key={lesson.id}
                                    draggableId={lesson.id}
                                    index={lessonIndex}
                                  >
                                    {(provided) => (
                                      <div
                                        className="lesson-item"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <div className="lesson-icon">
                                          {getLessonIcon(lesson.type)}
                                        </div>
                                        
                                        <div className="lesson-title">
                                          <input
                                            type="text"
                                            value={lesson.title}
                                            onChange={(e) => handleUpdateLesson(
                                              module.id,
                                              lesson.id,
                                              { title: e.target.value }
                                            )}
                                            placeholder="Lesson Title"
                                            disabled={saving}
                                          />
                                        </div>
                                        
                                        <div className="lesson-type">
                                          <select
                                            value={lesson.type}
                                            onChange={(e) => handleUpdateLesson(
                                              module.id,
                                              lesson.id,
                                              { type: e.target.value }
                                            )}
                                            disabled={saving}
                                          >
                                            <option value="video">Video</option>
                                            <option value="text">Article</option>
                                            <option value="quiz">Quiz</option>
                                            <option value="discussion">Discussion</option>
                                            <option value="assignment">Assignment</option>
                                          </select>
                                        </div>
                                        
                                        <div className="lesson-actions">
                                          <button
                                            className="edit-button"
                                            onClick={() => {/* Open lesson editor */}}
                                            disabled={saving}
                                          >
                                            <Edit size={16} />
                                          </button>
                                          <button
                                            className="delete-button"
                                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                            disabled={saving}
                                          >
                                            <Trash size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                
                                {module.lessons.length === 0 && (
                                  <div className="empty-lessons">
                                    No lessons yet. Click "Add Lesson" to create one.
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {modules.length === 0 && (
                <div className="empty-modules">
                  No modules yet. Click "Add Module" to create your first module.
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="builder-footer">
        <Button
          variant="outlined"
          onClick={handleAddModule}
          disabled={saving}
        >
          <Plus size={16} /> Add Module
        </Button>
      </div>
    </div>
  );
}

// Helper function to get proper icon based on lesson type
function getLessonIcon(type) {
  switch (type) {
    case 'video':
      return <Video size={16} />;
    case 'text':
      return <FileText size={16} />;
    case 'quiz':
      return <span>❓</span>;
    case 'discussion':
      return <MessageSquare size={16} />;
    case 'assignment':
      return <span>📝</span>;
    default:
      return <FileText size={16} />;
  }
}