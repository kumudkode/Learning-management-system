import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ShoppingCart, CheckCircle, Loader } from 'lucide-react';
import { Button } from '../ui/buttons/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import PropTypes from 'prop-types';

const EnrollmentButton = ({ courseId, price = 0, isFree = false, className = '' }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showingLogin, setShowingLogin] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const handleEnroll = async () => {
    // Reset error state
    setError(null);
    
    // Check if user is logged in
    if (!isAuthenticated) {
      setShowingLogin(true);
      openAuthModal('login', {
        redirectUrl: `/courses/${courseId}`,
        onAuthenticated: () => handleEnrollAfterLogin()
      });
      return;
    }
    
    setIsEnrolling(true);
    
    try {
      if (isFree) {
        // Free course - direct enrollment
        await enrollInFreeCourse();
      } else {
        // Paid course - add to cart or checkout
        await addToCartOrCheckout();
      }
    } catch (err) {
      setError(err.message || 'Failed to enroll in course');
      toast({
        title: 'Enrollment Failed',
        description: err.message || 'There was a problem with your enrollment',
        type: 'error'
      });
    } finally {
      setIsEnrolling(false);
    }
  };
  
  const handleEnrollAfterLogin = () => {
    setShowingLogin(false);
    handleEnroll();
  };
  
  const enrollInFreeCourse = async () => {
    const response = await fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to enroll in course');
    }
    
    // Successfully enrolled
    toast({
      title: 'Enrollment Successful!',
      description: 'You are now enrolled in this course',
      type: 'success'
    });
    
    // Redirect to course page or first lesson
    const data = await response.json();
    if (data.redirectUrl) {
      router.push(data.redirectUrl);
    } else {
      router.refresh();
    }
  };
  
  const addToCartOrCheckout = async () => {
    const response = await fetch(`/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        courseId,
        quantity: 1
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to add course to cart');
    }
    
    // Successfully added to cart
    toast({
      title: 'Added to Cart',
      description: 'Course has been added to your cart',
      type: 'success'
    });
    
    // Redirect to checkout
    router.push('/checkout');
  };
  
  const getButtonText = () => {
    if (isEnrolling) {
      return 'Processing...';
    }
    
    if (showingLogin) {
      return 'Please log in';
    }
    
    if (isFree) {
      return 'Enroll Now - Free';
    }
    
    return `Enroll Now - $${parseFloat(price).toFixed(2)}`;
  };
  
  return (
    <div className={`enrollment-button ${className}`}>
      <Button
        variant="primary"
        size="lg"
        onClick={handleEnroll}
        disabled={isEnrolling || showingLogin}
        fullWidth
        className="flex items-center justify-center"
      >
        {isEnrolling ? (
          <Loader className="animate-spin mr-2" size={18} />
        ) : isFree ? (
          <CheckCircle className="mr-2" size={18} />
        ) : (
          <ShoppingCart className="mr-2" size={18} />
        )}
        {getButtonText()}
      </Button>
      
      {error && (
        <div className="error-message mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

EnrollmentButton.propTypes = {
  courseId: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isFree: PropTypes.bool,
  className: PropTypes.string
};

export default EnrollmentButton;