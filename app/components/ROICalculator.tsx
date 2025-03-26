'use client';

import { useState } from 'react';

interface CalculationResults {
  currentAnnualCost: number;
  implementationCost: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
}

export default function ROICalculator() {
  // Input states
  const [processName, setProcessName] = useState('');
  const [frequency, setFrequency] = useState<number>(0);
  const [timePerTask, setTimePerTask] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [errorRate, setErrorRate] = useState<number>(0);
  const [errorCost, setErrorCost] = useState<number>(0);
  const [implementationCost, setImplementationCost] = useState<number>(0);
  const [efficiencyGain, setEfficiencyGain] = useState<number>(50); // Default 50%

  // Results state
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    // Calculate current costs
    const hoursPerYear = (frequency * timePerTask) / 60; // Convert minutes to hours
    const laborCost = hoursPerYear * hourlyRate;
    const totalErrorCost = frequency * (errorRate / 100) * errorCost;
    const currentAnnualCost = laborCost + totalErrorCost;

    // Calculate AI implementation benefits
    const timeSavings = laborCost * (efficiencyGain / 100);
    const errorSavings = totalErrorCost * 0.9; // Assume 90% error reduction
    const annualSavings = timeSavings + errorSavings;

    // Calculate ROI metrics
    const roi = (annualSavings / implementationCost) * 100;
    const paybackPeriod = implementationCost / annualSavings * 12; // In months

    setResults({
      currentAnnualCost,
      implementationCost,
      annualSavings,
      roi,
      paybackPeriod
    });

    setShowResults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateROI();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      overflowX: 'hidden'
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        margin: '0.75rem 0 1rem 0', 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'var(--dark-surface-dark)', 
        paddingBottom: '0.5rem',
        zIndex: 10 
      }}>
        AI Implementation ROI Calculator
      </h2>
      
      <div style={{ 
        overflowY: 'auto', 
        overflowX: 'hidden',
        flex: 1,
        padding: '0 1rem',
        maxWidth: '100%'
      }}>
        {!showResults ? (
          <form onSubmit={handleSubmit} className="calculator-form" style={{ maxWidth: '100%' }}>
            <div className="form-group">
              <label className="form-label">Process Name</label>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="form-input"
                placeholder="Ex: Customer Support Ticket Processing"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Frequency (tasks per year)</label>
              <input
                type="number"
                value={frequency || ''}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="form-input"
                placeholder="Ex: 5000"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Time per Task (minutes)</label>
              <input
                type="number"
                value={timePerTask || ''}
                onChange={(e) => setTimePerTask(Number(e.target.value))}
                className="form-input"
                placeholder="Ex: 15"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Average Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate || ''}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="form-input"
                placeholder="Ex: 25"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Error Rate (%)</label>
              <input
                type="number"
                value={errorRate || ''}
                onChange={(e) => setErrorRate(Number(e.target.value))}
                className="form-input"
                placeholder="Ex: 5"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Average Cost per Error ($)</label>
              <input
                type="number"
                value={errorCost || ''}
                onChange={(e) => setErrorCost(Number(e.target.value))}
                className="form-input"
                placeholder="Ex: 100"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Implementation Cost ($)</label>
              <input
                type="number"
                value={implementationCost || ''}
                onChange={(e) => setImplementationCost(Number(e.target.value))}
                className="form-input"
                placeholder="Ex: 50000"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Expected Efficiency Gain (%): {efficiencyGain}%</label>
              <input
                type="range"
                min="10"
                max="90"
                value={efficiencyGain}
                onChange={(e) => setEfficiencyGain(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-text-secondary text-xs">
                <span>10%</span>
                <span>90%</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Calculate ROI
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6" style={{ maxWidth: '100%' }}>
            <div className="bg-dark-surface rounded-md p-4 border border-dark-border">
              <h3 className="text-lg font-semibold text-white mb-4">ROI Analysis Results</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-dark-surface-dark p-4 rounded border border-dark-border">
                  <div className="text-text-secondary text-sm mb-1">Current Annual Cost</div>
                  <div className="text-white text-xl font-bold">${results?.currentAnnualCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                </div>
                
                <div className="bg-dark-surface-dark p-4 rounded border border-dark-border">
                  <div className="text-text-secondary text-sm mb-1">Implementation Cost</div>
                  <div className="text-white text-xl font-bold">${results?.implementationCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                </div>
                
                <div className="bg-dark-surface-dark p-4 rounded border border-dark-border">
                  <div className="text-text-secondary text-sm mb-1">Annual Savings</div>
                  <div className="text-white text-xl font-bold">${results?.annualSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                </div>
                
                <div className="bg-dark-surface-dark p-4 rounded border border-dark-border">
                  <div className="text-text-secondary text-sm mb-1">ROI</div>
                  <div className="text-white text-xl font-bold">{results?.roi.toFixed(1)}%</div>
                </div>
                
                <div className="bg-dark-surface-dark p-4 rounded border border-dark-border">
                  <div className="text-text-secondary text-sm mb-1">Payback Period</div>
                  <div className="text-white text-xl font-bold">
                    {results ? 
                      (results.paybackPeriod < 1 ? 
                        `${Math.round(results.paybackPeriod * 30)} days` : 
                        `${results.paybackPeriod.toFixed(1)} months`)
                      : ''}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowResults(false)}
              className="btn-secondary w-full"
            >
              Return to Calculator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}