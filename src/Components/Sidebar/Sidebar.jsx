import React, { useContext, useState } from 'react';
import './sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const context = useContext(Context);

    if (!context) {
        console.error("Error: Context is undefined! Ensure ContextProvider wraps Sidebar.");
        return null;
    }

    const { onSent, previousPrompt, setRecentPrompt, newChat } = context;

    const loadPrompt = async (prompt) => {
        try {
            setRecentPrompt(prompt);
            await onSent(prompt);
        } catch (error) {
            console.error("Error in loadPrompt:", error);
        }
    };

    return (
        <div className='sidebar'>
            <div className="top">
                <img
                    onClick={() => {
                        console.log("Toggling sidebar. Current state:", extended);
                        setExtended(prev => !prev);
                    }}
                    className='menu'
                    src={assets.menu_icon}
                    alt="Menu Icon"
                />
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="New Chat" />
                    {extended && <p>New Chat</p>}
                </div>

                {extended && previousPrompt.length > 0 ? (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {previousPrompt.map((item, index) => (
                            <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                                <img src={assets.message_icon} alt="Message Icon" />
                                <p>{item ? item.slice(0, 18) + "..." : "No prompt"}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    extended && <p className="no-prompts">No recent prompts</p>
                )}
            </div>

            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="Help Icon" />
                    {extended && <p>Help</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="Activity Icon" />
                    {extended && <p>Activity</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="Settings Icon" />
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
