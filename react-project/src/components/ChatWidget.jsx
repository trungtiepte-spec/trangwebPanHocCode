import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatWidget.css';

const CHAT_STORAGE_KEY = 'panhoccode_chat_history';

const formatTime = (isoString) => {
    try {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
};

const defaultMessages = [
    {
        id: 'welcome_1',
        sender: 'support',
        text: 'Hello 👋\nWhat problem are you experiencing today?',
        timestamp: new Date().toISOString(),
        hasLink: false,
    }
];

export default function ChatWidget() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(CHAT_STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultMessages;
        } catch {
            return defaultMessages;
        }
    });
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    // Save to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {
            console.error('Failed to save chat history', e);
        }
    }, [messages]);

    // Auto scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const text = inputText.trim();
        if (!text) return;

        const userMsg = {
            id: `msg_${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: new Date().toISOString(),
            hasLink: false,
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Auto reply after ~1 second
        setTimeout(() => {
            const supportReply = {
                id: `msg_${Date.now() + 1}`,
                sender: 'support',
                text: 'Please visit the following page for more details.',
                timestamp: new Date().toISOString(),
                hasLink: true,
            };
            setIsTyping(false);
            setMessages(prev => [...prev, supportReply]);
        }, 1000);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
        navigate('/help-center');
    };

    return (
        <>
            {/* Floating Zalo Chat Button */}
            <button
                className="chat-widget-fab"
                onClick={() => setIsOpen(open => !open)}
                aria-label="Customer Support Chat"
                title="Customer Support Chat"
                id="zalo-chat-fab"
            >
                {/* Zalo Icon SVG */}
                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                    <path d="M447.8 288.7c-9.6 44.7-33.1 82.6-70.1 113.6-37 31-82.6 46.5-136.8 46.5-27.4 0-54.8-5-82.2-15-4.1-1.4-8.2-1.4-12.3 0L76.8 460.6c-4.1 1.4-8.2 1.4-11-.7-2.7-2.1-4.1-5.5-3.4-9.6l11-63c.7-4.1 0-7.5-2-10.3C45.3 342.3 32 301.9 32 255.4c0-54.8 19.9-101.4 59.6-139.7C131.3 77.4 182.7 58.2 246 58.2c63.7 0 115 19.2 154 57.5 39 38.3 58.5 84.9 58.5 139.7-.7 11.7-3.4 22.7-10.7 33.3zM246 95.2c-53.4 0-96.6 15.8-129.5 47.3C83.6 174 67.2 211.7 67.2 255.4c0 37 10.3 69.9 30.8 98.6 4.8 6.8 6.2 14.4 4.1 22.6l-7.5 43.1 46.6-19.2c7.5-3.4 15.1-3.4 22.6-.7 23.3 9.6 46.6 14.4 69.9 14.4 53.4 0 96.6-15.8 129.5-47.3 32.9-31.5 49.3-69.2 49.3-112.9 0-43.8-16.4-81.5-49.3-112.9C342.6 111 299.4 95.2 246 95.2z"/>
                    <path d="M149.3 227.4h68.5v28.8h-41.1l41.1 53.4v6.8h-71.2v-28.8h41.1l-38.4-53.4v-6.8zm83.6 60.3c0-17.8 13.7-30.1 32.9-30.1s32.9 12.3 32.9 30.1c0 17.8-13.7 30.1-32.9 30.1s-32.9-12.3-32.9-30.1zm41.1 0c0-6.8-3.4-11.6-8.2-11.6s-8.2 4.8-8.2 11.6 3.4 11.6 8.2 11.6 8.2-4.8 8.2-11.6zm40.4 28.8v-87.7h24.7v87.7h-24.7z"/>
                </svg>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-header-avatar">
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>support_agent</span>
                            </div>
                            <div>
                                <h3 className="chat-header-title">Customer Support</h3>
                                <p className="chat-header-subtitle">We're here to help.</p>
                            </div>
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Chat"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                                <div className="chat-bubble">
                                    {msg.text}
                                    {msg.hasLink && (
                                        <div>
                                            <span className="chat-link" onClick={handleLinkClick}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                                                Help Center
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="chat-time">{formatTime(msg.timestamp)}</span>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="chat-msg-row support">
                                <div className="chat-typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form className="chat-input-bar" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            id="chat-input-field"
                        />
                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={!inputText.trim()}
                            aria-label="Send Message"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
