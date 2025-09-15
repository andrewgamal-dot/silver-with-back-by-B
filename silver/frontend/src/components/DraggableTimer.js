import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DraggableTimer.css';

const DraggableTimer = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 250, y: window.innerHeight - 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const timerRef = useRef(null);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
        }
    }, [isDragging, dragStart.x, dragStart.y]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
    };

    const toggleVisibility = () => setIsTimerVisible(!isTimerVisible);

    return (
        <>
            <button onClick={toggleVisibility} className="timer-toggle-button">⏱️</button>
            {isTimerVisible && (
                <div
                    className="draggable-timer-container"
                    style={{ top: `${position.y}px`, left: `${position.x}px` }}
                    ref={timerRef}
                    onMouseDown={handleMouseDown}
                >
                    <div className="timer-display">{formatTime(time)}</div>
                    <div className="timer-controls">
                        <button onClick={toggleTimer} className={`timer-button ${!isRunning ? 'primary' : ''}`}>
                            {isRunning ? 'Pause' : 'Start'}
                        </button>
                        <button onClick={resetTimer} className="timer-button">Reset</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DraggableTimer;