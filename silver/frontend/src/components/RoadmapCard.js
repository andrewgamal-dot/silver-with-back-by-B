import React, { useState } from 'react';

function RoadmapCard({ roadmap, onViewRoadmap, onTrackProgress }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleViewRoadmap = async () => {
        setIsLoading(true);
        await onViewRoadmap(roadmap.id);
        setIsLoading(false);
    };

    const handleTrackProgress = async () => {
        setIsLoading(true);
        await onTrackProgress(roadmap.id);
        setIsLoading(false);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div 
            className={`roadmap-card ${isHovered ? 'hovered' : ''} ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="roadmap-header">
                <div className="roadmap-icon">{roadmap.icon}</div>
                <h3>{roadmap.title}</h3>
            </div>
            <p>{roadmap.description}</p>
            <div className="roadmap-stats">
                <div className="stat">
                    <span>⏱️</span>
                    <span>{roadmap.duration}</span>
                </div>
                <div className="stat">
                    <span>📚</span>
                    <span>{roadmap.phases} phases</span>
                </div>
                <div className="stat">
                    <span>👥</span>
                    <span>{roadmap.learners} learners</span>
                </div>
            </div>
            <div className="roadmap-steps-container">
                <ul className={`roadmap-steps ${isExpanded ? 'expanded' : ''}`}>
                    {roadmap.steps.map((step, index) => (
                        <li key={index}>
                            <span className="step-number">{index + 1}</span>
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="roadmap-actions">
                <button 
                    className={`view-roadmap ${isLoading ? 'loading' : ''}`} 
                    onClick={handleViewRoadmap}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        'View Roadmap'
                    )}
                </button>
                <button 
                    className={`track-progress ${isLoading ? 'loading' : ''}`} 
                    onClick={handleTrackProgress}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        'Track Progress'
                    )}
                </button>
            </div>
        </div>
    );
}

export default RoadmapCard; 