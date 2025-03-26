import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Button } from '../ui/buttons/Button';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const CourseCard = ({
  course,
  variant = 'default',
  showActions = true,
  onEnroll,
  onContinue
}) => {
  const { user } = useAuth();
  
  if (!course) {
    return null;
  }
  
  const isInstructor = user?.role === 'instructor';
  const isEnrolled = !!course.isEnrolled;
  const progress = course.userProgress || 0;
  
  // Format price to always show 2 decimal places
  const formattedPrice = course.price ? parseFloat(course.price).toFixed(2) : '0.00';
  
  return (
    <div className={`course-card ${variant} shadow-md rounded-lg overflow-hidden bg-white transition-all hover:shadow-lg`}>
      <div className="course-image relative">
        <Image
          src={course.coverImage || '/images/course-placeholder.jpg'}
          alt={course.title}
          width={400}
          height={225}
          className="w-full h-[180px] object-cover"
          priority={variant === 'featured'}
        />
        {course.featured && (
          <span className="featured-badge absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
        {isEnrolled && progress === 100 && (
          <div className="completed-badge absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center text-sm py-1">
            <span className="flex items-center justify-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Completed
            </span>
          </div>
        )}
      </div>
      
      <div className="course-content p-4">
        <div className="course-meta flex items-center justify-between text-sm mb-2">
          <span className="course-category px-2 py-1 bg-gray-100 rounded text-gray-700">{course.category}</span>
          {course.averageRating > 0 && (
            <span className="course-rating flex items-center">
              <Star size={14} className="star-icon text-amber-500 mr-1" />
              <span>{parseFloat(course.averageRating).toFixed(1)}</span>
              <span className="rating-count text-gray-500 ml-1">({course.ratingCount || 0})</span>
            </span>
          )}
        </div>
        
        <Link href={`/courses/${course.id}`} className="course-title-link block mb-2">
          <h3 className="course-title font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
        </Link>
        
        <p className="course-description text-gray-600 text-sm mb-4 line-clamp-2">
          {course.shortDescription || course.description || 'No description available.'}
        </p>
        
        <div className="course-stats flex text-xs text-gray-500 mb-4">
          <div className="stat flex items-center mr-3">
            <Clock size={14} className="mr-1" />
            <span>{course.duration || 'Self-paced'}</span>
          </div>
          <div className="stat flex items-center mr-3">
            <Users size={14} className="mr-1" />
            <span>{course.enrollmentCount || 0} students</span>
          </div>
          <div className="stat flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{course.lessonsCount || 0} lessons</span>
          </div>
        </div>
        
        {isEnrolled && (
          <div className="progress-wrapper mb-4">
            <div className="progress-label flex justify-between text-xs mb-1">
              <span>Your progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar bg-gray-200 rounded-full h-2">
              <div 
                className="progress-fill bg-primary h-full rounded-full" 
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                role="progressbar"
                aria-label="Course progress"
              ></div>
            </div>
          </div>
        )}
        
        {showActions && (
          <div className="course-actions mt-auto">
            {isInstructor && course.instructorId === user?.id ? (
              <Link href={`/dashboard/courses/${course.id}/manage`}>
                <Button variant="outlined" fullWidth>
                  Manage Course
                </Button>
              </Link>
            ) : isEnrolled ? (
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => onContinue && onContinue(course)}
              >
                {progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </Button>
            ) : (
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => onEnroll && onEnroll(course)}
              >
                {course.isFree ? 'Enroll for Free' : `Enroll - $${formattedPrice}`}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {course.isNew && (
        <div className="new-badge absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          New
        </div>
      )}
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string,
    category: PropTypes.string,
    coverImage: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isFree: PropTypes.bool,
    duration: PropTypes.string,
    enrollmentCount: PropTypes.number,
    lessonsCount: PropTypes.number,
    averageRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ratingCount: PropTypes.number,
    instructorId: PropTypes.string,
    isEnrolled: PropTypes.bool,
    userProgress: PropTypes.number,
    featured: PropTypes.bool,
    isNew: PropTypes.bool
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'compact', 'featured']),
  showActions: PropTypes.bool,
  onEnroll: PropTypes.func,
  onContinue: PropTypes.func
};

export default memo(CourseCard);