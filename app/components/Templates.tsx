'use client';

export default function Templates() {
  return (
    <div className="templates-container">
      <p className="templates-description">
        Select a template to apply to your current board or create a new board from a template.
      </p>
      
      <div className="space-y-4">
        <div className="template-card">
          <div className="template-preview">
            <div className="template-preview-inner">
              Pain Point Mapping
            </div>
          </div>
          <div className="template-info">
            <h3 className="template-name">Pain Point Mapping</h3>
            <p className="template-description">
              Identify and prioritize operational pain points and their impacts on your business.
            </p>
          </div>
        </div>
        
        <div className="template-card">
          <div className="template-preview">
            <div className="template-preview-inner">
              Process Mapping
            </div>
          </div>
          <div className="template-info">
            <h3 className="template-name">Process Mapping</h3>
            <p className="template-description">
              Document your current operational processes and identify automation opportunities.
            </p>
          </div>
        </div>
        
        <div className="template-card">
          <div className="template-preview">
            <div className="template-preview-inner">
              AI Opportunity Canvas
            </div>
          </div>
          <div className="template-info">
            <h3 className="template-name">AI Opportunity Canvas</h3>
            <p className="template-description">
              Identify AI use cases and assess their potential impact on your operations.
            </p>
          </div>
        </div>
        
        <div className="template-card">
          <div className="template-preview">
            <div className="template-preview-inner">
              Implementation Roadmap
            </div>
          </div>
          <div className="template-info">
            <h3 className="template-name">Implementation Roadmap</h3>
            <p className="template-description">
              Create a step-by-step plan for implementing AI solutions in your organization.
            </p>
          </div>
        </div>
        
        <div className="template-card">
          <div className="template-preview">
            <div className="template-preview-inner">
              Data Readiness Assessment
            </div>
          </div>
          <div className="template-info">
            <h3 className="template-name">Data Readiness Assessment</h3>
            <p className="template-description">
              Evaluate your organization's data quality, accessibility, and compliance for AI adoption.
            </p>
          </div>
        </div>
        
        <div className="template-card">
          <div className="template-preview">
            <div className="template-preview-inner">
              ROI Analysis
            </div>
          </div>
          <div className="template-info">
            <h3 className="template-name">ROI Analysis</h3>
            <p className="template-description">
              Calculate the potential return on investment for your AI implementation initiatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 