import React, { useState } from 'react';
import './About.css';

const AccordionItem = ({ title, isOpen, onClick, children }) => {
    return (
        <div className={`accordion-item ${isOpen ? 'expanded' : ''}`}>
            <button className="accordion-header" onClick={onClick} aria-expanded={isOpen}>
                <span className="accordion-title">{title}</span>
                <span className="accordion-icon">▼</span>
            </button>
            <div className="accordion-content">
                <div className="accordion-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const About = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const sections = [
        {
            title: "The Problem",
            content: (
                <>
                    <p>
                        At our college, access to the daily food menu has traditionally been inconvenient and fragmented.
                        Menus are usually shared through Outlook emails, requiring students to search for the sender, open the message,
                        and download the menu file—often repeating the same steps every day.
                    </p>
                    <p>
                        This process creates unnecessary friction. If the menu is not downloaded, students must go through the entire
                        email flow again. If it is downloaded, it results in duplicate storage across Outlook and local devices,
                        which is inefficient and avoidable.
                    </p>
                    <p>
                        Previously, a Discord-based server was used to share menus, but after it was discontinued, there was no simple,
                        centralized alternative. As a result, checking the menu became a repetitive and time-consuming task rather
                        than a quick, everyday action.
                    </p>
                    <p>
                        MenU was created to remove this friction and provide students with a single, reliable, and easily accessible
                        place to view the college menu—without repeated downloads, searching through emails, or relying on discontinued platforms.
                    </p>
                </>
            )
        },
        {
            title: "How MenU Started",
            content: (
                <>
                    <p>
                        MenU began as a small initiative to solve a recurring, everyday inconvenience faced by students at my college—accessing
                        the daily food menu quickly and reliably.
                    </p>
                    <p>
                        After the existing Discord-based solution was discontinued and menus continued to be shared through emails, it became
                        clear that there was no dedicated system focused purely on menu accessibility. Instead of relying on temporary workarounds,
                        MenU was built as a simple, focused platform to centralize menu access for students.
                    </p>
                    <p>
                        What started as a minimal solution to replace scattered sharing methods gradually evolved into a structured application,
                        with an emphasis on ease of use, low friction, and real-world usability within the college environment.
                    </p>
                    <p>
                        MenU remains intentionally scoped to address this specific problem, prioritizing reliability and simplicity over unnecessary features.
                    </p>
                </>
            )
        },
        {
            title: "What MenU Does",
            content: (
                <>
                    <p>MenU provides a focused set of features designed to make accessing the college food menu quick and frictionless:</p>
                    <ul>
                        <li>Displays the complete college menu in a clean, mobile-friendly interface</li>
                        <li>Categorizes items clearly for easy scanning and understanding</li>
                        <li>Allows students to express feedback through voting on menu items</li>
                        <li>Enables menu updates to be reflected instantly without requiring re-downloads</li>
                        <li>Provides a single, shareable link that works consistently across devices</li>
                    </ul>
                    <p>Each feature is built to reduce repeated effort and make checking the menu a fast, everyday action rather than a task.</p>
                </>
            )
        },
        {
            title: "How to Use MenU",
            content: (
                <>
                    <p>Using MenU is designed to be quick and effortless:</p>
                    <ul>
                        <li>Open the MenU link from any browser on your device</li>
                        <li>Browse the menu items directly without downloading files</li>
                        <li>Vote on items to share feedback</li>
                        <li>Share the menu link with others when needed</li>
                    </ul>
                    <p>
                        For easier access, a short guide video is provided that shows how to add MenU as a shortcut on your home screen.
                        This allows you to open the menu like a regular app, without searching for the link each time.
                    </p>
                </>
            )
        },
        {
            title: "Technology & Design Principles",
            content: (
                <>
                    <p>MenU is built using a modern web stack with a focus on reliability and simplicity:</p>
                    <ul>
                        <li><strong>Frontend</strong> built with React for a responsive and interactive user experience</li>
                        <li><strong>Backend</strong> powered by Node.js and Express for efficient request handling</li>
                        <li><strong>MongoDB</strong> used for flexible and scalable data storage</li>
                    </ul>
                    <p>Beyond the technology itself, MenU follows a few core design principles:</p>
                    <ul>
                        <li><span className="highlight-text">Simplicity first</span> — only features that solve real problems are included</li>
                        <li><span className="highlight-text">Low friction</span> — no mandatory logins or unnecessary steps to access the menu</li>
                        <li><span className="highlight-text">Real-time updates</span> — changes are reflected instantly without manual refreshes or downloads</li>
                        <li><span className="highlight-text">College-focused scope</span> — the app is intentionally designed around current college needs</li>
                    </ul>
                    <p>These principles guide both current development and future decisions.</p>
                </>
            )
        },
        {
            title: "Contributors & Ownership",
            content: (
                <>
                    <p>MenU is currently designed, developed, and maintained by <strong>Shanmukha Padma Kumar Challa</strong>.</p>
                    <p>
                        The project is open-sourced under the GNU General Public License (GPL), ensuring that the code remains free and open,
                        and that any modifications or redistributions follow the same licensing terms.
                    </p>
                    <p>
                        The project is actively maintained and continues to evolve based on real usage and student feedback within the college.
                        Contributions, suggestions, and constructive feedback are welcome.
                    </p>
                </>
            )
        },
        {
            title: "Contact & Feedback",
            content: (
                <>
                    <p>Feedback and suggestions are always welcome and help improve MenU for everyone using it within the college.</p>
                    <p>
                        If you encounter any issues, have ideas for improvement, or want to contribute, you can reach out through the project’s
                        repository or contact the maintainer directly.
                    </p>
                    <p>MenU is built with the intention of evolving based on real student needs, and constructive feedback is always appreciated.</p>
                </>
            )
        }
    ];

    return (
        <div className="about-container">
            <div className="about-header">
                <h1 className="about-title">About MenU</h1>
            </div>

            <div className="intro-section">
                <p>
                    <strong>MenU</strong> is a lightweight, community-driven digital menu platform designed to simplify how
                    food menus are accessed, managed, and shared.
                </p>
                <p>
                    It helps students and customers quickly discover menu items, while enabling food outlets to
                    keep menus updated in real time.
                </p>
                <p>
                    MenU focuses on simplicity, accessibility, and transparency—without unnecessary complexity or overhead.
                </p>
            </div>

            <div className="accordion-container">
                {sections.map((section, index) => (
                    <AccordionItem
                        key={index}
                        title={section.title}
                        isOpen={openSection === index}
                        onClick={() => toggleSection(index)}
                    >
                        {section.content}
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};
