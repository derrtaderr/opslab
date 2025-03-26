'use client';

import { useState } from 'react';
import AIChat from './AIChat';
import ROICalculator from './ROICalculator';
import Templates from './Templates';

interface ToolSelectorProps {
  boardId?: string;
  onSendSticky?: (content: string) => void;
}

export default function ToolSelector({ boardId, onSendSticky }: ToolSelectorProps) {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Get the title based on active tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'chat':
        return 'AI Assistant';
      case 'roi':
        return 'ROI Calculator';
      case 'templates':
        return 'Templates';
      default:
        return 'AI Assistant';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div className="tab-bar">
        <div 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
          style={{ padding: '0.75rem 0.5rem' }}
        >
          AI Assistant
        </div>
        <div 
          className={`tab ${activeTab === 'roi' ? 'active' : ''}`}
          onClick={() => setActiveTab('roi')}
          style={{ padding: '0.75rem 0.5rem' }}
        >
          ROI Calculator
        </div>
        <div 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          style={{ padding: '0.75rem 0.5rem' }}
        >
          Templates
        </div>
      </div>
      
      <div style={{ flex: '1 1 auto', height: 'calc(100% - 48px)', overflow: 'hidden' }}>
        {activeTab === 'chat' && (
          <AIChat boardId={boardId} onSendSticky={onSendSticky} />
        )}
        {activeTab === 'roi' && (
          <ROICalculator />
        )}
        {activeTab === 'templates' && (
          <Templates />
        )}
      </div>
    </div>
  );
} 