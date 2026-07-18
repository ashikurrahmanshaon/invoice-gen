export const CTA = () => {
  return (
    <div className="cta-banner" style={{
      background: 'linear-gradient(135deg, #00C853 0%, #00A65A 100%)',
      borderRadius: '16px',
      padding: '48px 32px',
      textAlign: 'center',
      margin: '64px 0',
      color: 'white',
      boxShadow: '0 20px 40px rgba(0, 200, 83, 0.15)'
    }}>
      <h3 style={{ fontSize: '28px', marginBottom: '16px', color: 'white', fontWeight: 700 }}>
        Create Your Professional Invoice Free
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', margin: '0 auto 32px auto', maxWidth: '500px' }}>
        Create a professional invoice in seconds. No sign-up required.
      </p>
      <a href="/#generator" className="btn btn-primary" style={{ display: 'inline-flex' }}>
        Open Invoice Generator
      </a>
    </div>
  );
};
