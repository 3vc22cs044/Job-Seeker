import React from 'react';
import TopBar from './TopBar';
import ProofFooter from './ProofFooter';
import './GlobalLayout.css';

const GlobalLayout = ({ children, stepCurrent = 1, stepTotal = 5, status = 'Not Started' }) => {
    return (
        <div className="global-layout">
            <TopBar stepCurrent={stepCurrent} stepTotal={stepTotal} status={status} />

            <main className="main-scroll-area">
                <div className="content-container">
                    {children}
                </div>
            </main>

            <ProofFooter />
        </div>
    );
};

export default GlobalLayout;
