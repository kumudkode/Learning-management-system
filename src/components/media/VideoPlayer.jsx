import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function VideoPlayer({ 
  src, 
  poster, 
  title,
  courseId,
  lessonId,
  onProgress,
  autoTrack = true
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [lastReportedProgress, setLastReportedProgress] = useState(0);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Load saved progress if available
    const loadProgress = async () => {
      if (!courseId || !lessonId) return;
      
      try {
        const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`);
        if (response.ok) {
          const data = await response.json();
          if (data.progressSeconds && videoRef.current) {
            videoRef.current.currentTime = data.progressSeconds;
            setProgress(data.progressSeconds);
          }
        }
      } catch (error) {
        console.error('Error loading video progress:', error);
      }
    };
    
    loadProgress();
    
    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [courseId, lessonId]);
  
  // Track and report progress
  useEffect(() => {
    if (!autoTrack || !courseId || !lessonId) return;
    
    const progressInterval = setInterval(() => {
      if (isPlaying && progress > 0 && Math.abs(progress - lastReportedProgress) > 10) {
        reportProgress(progress);
        setLastReportedProgress(progress);
      }
    }, 30000); // Report every 30 seconds while playing
    
    return () => clearInterval(progressInterval);
  }, [isPlaying, progress, lastReportedProgress, courseId, lessonId, autoTrack]);
  
  const reportProgress = async (seconds) => {
    try {
      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          progressSeconds: seconds,
          completed: seconds / duration > 0.9 // Mark as completed if watched 90%
        })
      });
      
      if (onProgress) {
        onProgress({
          progressSeconds: seconds,
          progressPercent: (seconds / duration) * 100,
          completed: seconds / duration > 0.9
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };
  
  const handleToggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  
  const handleSeek = (e) => {
    const seekPosition = parseFloat(e.target.value);
    videoRef.current.currentTime = seekPosition;
    setProgress(seekPosition);
  };
  
  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen();
    }
  };
  
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    // In a real implementation, this would switch video sources
  };
  
  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div 
      ref={playerRef}
      className={`video-player ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="video-element"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          reportProgress(duration);
        }}
      />
      
      {title && (
        <div className="video-title">
          <h3>{title}</h3>
        </div>
      )}
      
      {showControls && (
        <div className="controls">
          <div className="progress-bar">
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="seek-slider"
            />
          </div>
          
          <div className="control-buttons">
            <button onClick={togglePlay} className="play-pause">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="time-display">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
            
            <div className="volume-control">
              <button onClick={handleToggleMute} className="mute-button">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            
            <div className="playback-settings">
              <button onClick={() => setShowSettingsMenu(prev => !prev)} className="settings-button">
                <Settings size={20} />
              </button>
              
              {/* Playback rate dropdown would be implemented here */}
            </div>
            
            <button onClick={handleFullscreen} className="fullscreen-button">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}