import React, { useState, useEffect, useCallback } from 'react';
import CourseCard from './CourseCard';
import { Button } from '../ui/buttons/Button';
import { Select } from '../ui/forms/Select';
import PropTypes from 'prop-types';

const CourseList = ({
  courses = [],
  isLoading = false,
  error = null,
  title,
  description,
  showFilters = false,
  showPagination = false,
  onFilterChange,
  onEnroll,
  onContinue,
  onLoadMore,
  hasMoreCourses = false
}) => {
  const [sortBy, setSortBy] = useState('recommended');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  
  // Apply local filtering if onFilterChange not provided
  const filteredCourses = useCallback(() => {
    if (onFilterChange) return courses; // External filtering
    
    return courses.filter(course => {
      const categoryMatch = category === 'all' || course.category === category;
      const levelMatch = level === 'all' || course.level === level;
      return categoryMatch && levelMatch;
    });
  }, [courses, category, level, onFilterChange]);
  
  // Apply local sorting if filtered locally
  const sortedCourses = useCallback(() => {
    const filtered = filteredCourses();
    
    if (onFilterChange) return filtered; // External sorting
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'highest-rated':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'most-popular':
          return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
        case 'price-low-high':
          return (a.isFree ? -1 : a.price || 0) - (b.isFree ? -1 : b.price || 0);
        case 'price-high-low':
          return (b.isFree ? -1 : b.price || 0) - (a.isFree ? -1 : a.price || 0);
        default:
          return 0; // Default to original order (recommended)
      }
    });
  }, [filteredCourses, sortBy, onFilterChange]);
  
  // Handle filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ sortBy, category, level });
    }
  }, [sortBy, category, level, onFilterChange]);
  
  return (
    <div className="course-list">
      {(title || description) && (
        <div className="course-list-header mb-6">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      
      {showFilters && (
        <div className="course-filters mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="filter-item">
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'recommended', label: 'Recommended' },
                  { value: 'newest', label: 'Newest' },
                  { value: 'highest-rated', label: 'Highest Rated' },
                  { value: 'most-popular', label: 'Most Popular' },
                  { value: 'price-low-high', label: 'Price: Low to High' },
                  { value: 'price-high-low', label: 'Price: High to Low' },
                ]}
              />
            </div>
            
            <div className="filter-item">
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'programming', label: 'Programming & Development' },
                  { value: 'business', label: 'Business & Management' },
                  { value: 'design', label: 'Design & Creativity' },
                  { value: 'marketing', label: 'Marketing & Communications' },
                  { value: 'datascience', label: 'Data Science & Analytics' },
                  { value: 'language', label: 'Language Learning' },
                  { value: 'personal', label: 'Personal Development' },
                ]}
              />
            </div>
            
            <div className="filter-item">
              <Select
                label="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                options={[
                  { value: 'all', label: 'All Levels' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
              />
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="course-list-loading grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="course-list-error bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 mb-6">
          <p className="font-medium">Error loading courses</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {!isLoading && !error && sortedCourses().length === 0 && (
        <div className="course-list-empty bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or check back later for new courses.</p>
        </div>
      )}
      
      {!isLoading && !error && sortedCourses().length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses().map(course => (
            <CourseCard 
              key={course.id}
              course={course}
              onEnroll={onEnroll}
              onContinue={onContinue}
            />
          ))}
        </div>
      )}
      
      {showPagination && hasMoreCourses && (
        <div className="course-list-pagination mt-8 text-center">
          <Button 
            variant="outlined" 
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Courses'}
          </Button>
        </div>
      )}
    </div>
  );
};

CourseList.propTypes = {
  courses: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  showFilters: PropTypes.bool,
  showPagination: PropTypes.bool,
  onFilterChange: PropTypes.func,
  onEnroll: PropTypes.func,
  onContinue: PropTypes.func,
  onLoadMore: PropTypes.func,
  hasMoreCourses: PropTypes.bool
};

export default CourseList;