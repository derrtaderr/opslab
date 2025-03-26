'use client';

import { useState, useRef, useEffect } from 'react';

interface AIChatProps {
  boardId?: string;
  onSendSticky?: (content: string) => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
}

export default function AIChat({ boardId, onSendSticky }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI Design Sprint assistant. I can help guide you through the AI Ops Lab process. What would you like help with today?",
      sender: 'system',
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let response;
      
      if (newMessage.toLowerCase().includes('pain point')) {
        response = "Pain points are critical aspects of your current operations that cause inefficiency, errors, or frustration. Could you describe your top 3 operational pain points?";
      } else if (newMessage.toLowerCase().includes('process')) {
        response = "Understanding your current process is the first step. Could you break down the key steps in your current workflow?";
      } else if (newMessage.toLowerCase().includes('sticky') || newMessage.toLowerCase().includes('note')) {
        if (onSendSticky) {
          onSendSticky(newMessage.trim());
        }
        response = "I've added your note to the board as a sticky note. Feel free to reposition it as needed.";
      } else if (newMessage.toLowerCase().includes('roi') || newMessage.toLowerCase().includes('return on investment')) {
        response = "For ROI calculations, we'll need to estimate current costs and potential savings. Consider switching to the ROI Calculator tab to input specific metrics.";
      } else {
        response = "I understand you're working on optimizing your operations. Could you provide more details about your current challenges or what specific aspects of AI implementation you're curious about?";
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'system',
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%'
    }}>
      {/* Messages Area */}
      <div style={{ 
        flex: '1 1 auto',
        overflowY: 'auto', 
        padding: '1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: 'var(--dark-surface-dark)',
        minHeight: 0
      }}>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-system'}`}
          >
            {message.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="message message-system">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area - Fixed at bottom with no extra space */}
      <div style={{ 
        backgroundColor: 'var(--dark-surface)',
        borderTop: '1px solid var(--dark-border)',
        padding: '0.75rem 1rem',
        width: '100%',
        flexShrink: 0,
        marginTop: 'auto'
      }}>
        <form onSubmit={handleSendMessage} style={{ 
          display: 'flex', 
          width: '100%', 
          maxWidth: '95%',
          margin: '0 auto'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            style={{
              flex: '1 1 auto',
              backgroundColor: 'var(--dark-surface-dark)',
              border: '1px solid var(--dark-border)',
              borderRadius: '0.375rem 0 0 0.375rem',
              padding: '0.75rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()} 
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0 0.375rem 0.375rem 0',
              padding: '0.75rem',
              minWidth: '60px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 