import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '8px',
                    border: '1px solid #eee', margin: '20px', fontFamily: '"Roboto", sans-serif'
                }}>
                    <h2 style={{ color: '#000', marginBottom: '16px' }}>Something went wrong in this section.</h2>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px', background: '#000', color: '#fff', border: 'none',
                            borderRadius: '4px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        Click to Refresh
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
