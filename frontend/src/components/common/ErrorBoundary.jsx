import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Creotex ErrorBoundary] Caught uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090B',
          color: '#FAFAFA',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
          <div style={{
            background: '#18181B',
            border: '1px solid #27272A',
            borderRadius: '16px',
            padding: '36px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#F97316' }}>
              Creotex 3D System Notice
            </h2>
            <p style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '24px', lineHeight: 1.6 }}>
              A temporary display refresh occurred. Click below to continue smoothly.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 28px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)'
              }}
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

