'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Stack, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import './styles.css';  // Make sure to import the CSS file

// Styled components for better UI
const SideBox = styled(Box)({
    width: '50%',
    height: '50vh',
    display: 'flex',
    margin: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcccc',
    padding: '16px',
    boxSizing: 'border-box',
    fontFamily: 'Fira Code, monospace',
    borderRadius: '8px',
});

const ChatContainer = styled(Box)({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f0f0f0",
    padding: '16px',
    boxSizing: 'border-box',
    fontFamily: 'Fira Code, monospace',
});

const ChatBox = styled(Stack)({
    width: '100%',
    maxWidth: '500px',
    height: '90%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#ffffff',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '8px',
    fontFamily: 'Fira Code, monospace',
    flexGrow: 1,
});

const MessageBubble = styled(Box)(({ role }) => ({
    backgroundColor: role === 'assistant' ? '#6666ff' : '#0066ff',
    color: '#fff',
    borderRadius: '16px',
    padding: '12px',
    maxWidth: '75%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    alignSelf: role === 'assistant' ? 'flex-start' : 'flex-end',
    marginBottom: '8px',
    fontFamily: 'Fira Code, monospace',
}));

const InputContainer = styled(Stack)({
    width: '100%',
    maxWidth: '500px',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'Fira Code, monospace',
    position: 'relative',
});

const InputField = styled(TextField)({
    flex: 1,
    fontFamily: 'Fira Code, monospace',
});

const LoadingDots = () => (
    <div className="loading-dots">
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default function Home() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Welcome to PAAW Customer Support!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const endOfChatRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInput('');
        setIsLoading(true); // Set loading to true when message is sent

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: input }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const assistantMessage = { role: 'assistant', content: data.data.generated_text };

            setMessages(prevMessages => [...prevMessages, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // Set loading to false after processing
        }
    };

    useEffect(() => {
        endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <ChatContainer>
            <SideBox>
                <h2>PAAW Customer Support</h2>
                <br />
                <br />
                <div>
                    Chat with our assistant to get help!
                    <ul>
                        <b>What this bot do?</b>
                        <li>Answer your questions</li>
                        <li>Provide information about our products</li>
                        <li>Help you with your orders</li>
                        <li>And more!</li>
                    </ul>
                </div>
            </SideBox>
            <div style={{ width: '50px' }} />
            <ChatBox>
                <div className='top-heading'>
                    <h3>PAAW Assistant</h3>
                </div>
                <Stack direction="column" spacing={2} flexGrow={1}>
                    {messages.map((message, index) => (
                        <MessageBubble key={index} role={message.role}>
                            {message.content}
                        </MessageBubble>
                    ))}
                    {isLoading && (
                        <MessageBubble role='assistant'>
                            <LoadingDots />
                        </MessageBubble>
                    )}
                    <div ref={endOfChatRef} /> {/* For auto-scrolling */}
                </Stack>
                <InputContainer>
                    <InputField 
                        label="Type your message..."
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        variant="outlined"
                    />
                    <Button variant="contained" style={{ minWidth: '100px' }} onClick={sendMessage}>
                        Send
                    </Button>
                </InputContainer>
            </ChatBox>
        </ChatContainer>
    );
}
