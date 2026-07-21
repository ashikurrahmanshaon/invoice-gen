import React from 'react';
import { FileText, Wand2, Download, CheckCircle, ArrowRight } from 'lucide-react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { SEO } from '../components/seo/SEO';
import { Link } from 'react-router-dom';

export default function GuidesPage() {
  const steps = [
    {
      id: 1,
      title: 'Enter Details',
      description: 'Fill in your company information, client details, and line items in our intuitive form.',
      icon: FileText,
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      id: 2,
      title: 'Customize Design',
      description: 'Add your logo, choose your brand colors, and pick from professional templates.',
      icon: Wand2,
      color: '#8B5CF6',
      bgColor: '#F5F3FF'
    },
    {
      id: 3,
      title: 'Download & Send',
      description: 'Instantly download your professional PDF invoice and send it to your clients.',
      icon: Download,
      color: '#10B981',
      bgColor: '#ECFDF5'
    }
  ];

  return (
    <LandingLayout>
      <SEO 
        title="How to Generate Invoices | User Guide"
        description="Learn how easy it is to create professional invoices in just 3 simple steps."
      />
      
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 60px 24px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--color-primary-faint)', color: 'var(--color-primary)', borderRadius: '100px', fontWeight: 600, fontSize: '13px', marginBottom: '24px' }}>
            <CheckCircle size={16} /> Quick Start Guide
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--color-text-title)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Creating an Invoice is <span style={{ color: 'var(--color-primary)' }}>Effortless</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            No sign-up required, no complex software to learn. Just enter your details and download a beautiful PDF in seconds.
          </p>
        </div>

        {/* Visual Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px', position: 'relative' }}>
          
          {/* Connector Line (visible on large screens only, handled via css ideally, but we simulate it) */}
          <div className="connector-line" style={{ position: 'absolute', top: '40px', left: '15%', right: '15%', height: '2px', background: 'var(--color-border)', zIndex: 0, opacity: 0.5 }}></div>
          <style>{`
            @media (max-width: 900px) { .connector-line { display: none; } }
          `}</style>

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1, background: 'var(--color-background)', padding: '0 16px' }}>
                
                {/* Icon Circle */}
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: step.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px', border: '4px solid var(--color-background)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
                }}>
                  <Icon size={32} color={step.color} strokeWidth={2} />
                </div>
                
                {/* Step Content */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-text-title)', color: 'white', fontWeight: 800, fontSize: '13px', marginBottom: '16px' }}>
                  {step.id}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--color-surface) 0%, #F8FAFC 100%)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-title)', marginBottom: '12px' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px auto' }}>
            Join thousands of freelancers and businesses who trust our platform to generate professional invoices every day.
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '15px', fontWeight: 700, borderRadius: '10px', textDecoration: 'none' }}>
            Create Your First Invoice <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </LandingLayout>
  );
}
