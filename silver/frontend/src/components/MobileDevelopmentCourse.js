import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseContentPage.css';
import { mobileDevContent as courseData } from '../data/mobileDevCourseData'; 
import DraggableTimer from './DraggableTimer';

const getYouTubeEmbedUrl = (url) => {
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    } else {
      const pathParts = urlObj.pathname.split('/');
      videoId = pathParts[pathParts.length - 1];
    }
  } catch (error) {
    const parts = url.split('/');
    videoId = parts[parts.length - 1];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};


const MobileDevelopmentCourse = ({ onClose }) => {
  // State management
  const [activeModule, setActiveModule] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonPreview, setShowLessonPreview] = useState(false);
  const [notes, setNotes] = useState({});
  const [showNotes, setShowNotes] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Calculate total lesson and module counts from your data
  const totalLessonCount = useMemo(() => courseData.modules.reduce((sum, module) => sum + module.lessons.length, 0), []);
  const totalModuleCount = courseData.modules.length;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredLessons = useMemo(() => {
    const currentModule = courseData.modules[activeModule];
    if (!currentModule) return [];
    return currentModule.lessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || lesson.type === filterType;
      const matchesCompleted = showCompleted || !completedLessons.includes(lesson.id);
      return matchesSearch && matchesFilter && matchesCompleted;
    });
  }, [activeModule, searchTerm, filterType, showCompleted, completedLessons]);

  const overallProgress = useMemo(() => {
    if (totalLessonCount === 0) return 0;
    return Math.round((completedLessons.length / totalLessonCount) * 100);
  }, [completedLessons, totalLessonCount]);

  const handleModuleChange = useCallback((moduleIndex) => {
    setActiveModule(moduleIndex);
    setSearchTerm('');
    setFilterType('all');
    setIsSidebarOpen(false);
  }, []);

  const handleLessonComplete = useCallback((lessonId) => {
    setCompletedLessons(prev => prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]);
  }, []);
  
  const handleLessonPreview = useCallback((lesson) => {
    setSelectedLesson(lesson);
    setShowLessonPreview(true);
  }, []);

  const handleNotesChange = useCallback((lessonId, noteText) => {
    setNotes(prev => ({ ...prev, [lessonId]: noteText }));
  }, []);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate('/roadmaps');
    }
  }, [navigate, onClose]);

  if (isLoading) {
    return (
      <div className="course-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading course content...</p>
        </div>
      </div>
    );
  }

  const currentModule = courseData.modules[activeModule];

  return (
    <div className="course-page fade-in">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <button onClick={() => setIsSidebarOpen(true)} className="sidebar-toggle-button">
        ☰
      </button>

      <aside className={`course-sidebar slide-in-left ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Course Modules</h2>
          <button className="sidebar-close-button" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <div className="modules-list">
          {courseData.modules.map((module, index) => {
            const completedInModule = module.lessons.filter(lesson => completedLessons.includes(lesson.id)).length;
            const progressPercent = module.lessons.length > 0 ? Math.round((completedInModule / module.lessons.length) * 100) : 0;
            return (
              <div key={module.id} className={`module-item ${index === activeModule ? 'active' : ''}`} onClick={() => handleModuleChange(index)}>
                <div className="module-header">
                  <span className="module-icon">{module.icon}</span>
                  <h3 className="module-title">{module.title}</h3>
                  <div className={`module-progress-circle ${progressPercent === 100 ? 'completed' : ''}`}>
                    {progressPercent === 100 ? '✓' : `${progressPercent}%`}
                  </div>
                </div>
                <div className="module-info">{module.duration} • {module.lessons.length} lessons</div>
              </div>
            );
          })}
        </div>
      </aside>
      
      <header className="course-header">
        <button onClick={handleBack} className="back-button">
          <span>←</span>
          Back to Roadmaps
        </button>
        <h1 className="course-title">Silver Code Line</h1>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <span className="progress-text">Progress: {overallProgress}%</span>
        </div>
      </header>

      <div className="course-overview">
        <div className="course-badge">Mobile Development</div>
        <h1>{courseData.title}</h1>
        <p className="course-description">{courseData.description}</p>
        <div className="course-meta">
          <div className="meta-item"><div className="meta-icon">👨‍🏫</div><div className="meta-info"><h3>Instructor</h3><p>{courseData.instructor}</p></div></div>
          <div className="meta-item"><div className="meta-icon">⭐</div><div className="meta-info"><h3>Rating</h3><p>{courseData.rating} ({courseData.students.toLocaleString()} students)</p></div></div>
          <div className="meta-item"><div className="meta-icon">🎯</div><div className="meta-info"><h3>Difficulty</h3><p>{courseData.difficulty}</p></div></div>
        </div>
        <div className="course-stats">
          <div className="stat-item"><span className="stat-number">{courseData.duration}</span><span className="stat-label">Duration</span></div>
          <div className="stat-item"><span className="stat-number">{totalModuleCount}</span><span className="stat-label">Modules</span></div>
          <div className="stat-item"><span className="stat-number">{totalLessonCount}</span><span className="stat-label">Lessons</span></div>
        </div>
      </div>

      <div className="course-content">
        <main className="main-content slide-in-right">
          <div className="content-header">
            <div className="module-title-main"><span className="module-icon-main">{currentModule?.icon}</span><h2>{currentModule?.title}</h2></div>
            <div className="module-meta">
              <div className="meta-badge"><span>📅</span>Duration: {currentModule?.duration}</div>
              <div className="meta-badge"><span>📚</span>{currentModule?.lessons.length} lessons</div>
            </div>
          </div>
          <div className="content-controls">
            <div className="search-container">
              <input type="text" placeholder="Search lessons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filter-group">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                <option value="all">All Types</option><option value="video">Video</option><option value="project">Project</option>
              </select>
              <label className="checkbox-container">
                <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} /> Show Completed
              </label>
              <button onClick={() => setShowNotes(!showNotes)} className="filter-select" style={{ background: showNotes ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)' }}>📝 Show Notes</button>
            </div>
          </div>
          <div className="lessons-container">
            {filteredLessons.map((lesson, index) => (
              <div key={lesson.id} className={`lesson-item ${completedLessons.includes(lesson.id) ? 'completed' : ''} hover-lift`} onClick={() => handleLessonComplete(lesson.id)}>
                <div className={`lesson-number ${completedLessons.includes(lesson.id) ? 'completed' : ''}`}>{completedLessons.includes(lesson.id) ? '✓' : index + 1}</div>
                <div className="lesson-content"><h3 className="lesson-title">{lesson.title}</h3><p className="lesson-description">{lesson.description}</p></div>
                <div className="lesson-meta">
                  <span className="lesson-duration">{lesson.duration}</span>
                  <span className={`lesson-type ${lesson.type}`}>{lesson.type}</span>
                  <span className="lesson-duration">{lesson.resources.length} resources</span>
                  <button className="preview-button" onClick={(e) => { e.stopPropagation(); handleLessonPreview(lesson); }}>👁️ Preview</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <DraggableTimer />

      {showNotes && (
        <div className="notes-panel glass-effect">
          <div className="notes-header"><h3 className="notes-title">📝 Study Notes</h3><button onClick={() => setShowNotes(false)} className="close-notes">✕</button></div>
          <div className="notes-content"><textarea placeholder="Write your notes here..." value={notes[selectedLesson?.id] || ''} onChange={(e) => handleNotesChange(selectedLesson?.id, e.target.value)} className="notes-textarea" /></div>
        </div>
      )}

      {/* MODIFIED: Lesson Preview Modal now includes video */}
      {showLessonPreview && selectedLesson && (
        <div className="modal-overlay" onClick={() => setShowLessonPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>{selectedLesson.title}</h2>
                <button onClick={() => setShowLessonPreview(false)}>✕</button>
            </div>
            <div className="modal-body">
                {selectedLesson.videoUrl && (
                    <div className="video-container">
                        <iframe
                            src={getYouTubeEmbedUrl(selectedLesson.videoUrl)}
                            title={selectedLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                <p>{selectedLesson.preview}</p>
                <div className="lesson-preview-meta">
                    <span><strong>Duration:</strong> {selectedLesson.duration}</span>
                    <span><strong>Type:</strong> {selectedLesson.type}</span>
                    <span><strong>Difficulty:</strong> {selectedLesson.difficulty}</span>
                </div>
                 <div className="resources-section">
                    <h3>Resources</h3>
                    <ul>
                        {selectedLesson.resources.map((res, index) => <li key={index}>{res}</li>)}
                    </ul>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDevelopmentCourse;