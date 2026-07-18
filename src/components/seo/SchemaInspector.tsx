import React from 'react';
import { SchemaValidationResult } from '../../engine/schema/SchemaValidator';
import { SchemaNode } from '../../engine/schema/SchemaRegistry';

interface SchemaInspectorProps {
  graph: SchemaNode[];
  validation: SchemaValidationResult;
}

export const SchemaInspector: React.FC<SchemaInspectorProps> = ({ graph, validation }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Validation Report */}
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '8px', color: '#F8FAFC' }}>
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>Validation Report</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span>Status</span>
            <span style={{ color: validation.isValid ? '#4ADE80' : '#F87171', fontWeight: 'bold' }}>
              {validation.isValid ? 'Valid JSON-LD' : 'Invalid JSON-LD'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span>Coverage</span>
            <strong style={{ color: '#38BDF8' }}>{validation.coverage}%</strong>
          </div>
          
          {validation.errors.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#F87171' }}>Errors ({validation.errors.length})</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#FCA5A5', fontSize: '14px' }}>
                {validation.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#FBBF24' }}>Warnings ({validation.warnings.length})</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#FDE047', fontSize: '14px' }}>
                {validation.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Overview */}
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '8px', color: '#F8FAFC' }}>
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>Active Schemas ({validation.typesUsed.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {validation.typesUsed.map(t => (
              <span key={t} style={{ backgroundColor: '#334155', padding: '4px 12px', borderRadius: '16px', fontSize: '14px' }}>{t}</span>
            ))}
          </div>

          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>Missing Opportunities</h3>
          {validation.missingOpportunities.length === 0 ? (
            <span style={{ color: '#4ADE80', fontSize: '14px' }}>None! Fully optimized.</span>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#94A3B8', fontSize: '14px' }}>
              {validation.missingOpportunities.map((mo, i) => <li key={i}>{mo}</li>)}
            </ul>
          )}
        </div>
      </div>

      {/* JSON Preview */}
      <div style={{ backgroundColor: '#0F172A', padding: '24px', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#F8FAFC' }}>JSON-LD Preview</h3>
        <pre style={{ margin: 0, padding: '16px', backgroundColor: '#1E293B', borderRadius: '4px', overflowX: 'auto', color: '#A5B4FC', fontSize: '13px' }}>
          <code>
            {JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}
          </code>
        </pre>
      </div>

    </div>
  );
};
