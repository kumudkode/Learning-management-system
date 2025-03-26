import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Users, Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

const CourseHeader = ({
  title,
  category,
  coverImage,
  instructor,
  rating,
  ratingCount,
  enrollmentCount,
  updatedAt
}) => {
  const formattedDate = updatedAt ? new Date(updatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long'
  }) : null;

  return (
    <div className="course-header bg-gradient-to-r from-indigo-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Cover Image */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image
                src={coverImage || '/images/course-placeholder.jpg'}
                alt={title}
                width={400}
                height={225}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Course Info */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {category && (
              <div className="course-category mb-2">
                <Link href={`/courses/category/${category}`}>
                  <span className="text-blue-200 hover:text-white text-sm uppercase tracking-wide">
                    {category}
                  </span>
                </Link>
              </div>
            )}
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{title}</h1>
            
            <div className="course-meta flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
              {rating > 0 && (
                <div className="rating-info flex items-center">
                  <div className="stars flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {parseFloat(rating).toFixed(1)}
                    {ratingCount > 0 && (
                      <span className="text-blue-200 ml-1">({ratingCount} ratings)</span>
                    )}
                  </span>
                </div>
              )}
              
              {enrollmentCount > 0 && (
                <div className="enrollment-info flex items-center text-sm">
                  <Users size={16} className="mr-1 text-blue-200" />
                  <span>
                    {enrollmentCount.toLocaleString()} {enrollmentCount === 1 ? 'student' : 'students'}
                  </span>
                </div>
              )}
              
              {formattedDate && (
                <div className="update-info flex items-center text-sm">
                  <Calendar size={16} className="mr-1 text-blue-200" />
                  <span>Updated {formattedDate}</span>
                </div>
              )}
            </div>
            
            {instructor && (
              <div className="instructor-info flex items-center">
                <div className="instructor-avatar mr-3">
                  {instructor.avatar ? (
                    <Image
                      src={instructor.avatar}
                      alt={instructor.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {instructor.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="instructor-details">
                  <div className="text-sm text-blue-200">Instructor</div>
                  <Link href={`/instructors/${instructor.id}`}>
                    <span className="font-medium hover:underline">
                      {instructor.name}
                    </span>
                  </Link>
                  {instructor.title && (
                    <div className="text-xs text-blue-200">
                      {instructor.title}
                      {instructor.company && ` · ${instructor.company}`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CourseHeader.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string,
  coverImage: PropTypes.string,
  instructor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string
  }),
  rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ratingCount: PropTypes.number,
  enrollmentCount: PropTypes.number,
  updatedAt: PropTypes.string
};

export default CourseHeader;