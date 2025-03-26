import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import PropTypes from 'prop-types';

const TextContent = ({ 
  content, 
  courseId, 
  lessonId, 
  onProgress 
}) => {
  const [readProgress, setReadProgress] = useState(0);
  const [lastReportedProgress, setLastReportedProgress] = useState(0);
  const contentRef = useRef(null);
  
  // Set up sections for tracking read progress
  const { ref: section25Ref, inView: section25InView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { ref: section50Ref, inView: section50InView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { ref: section75Ref, inView: section75InView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { ref: section100Ref, inView: section100InView } = useInView({ threshold: 0.5, triggerOnce: true });
  
  // Calc progress based on which sections are in view
  useEffect(() => {
    let progress = 0;
    
    if (section25InView) progress = 25;
    if (section50InView) progress = 50;
    if (section75InView) progress = 75;
    if (section100InView) progress = 100;
    
    setReadProgress(progress);
  }, [section25InView, section50InView, section75InView, section100InView]);
  
  // Report progress to parent component & API
  useEffect(() => {
    if (readProgress > lastReportedProgress) {
      setLastReportedProgress(readProgress);
      
      if (onProgress) {
        onProgress({ progressPercent: readProgress });
      }
      
      // Report to API if courseId and lessonId are provided
      if (courseId && lessonId && readProgress > 0) {
        reportProgress(readProgress);
      }
    }
  }, [readProgress, lastReportedProgress, onProgress, courseId, lessonId]);
  
  const reportProgress = useCallback(async (progress) => {
    try {
      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          progressPercent: progress,
          completed: progress >= 90
        })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [courseId, lessonId]);
  
  // Split content into 4 sections for progress tracking
  const renderContentWithProgressTracking = () => {
    if (!content) return null;
    
    // If content is HTML
    if (content.startsWith('<') && content.includes('</')) {
      const contentEl = document.createElement('div');
      contentEl.innerHTML = content;
      const textContent = contentEl.textContent || '';
      const totalLength = textContent.length;
      const sectionLength = Math.floor(totalLength / 4);
      
      return (
        <div ref={contentRef} className="text-content" dangerouslySetInnerHTML={{ __html: content }}>
          {/* Progress tracking elements will be injected after render */}
        </div>
      );
    } 
    
    // If content is plain text
    else {
      const totalLength = content.length;
      const sectionLength = Math.floor(totalLength / 4);
      
      const section1 = content.substring(0, sectionLength);
      const section2 = content.substring(sectionLength, sectionLength * 2);
      const section3 = content.substring(sectionLength * 2, sectionLength * 3);
      const section4 = content.substring(sectionLength * 3);
      
      return (
        <div ref={contentRef} className="text-content">
          <div className="section">
            {section1}
            <div ref={section25Ref} className="progress-marker" style={{height: 0}}></div>
          </div>
          <div className="section">
            {section2}
            <div ref={section50Ref} className="progress-marker" style={{height: 0}}></div>
          </div>
          <div className="section">
            {section3}
            <div ref={section75Ref} className="progress-marker" style={{height: 0}}></div>
          </div>
          <div className="section">
            {section4}
            <div ref={section100Ref} className="progress-marker" style={{height: 0}}></div>
          </div>
        </div>
      );
    }
  };
  
  // Add progress markers to HTML content after render
  useEffect(() => {
    if (!contentRef.current || !content || !content.startsWith('<')) return;
    
    const contentEl = contentRef.current;
    const allElements = Array.from(contentEl.querySelectorAll('*'));
    
    if (allElements.length < 8) return; // Not enough elements for meaningful tracking
    
    // Create invisible marker elements at 25%, 50%, 75%, and 100% positions
    const marker25El = document.createElement('div');
    marker25El.className = 'progress-marker';
    marker25El.style.height = '0px';
    section25Ref(marker25El);
    
    const marker50El = document.createElement('div');
    marker50El.className = 'progress-marker';
    marker50El.style.height = '0px';
    section50Ref(marker50El);
    
    const marker75El = document.createElement('div');
    marker75El.className = 'progress-marker';
    marker75El.style.height = '0px';
    section75Ref(marker75El);
    
    const marker100El = document.createElement('div');
    marker100El.className = 'progress-marker';
    marker100El.style.height = '0px';
    section100Ref(marker100El);
    
    // Insert markers at appropriate positions
    const position25 = Math.floor(allElements.length * 0.25);
    const position50 = Math.floor(allElements.length * 0.5);
    const position75 = Math.floor(allElements.length * 0.75);
    
    allElements[position25]?.appendChild(marker25El);
    allElements[position50]?.appendChild(marker50El);
    allElements[position75]?.appendChild(marker75El);
    allElements[allElements.length - 1]?.appendChild(marker100El);
    
  }, [content, section25Ref, section50Ref, section75Ref, section100Ref]);
  
  if (!content) {
    return (
      <div className="text-content-empty p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No content available for this lesson.</p>
      </div>
    );
  }
  
  return (
    <div className="text-content-wrapper">
      <div className="text-content-progress sticky top-0 z-10 bg-white border-b">
        <div className="progress-bar h-1 bg-gray-200">
          <div 
            className="progress-fill h-full bg-primary"
            style={{ width: `${readProgress}%` }}
            role="progressbar"
            aria-valuenow={readProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-2 py-1">
          <span>Reading Progress</span>
          <span>{readProgress}%</span>
        </div>
      </div>
      
      <article className="text-content prose prose-lg max-w-none p-2 sm:p-6">
        {renderContentWithProgressTracking()}
      </article>
    </div>
  );
};

TextContent.propTypes = {
  content: PropTypes.string,
  courseId: PropTypes.string,
  lessonId: PropTypes.string,
  onProgress: PropTypes.func
};

export default TextContent;