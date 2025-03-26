import { useState, useEffect } from 'react';
import { LineChart, BarChart } from '../ui/charts';
import { Card } from '../ui/cards/Card';
import { useAuth } from '../../hooks/useAuth';

export default function StudentProgressDashboard({ courseId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const endpoint = courseId 
          ? `/api/analytics/courses/${courseId}/progress?timeRange=${timeRange}` 
          : `/api/analytics/progress?timeRange=${timeRange}`;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to load analytics');
        
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [courseId, timeRange]);
  
  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }
  
  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }
  
  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>{courseId ? 'Course Progress Analytics' : 'My Learning Progress'}</h1>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="stats-overview">
        <Card className="stat-card">
          <h3>Completion Rate</h3>
          <div className="stat-value">{analytics.completionRate}%</div>
          <div className="stat-change">
            {renderTrend(analytics.completionRateTrend)}
          </div>
        </Card>
        
        <Card className="stat-card">
          <h3>Average Score</h3>
          <div className="stat-value">{analytics.averageScore}%</div>
          <div className="stat-change">
            {renderTrend(analytics.averageScoreTrend)}
          </div>
        </Card>
        
        <Card className="stat-card">
          <h3>Learning Hours</h3>
          <div className="stat-value">{analytics.learningHours}</div>
          <div className="stat-change">
            {renderTrend(analytics.learningHoursTrend)}
          </div>
        </Card>
        
        <Card className="stat-card">
          <h3>Assignments Completed</h3>
          <div className="stat-value">{analytics.assignmentsCompleted}</div>
          <div className="stat-change">
            {renderTrend(analytics.assignmentsCompletedTrend)}
          </div>
        </Card>
      </div>
      
      <div className="charts-container">
        <Card className="chart-card">
          <h3>Progress Over Time</h3>
          <LineChart 
            data={analytics.progressOverTime}
            xKey="date"
            yKey="progress"
            color="#4f46e5"
          />
        </Card>
        
        <Card className="chart-card">
          <h3>Time Spent by Module</h3>
          <BarChart 
            data={analytics.timeSpentByModule}
            xKey="module"
            yKey="minutes"
            color="#10b981"
          />
        </Card>
      </div>
      
      <div className="performance-section">
        <h2>Performance by Topic</h2>
        <div className="performance-grid">
          {analytics.performanceByTopic.map(topic => (
            <Card key={topic.id} className="topic-performance">
              <h3>{topic.name}</h3>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${topic.score}%`, backgroundColor: getScoreColor(topic.score) }}
                />
              </div>
              <div className="score">{topic.score}%</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function renderTrend(trend) {
  if (trend > 0) {
    return <span className="trend positive">↑ {trend}%</span>;
  } else if (trend < 0) {
    return <span className="trend negative">↓ {Math.abs(trend)}%</span>;
  }
  return <span className="trend neutral">0%</span>;
}

function getScoreColor(score) {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 60) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
}