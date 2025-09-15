import React, { useEffect } from 'react';
import { roadmaps } from '../data/roadmaps';

function Modal({ isOpen, onClose, roadmapId }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const roadmap = roadmaps.find(r => r.id === roadmapId);

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <div className="modal-header">
                    <div className="modal-icon">{roadmap.icon}</div>
                    <h2>{roadmap.title}</h2>
                </div>
                <div className="modal-body">
                    <p className="modal-description">{roadmap.description}</p>
                    
                    <div className="modal-stats">
                        <div className="modal-stat">
                            <span className="stat-icon">⏱️</span>
                            <div className="stat-info">
                                <h4>Duration</h4>
                                <p>{roadmap.duration}</p>
                            </div>
                        </div>
                        <div className="modal-stat">
                            <span className="stat-icon">📚</span>
                            <div className="stat-info">
                                <h4>Phases</h4>
                                <p>{roadmap.phases} phases</p>
                            </div>
                        </div>
                        <div className="modal-stat">
                            <span className="stat-icon">👥</span>
                            <div className="stat-info">
                                <h4>Active Learners</h4>
                                <p>{roadmap.learners}</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-steps">
                        <h3>Learning Path</h3>
                        <ul>
                            {roadmap.steps.map((step, index) => (
                                <li key={index}>
                                    <span className="step-number">{index + 1}</span>
                                    <div className="step-content">
                                        <h4>Phase {index + 1}</h4>
                                        <p>{step}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-button primary" onClick={() => {
                        // TODO: Implement start learning functionality
                        console.log('Start learning:', roadmap.id);
                    }}>
                        Start Learning
                    </button>
                    <button className="modal-button secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal; 