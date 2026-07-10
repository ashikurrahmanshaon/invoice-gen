import React from 'react';
import { ShieldCheck, Zap, Save } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }} className="desktop-only">
      <div className="container flex justify-between items-center" style={{ padding: 'var(--space-2) var(--space-6)' }}>
        {/* Left: Trust features */}
        <div className="flex gap-8">
          <div className="flex items-start gap-2">
            <ShieldCheck size={18} className="text-primary" style={{ marginTop: '2px' }} />
            <div className="flex-col">
              <span className="font-semibold text-xs text-secondary">100% Free</span>
              <span className="text-tertiary" style={{ fontSize: '10px' }}>No signup required</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Zap size={18} className="text-primary" style={{ marginTop: '2px' }} />
            <div className="flex-col">
              <span className="font-semibold text-xs text-secondary">Instant PDF</span>
              <span className="text-tertiary" style={{ fontSize: '10px' }}>Create and download quickly</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Save size={18} className="text-primary" style={{ marginTop: '2px' }} />
            <div className="flex-col">
              <span className="font-semibold text-xs text-secondary">Auto Save</span>
              <span className="text-tertiary" style={{ fontSize: '10px' }}>Saved in your browser</span>
            </div>
          </div>
        </div>

        {/* Right: Ad Slot Insertion Point (Quiet, zero height/border when no ad is loaded) */}
        <div id="ad-slot-trust-strip" className="ad-container" />
      </div>
    </div>
  );
};
