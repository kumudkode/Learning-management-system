import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/buttons/Button';
import { FileUpload } from '../ui/forms/FileUpload';
import { TextEditor } from '../ui/forms/TextEditor';
import { useAuth } from '../../hooks/useAuth';

export default function AssignmentSubmission({ assignment, courseId }) {
  const [submissionType, setSubmissionType] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Basic validation
      if (submissionType === 'text' && !textContent.trim()) {
        throw new Error('Please enter your submission text');
      }
      
      if (submissionType === 'file' && files.length === 0) {
        throw new Error('Please upload at least one file');
      }
      
      // Prepare submission data
      const formData = new FormData();
      formData.append('assignmentId', assignment.id);
      formData.append('userId', user.id);
      formData.append('submissionType', submissionType);
      
      if (submissionType === 'text') {
        formData.append('textContent', textContent);
      } else {
        // Append each file to form data
        files.forEach(file => {
          formData.append('files', file);
        });
      }
      
      // Make API call to submit assignment
      const response = await fetch(`/api/assignments/submit`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit assignment');
      }
      
      // Redirect to confirmation page
      router.push(`/dashboard/courses/${courseId}/assignments/${assignment.id}/submitted`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="assignment-submission">
      <h1>{assignment.title}</h1>
      <div className="assignment-details">
        <p>{assignment.description}</p>
        <div className="meta">
          <div className="due-date">
            <strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
          </div>
          <div className="points">
            <strong>Points:</strong> {assignment.totalPoints}
          </div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="submission-type">
          <div className="tabs">
            <button 
              type="button"
              className={submissionType === 'text' ? 'active' : ''}
              onClick={() => setSubmissionType('text')}
            >
              Text Submission
            </button>
            <button 
              type="button"
              className={submissionType === 'file' ? 'active' : ''}
              onClick={() => setSubmissionType('file')}
            >
              File Upload
            </button>
          </div>
          
          <div className="submission-content">
            {submissionType === 'text' ? (
              <TextEditor 
                value={textContent} 
                onChange={setTextContent}
                placeholder="Enter your submission here..."
                minHeight="300px"
              />
            ) : (
              <FileUpload
                files={files}
                setFiles={setFiles}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
                allowedTypes={['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png']}
              />
            )}
          </div>
        </div>
        
        <div className="actions">
          <Button 
            type="button" 
            variant="outlined"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            isLoading={isSubmitting}
          >
            Submit Assignment
          </Button>
        </div>
      </form>
    </div>
  );
}