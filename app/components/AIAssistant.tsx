'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

interface AIAssistantProps {
  className?: string;
}

export function AIAssistant({ className = '' }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI assistant for discovering high-impact AI opportunities. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Future implementation: Send to API and get response
      // For now, we'll simulate a response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getSimulatedResponse(input.trim()),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // Temporary function to simulate AI responses
  const getSimulatedResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('hello') || userInputLower.includes('hi')) {
      return "Hello! How can I help you with your AI opportunity discovery today?";
    }
    
    if (userInputLower.includes('roi') || userInputLower.includes('return on investment')) {
      return "When calculating ROI for AI projects, consider both quantitative factors (cost savings, revenue increase) and qualitative benefits (improved customer satisfaction, faster decision-making). I can help you identify these factors for specific use cases.";
    }
    
    if (userInputLower.includes('opportunity') || userInputLower.includes('use case')) {
      return "The best AI opportunities typically come from examining your most manual, repetitive processes. Look for tasks that involve data classification, prediction, anomaly detection, or natural language understanding. Where are your teams spending the most time on repetitive tasks?";
    }
    
    if (userInputLower.includes('process') || userInputLower.includes('workflow')) {
      return "To identify AI opportunities in your processes, map out each step and ask: (1) Is this step repetitive? (2) Does it involve decision-making based on data? (3) Would automation here save significant time? The processes with the most 'yes' answers are good candidates.";
    }
    
    return "That's an interesting point. To further explore AI opportunities, consider examining your current processes for repetitive tasks, data-heavy decisions, or customer pain points where AI could make an impact. Would you like me to elaborate on any specific area?";
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            )}
            
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-white' 
                  : 'bg-dark-surface-dark border border-dark-border'
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
              <div className="text-xs mt-1.5 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-dark-surface-light border border-dark-border flex items-center justify-center ml-2 flex-shrink-0">
                <span className="text-xs font-medium text-white">
                  {message.id.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-dark-surface-dark border border-dark-border">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-dark-border p-3">
        <div className="flex items-center rounded-xl border border-dark-border bg-dark-surface-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 text-primary hover:bg-dark-surface-light disabled:text-text-secondary disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 