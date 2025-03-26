import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/buttons/Button';
import { useAuth } from '../../hooks/useAuth';
import DiscussionThread from './DiscussionThread';
import NewThreadForm from './NewThreadForm';

export default function DiscussionForum({ courseId }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/discussions?sort=${sortBy}`);
        if (!response.ok) {
          throw new Error('Failed to fetch discussions');
        }
        const data = await response.json();
        setThreads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [courseId, sortBy]);
  
  const handleCreateThread = async (threadData) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: threadData.title,
          content: threadData.content,
          userId: user.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create thread');
      }
      
      const newThread = await response.json();
      setThreads(prev => [newThread, ...prev]);
      setShowNewThreadForm(false);
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading discussions...</div>;
  }
  
  return (
    <div className="discussion-forum">
      <div className="forum-header">
        <h1>Course Discussions</h1>
        <Button 
          variant="primary"
          onClick={() => setShowNewThreadForm(true)}
        >
          New Thread
        </Button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showNewThreadForm && (
        <NewThreadForm 
          onSubmit={handleCreateThread}
          onCancel={() => setShowNewThreadForm(false)}
        />
      )}
      
      <div className="sort-controls">
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="replies">Most Replies</option>
        </select>
      </div>
      
      <div className="thread-list">
        {threads.length === 0 ? (
          <div className="empty-state">
            <p>No discussions yet. Be the first to start a thread!</p>
          </div>
        ) : (
          threads.map(thread => (
            <DiscussionThread 
              key={thread.id}
              thread={thread}
              onClick={() => router.push(`/courses/${courseId}/discussions/${thread.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}