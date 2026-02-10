import React from "react";
import { Link } from "react-router-dom";
import "./InstallGuide.css";

export const InstallGuide = () => {
    return (
        <div className="install-guide-container">
            <div className="install-header">
                <Link to="/" className="back-link">
                    &larr; <span className="back-text">Back</span>
                </Link>
                <h1>Installation Guide</h1>
            </div>

            <div className="scroll-hint">
                <p>Scroll down for iOS / Safari users 👇</p>
            </div>

            <div className="video-container">
                <video
                    src="/installation-guide.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="install-video"
                />
            </div>

            <div className="video-container">
                <h3 style={{ textAlign: 'center', margin: '20px 0 10px' }}>For ios & safari users</h3>
                <video
                    src="/IOS%20add%20to%20home%20screen.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="install-video"
                />
            </div>

            <div className="instructions-container">
                <div className="step-card">
                    <div className="step-number">1</div>
                    <p>Open the link in your browser</p>
                </div>

                <div className="step-card">
                    <div className="step-number">2</div>
                    <p>
                        <strong>Android:</strong> Open options/menu (three dots)<br />
                        <strong>iOS:</strong> Tap the Share icon
                    </p>
                </div>

                <div className="step-card">
                    <div className="step-number">3</div>
                    <p>Scroll down</p>
                </div>

                <div className="step-card">
                    <div className="step-number">4</div>
                    <p>Click "Add to Home Screen"</p>
                </div>

                <div className="step-card">
                    <div className="step-number">5</div>
                    <p>Click "Install"</p>
                </div>

                <div className="success-message">
                    🎉 The app is on your home screen now!
                </div>

                <div className="ios-note">
                    <p>For a clear iOS installation, please check the following video:</p>
                    <a href="https://www.youtube.com/watch?v=XzJ3MbN6D2A" target="_blank" rel="noopener noreferrer" className="youtube-link">
                        Watch iOS Guide on YouTube
                    </a>
                </div>
            </div>
        </div>
    );
};
