import React from 'react';

export const DynamicTable: React.FC<{ data: { headers: string[], rows: string[][] } }> = ({ data }) => (
  <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #E2E8F0' }}>
      <thead>
        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          {data.headers.map((header, i) => (
            <th key={i} style={{ padding: '16px', fontWeight: 600, color: '#0F172A' }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '16px', color: '#334155' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ProsCons: React.FC<{ pros: string[], cons: string[] }> = ({ pros, cons }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
    <div style={{ padding: '24px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
      <h4 style={{ color: '#166534', marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Pros</h4>
      <ul style={{ color: '#15803D', paddingLeft: '20px', margin: 0 }}>
        {pros.map((pro, i) => <li key={i} style={{ marginBottom: '8px' }}>{pro}</li>)}
      </ul>
    </div>
    <div style={{ padding: '24px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
      <h4 style={{ color: '#991B1B', marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Cons</h4>
      <ul style={{ color: '#B91C1C', paddingLeft: '20px', margin: 0 }}>
        {cons.map((con, i) => <li key={i} style={{ marginBottom: '8px' }}>{con}</li>)}
      </ul>
    </div>
  </div>
);

export const WarningCallout: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ padding: '16px 24px', backgroundColor: '#FFFBEB', borderLeft: '4px solid #F59E0B', color: '#92400E', marginBottom: '32px', borderRadius: '0 8px 8px 0' }}>
    <strong>Warning:</strong> {text}
  </div>
);

export const InfoCallout: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ padding: '16px 24px', backgroundColor: '#EFF6FF', borderLeft: '4px solid #3B82F6', color: '#1E40AF', marginBottom: '32px', borderRadius: '0 8px 8px 0' }}>
    <strong>Note:</strong> {text}
  </div>
);
