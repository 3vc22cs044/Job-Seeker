import React from 'react';
import './ProofFooter.css';

const ProofFooter = () => {
    return (
        <footer className="proof-footer">
            <div className="proof-container">
                <label className="proof-item">
                    <input type="checkbox" />
                    <span>UI Built</span>
                    <span className="proof-input-placeholder">[Paste Screenshot URL]</span>
                </label>
                <label className="proof-item">
                    <input type="checkbox" />
                    <span>Logic Working</span>
                    <span className="proof-input-placeholder">[Paste Loom Link]</span>
                </label>
                <label className="proof-item">
                    <input type="checkbox" />
                    <span>Test Passed</span>
                    <span className="proof-input-placeholder">[Paste Test Output]</span>
                </label>
                <label className="proof-item">
                    <input type="checkbox" />
                    <span>Deployed</span>
                    <span className="proof-input-placeholder">[Paste Vercel URL]</span>
                </label>
            </div>
        </footer>
    );
};

export default ProofFooter;
