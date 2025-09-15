import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseContentPage.css';
import DraggableTimer from './DraggableTimer'; // Import the new component

const CourseContentPage = ({ roadmapId, onClose }) => {
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

  // Mock course data
  const courseData = useMemo(() => ({
    title: "Web Development Mastery",
    description: "Master full-stack web development from frontend basics to advanced backend systems.",
    instructor: "Sarah Johnson",
    rating: 4.8,
    studentCount: 15420,
    difficulty: "Beginner to Advanced",
    duration: "8-12 months",
    moduleCount: 4,
    lessonCount: 20,
    modules: [
        {
            id: 0,
            title: "HTML, CSS & JavaScript Fundamentals",
            duration: "6-8 weeks",
            lessonCount: 6,
            icon: "🌐",
            description: "Learn the building blocks of web development",
            lessons: [
                { id: 1, title: "Introduction to Web Development", description: "Overview of web development, tools, and career paths", duration: "2 hours", type: "video", resources: 3, completed: false },
                { id: 2, title: "HTML Structure & Semantics", description: "Understanding HTML elements, attributes, and semantic markup", duration: "4 hours", type: "video", resources: 5, completed: false },
                { id: 3, title: "CSS Styling & Layout", description: "Styling web pages with CSS, flexbox, and grid", duration: "6 hours", type: "project", resources: 8, completed: false },
                { id: 4, title: "JavaScript Fundamentals", description: "Variables, functions, objects, and DOM manipulation", duration: "8 hours", type: "video", resources: 12, completed: false },
                { id: 5, title: "Responsive Web Design", description: "Creating mobile-first, responsive websites", duration: "5 hours", type: "project", resources: 7, completed: false },
                { id: 6, title: "Module Assessment", description: "Test your knowledge with a comprehensive quiz", duration: "1 hour", type: "quiz", resources: 1, completed: false }
            ]
        },
        {
            id: 1,
            title: "Frontend Frameworks (React)",
            duration: "8-10 weeks",
            lessonCount: 8,
            icon: "⚛️",
            description: "Master modern frontend development with React",
            lessons: [
                { id: 7, title: "Introduction to React", description: "Understanding components, JSX, and the React ecosystem", duration: "3 hours", type: "video", resources: 4, completed: false },
                { id: 8, title: "State Management & Hooks", description: "useState, useEffect, and custom hooks", duration: "5 hours", type: "video", resources: 6, completed: false },
                { id: 9, title: "Component Composition", description: "Building reusable components and component patterns", duration: "4 hours", type: "project", resources: 5, completed: false },
                { id: 10, title: "Routing & Navigation", description: "React Router and single-page application navigation", duration: "3 hours", type: "video", resources: 3, completed: false }
            ]
        },
        {
            id: 2,
            title: "Backend Development (Node.js)",
            duration: "6-8 weeks",
            lessonCount: 6,
            icon: "🛠️",
            description: "Server-side development with Node.js and Express",
            lessons: [
                { id: 11, title: "Node.js Fundamentals", description: "Server-side JavaScript and npm ecosystem", duration: "4 hours", type: "video", resources: 5, completed: false },
                { id: 12, title: "Express.js & APIs", description: "Building RESTful APIs with Express framework", duration: "6 hours", type: "project", resources: 8, completed: false }
            ]
        }
    ]
  }), []);

  // useEffects and other hooks
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
  }, [courseData.modules, activeModule, searchTerm, filterType, showCompleted, completedLessons]);

  const overallProgress = useMemo(() => {
    const totalLessons = courseData.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    return totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  }, [courseData.modules, completedLessons]);

  // Event handlers
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
            const progressPercent = Math.round((completedInModule / module.lessons.length) * 100);
            return (
              <div key={module.id} className={`module-item ${index === activeModule ? 'active' : ''}`} onClick={() => handleModuleChange(index)}>
                <div className="module-header">
                  <span className="module-icon">{module.icon}</span>
                  <h3 className="module-title">{module.title}</h3>
                  <div className={`module-progress-circle ${progressPercent === 100 ? 'completed' : ''}`}>
                    {progressPercent === 100 ? '✓' : `${progressPercent}%`}
                  </div>
                </div>
                <div className="module-info">{module.duration} • {module.lessonCount} lessons</div>
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
        <div className="course-badge">Web Development</div>
        <h1>{courseData.title}</h1>
        <p className="course-description">{courseData.description}</p>
        <div className="course-meta">
          <div className="meta-item"><div className="meta-icon">👨‍🏫</div><div className="meta-info"><h3>Instructor</h3><p>{courseData.instructor}</p></div></div>
          <div className="meta-item"><div className="meta-icon">⭐</div><div className="meta-info"><h3>Rating</h3><p>{courseData.rating} ({courseData.studentCount.toLocaleString()} students)</p></div></div>
          <div className="meta-item"><div className="meta-icon">🎯</div><div className="meta-info"><h3>Difficulty</h3><p>{courseData.difficulty}</p></div></div>
        </div>
        <div className="course-stats">
          <div className="stat-item"><span className="stat-number">{courseData.duration}</span><span className="stat-label">Duration</span></div>
          <div className="stat-item"><span className="stat-number">{courseData.moduleCount}</span><span className="stat-label">Modules</span></div>
          <div className="stat-item"><span className="stat-number">{courseData.lessonCount}</span><span className="stat-label">Lessons</span></div>
        </div>
      </div>

      <div className="course-content">
        <main className="main-content slide-in-right">
          <div className="content-header">
            <div className="module-title-main"><span className="module-icon-main">{currentModule?.icon}</span><h2>{currentModule?.title}</h2></div>
            <div className="module-meta">
              <div className="meta-badge"><span>📅</span>Duration: {currentModule?.duration}</div>
              <div className="meta-badge"><span>📚</span>{currentModule?.lessonCount} lessons</div>
            </div>
          </div>
          <div className="content-controls">
            <div className="search-container">
              <input type="text" placeholder="Search lessons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filter-group">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                <option value="all">All Types</option><option value="video">Video</option><option value="reading">Reading</option><option value="quiz">Quiz</option><option value="project">Project</option>
              </select>
              <label className="checkbox-container">
                <div className={`checkbox ${showCompleted ? 'checked' : ''}`}></div>
                <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} style={{ display: 'none' }} /> Show Completed
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
                  <span className="lesson-duration">{lesson.resources} resources</span>
                  <button className="preview-button" onClick={(e) => { e.stopPropagation(); handleLessonPreview(lesson); }}>👁️ Preview</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* The new draggable timer component is placed here */}
      <DraggableTimer /> 

      {showNotes && (
        <div className="notes-panel glass-effect">
          <div className="notes-header"><h3 className="notes-title">📝 Study Notes</h3><button onClick={() => setShowNotes(false)} className="close-notes">✕</button></div>
          <div className="notes-content"><textarea placeholder="Write your notes here..." value={notes[selectedLesson?.id] || ''} onChange={(e) => handleNotesChange(selectedLesson?.id, e.target.value)} className="notes-textarea" /></div>
        </div>
      )}
      {showLessonPreview && selectedLesson && (
        <div className="modal-overlay" onClick={() => setShowLessonPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{selectedLesson.title}</h2><button onClick={() => setShowLessonPreview(false)}>✕</button></div>
            <div className="modal-body"><p>{selectedLesson.description}</p><div className="lesson-preview-meta"><span>Duration: {selectedLesson.duration}</span><span>Type: {selectedLesson.type}</span><span>Resources: {selectedLesson.resources}</span></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CourseContentPage);