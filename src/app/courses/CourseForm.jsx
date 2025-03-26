import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '../ui/buttons/Button';
import { Input } from '../ui/forms/Input';
import { TextArea } from '../ui/forms/TextArea';
import { Select } from '../ui/forms/Select';
import { Checkbox } from '../ui/forms/Checkbox';
import { ImageUploader } from '../ui/forms/ImageUploader';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

// Helper categories list - would normally come from API
const COURSE_CATEGORIES = [
  { value: 'programming', label: 'Programming & Development' },
  { value: 'business', label: 'Business & Management' },
  { value: 'design', label: 'Design & Creativity' },
  { value: 'marketing', label: 'Marketing & Communications' },
  { value: 'datascience', label: 'Data Science & Analytics' },
  { value: 'language', label: 'Language Learning' },
  { value: 'personal', label: 'Personal Development' },
];

const CourseForm = ({ course = null, onSubmit, submitLabel = 'Create Course' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 0,
    isFree: true,
    isPublished: false,
    isFeatured: false,
    coverImage: null,
    previewVideo: '',
    prerequisites: '',
    learningObjectives: '',
    targetAudience: '',
    duration: '',
    level: 'beginner',
    ...(course || {}) // Spread existing course data if provided
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});
  
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  
  // Field change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Mark field as dirty (touched)
    setDirtyFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Handle checkbox vs other inputs
    const newValue = type === 'checkbox' ? checked : value;
    
    // Special case for price when toggling isFree
    if (name === 'isFree' && checked) {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        price: 0
      }));
    } else if (name === 'price') {
      // Ensure price is a valid number
      const numericValue = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
    
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [validationErrors]);
  
  // Image upload handler
  const handleImageChange = useCallback((file) => {
    if (file) {
      setImageFile(file);
      setDirtyFields(prev => ({
        ...prev,
        coverImage: true
      }));
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          coverImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);
  
  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Course title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Course title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Course description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    
    if (!formData.isFree) {
      if (formData.price <= 0) {
        errors.price = 'Please enter a valid price greater than 0';
      } else if (formData.price > 999) {
        errors.price = 'Price cannot exceed $999';
      }
    }
    
    if (!formData.level) {
      errors.level = 'Please select a difficulty level';
    }
    
    if (formData.shortDescription && formData.shortDescription.length > 150) {
      errors.shortDescription = 'Short description cannot exceed 150 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        type: 'error',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create form data for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'coverImage' || !imageFile) { // Don't append coverImage as string
          submitData.append(key, formData[key]);
        }
      });
      
      // Append the actual file if it exists
      if (imageFile) {
        submitData.append('coverImage', imageFile);
      }
      
      // Call the onSubmit handler
      await onSubmit(submitData);
      
      toast({
        title: 'Success',
        description: course ? 'Course updated successfully' : 'Course created successfully',
        type: 'success',
      });
      
    } catch (error) {
      console.error('Course form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save course',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="course-form space-y-8">
      <div className="form-section bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Basic Information</h2>
        
        <div className="form-group mb-4">
          <Input
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your course title"
            error={validationErrors.title}
            required
            maxLength={100}
            disabled={submitting}
          />
        </div>
        
        <div className="form-group mb-4">
          <TextArea
            label="Course Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of your course"
            rows={5}
            error={validationErrors.description}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group mb-4">
          <TextArea
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Brief summary that appears in course cards"
            rows={2}
            maxLength={150}
            error={validationErrors.shortDescription}
            helperText={`${formData.shortDescription?.length || 0}/150 characters`}
            disabled={submitting}
          />
        </div>
        
        <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={COURSE_CATEGORIES}
              placeholder="Select a category"
              error={validationErrors.category}
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <Select
              label="Difficulty Level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
                { value: 'all', label: 'All Levels' },
              ]}
              error={validationErrors.level}
              required
              disabled={submitting}
            />
          </div>
        </div>
      </div>
      
      <div className="form-section bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Pricing</h2>
        
        <div className="form-group checkbox mb-4">
          <Checkbox
            label="This is a free course"
            name="isFree"
            checked={formData.isFree}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        
        {!formData.isFree && (
          <div className="form-group">
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter the course price"
              error={validationErrors.price}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">Set a competitive price between $0.01 and $999.00</p>
          </div>
        )}
      </div>
      
      <div className="form-section bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Course Media</h2>
        
        <div className="form-group mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Cover Image</label>
          <ImageUploader
            currentImage={formData.coverImage}
            onChange={handleImageChange}
            aspectRatio={16/9}
            maxSizeMB={2}
            helperText="Recommended size: 1280x720px, max 2MB"
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <Input
            label="Preview Video URL"
            name="previewVideo"
            value={formData.previewVideo}
            onChange={handleChange}
            placeholder="YouTube or Vimeo URL"
            helperText="Short preview video to showcase your course"
            disabled={submitting}
          />
        </div>
      </div>
      
      <div className="form-section bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Course Details</h2>
        
        <div className="form-group mb-4">
          <TextArea
            label="Prerequisites"
            name="prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            placeholder="What should students know before starting?"
            rows={3}
            disabled={submitting}
          />
        </div>
        
        <div className="form-group mb-4">
          <TextArea
            label="Learning Objectives"
            name="learningObjectives"
            value={formData.learningObjectives}
            onChange={handleChange}
            placeholder="What will students learn from this course?"
            rows={3}
            disabled={submitting}
          />
        </div>
        
        <div className="form-group mb-4">
          <TextArea
            label="Target Audience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="Who is this course for?"
            rows={3}
            disabled={submitting}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <Input
              label="Estimated Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 4 weeks, 10 hours"
              helperText="Approximate time to complete"
              disabled={submitting}
            />
          </div>
        </div>
      </div>
      
      <div className="form-section bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Publishing Options</h2>
        
        <div className="form-group checkbox mb-4">
          <Checkbox
            label="Publish this course (make visible to students)"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            disabled={submitting}
          />
          {formData.isPublished && !course?.id && (
            <p className="text-sm text-amber-600 mt-1 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              You'll need to add course content before students can enroll
            </p>
          )}
        </div>
        
        {user?.role === 'admin' && (
          <div className="form-group checkbox">
            <Checkbox
              label="Feature this course on homepage"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
        )}
      </div>
      
      <div className="form-actions flex justify-end space-x-4">
        <Button
          type="button"
          variant="outlined"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={submitting}
          disabled={submitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

CourseForm.propTypes = {
  course: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string
};

export default CourseForm;