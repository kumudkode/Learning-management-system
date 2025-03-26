import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const LessonNavigation = ({ prevLesson, nextLesson, courseId }) => {
  return (
    <div className="lesson-navigation flex justify-between items-center">
      <div className="previous-lesson">
        {prevLesson ? (
          <Link 
            href={`/courses/${courseId}/lessons/${prevLesson.id}`}
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="mr-2 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Previous Lesson</div>
              <div className="font-medium">{prevLesson.title}</div>
              {prevLesson.moduleTitle && (
                <div className="text-xs text-gray-500">{prevLesson.moduleTitle}</div>
              )}
            </div>
          </Link>
        ) : (
          <div className="p-3 opacity-50 cursor-not-allowed">
            <div className="flex items-center text-gray-400">
              <ChevronLeft size={20} className="mr-2" />
              <div className="text-sm">No previous lesson</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="next-lesson text-right">
        {nextLesson ? (
          <Link 
            href={`/courses/${courseId}/lessons/${nextLesson.id}`}
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-500">Next Lesson</div>
              <div className="font-medium">{nextLesson.title}</div>
              {nextLesson.moduleTitle && (
                <div className="text-xs text-gray-500">{nextLesson.moduleTitle}</div>
              )}
            </div>
            <ChevronRight size={20} className="ml-2 text-gray-500" />
          </Link>
        ) : (
          <div className="p-3 opacity-50 cursor-not-allowed">
            <div className="flex items-center text-gray-400">
              <div className="text-sm">No next lesson</div>
              <ChevronRight size={20} className="ml-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

LessonNavigation.propTypes = {
  prevLesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    moduleTitle: PropTypes.string
  }),
  nextLesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    moduleTitle: PropTypes.string
  }),
  courseId: PropTypes.string.isRequired
};

export default LessonNavigation;