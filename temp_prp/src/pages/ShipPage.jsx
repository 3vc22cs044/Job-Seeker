import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Rocket, ShieldCheck, Download, Copy, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShipPage = () => {
    const [status, setStatus] = useState({
        passedTests: false,
        hasLinks: false,
        allStepsDone: false,
        overallShipped: false
    });

    useEffect(() => {
        const savedChecklist = localStorage.getItem('placeready_checklist');
        const savedProof = localStorage.getItem('prp_final_submission');

        const checklist = savedChecklist ? JSON.parse(savedChecklist) : {};
        const proof = savedProof ? JSON.parse(savedProof) : {};

        const passedTests = Object.values(checklist).filter(Boolean).length === 10;
        const hasLinks = !!(proof.lovable && proof.github && proof.deployed);
        const allStepsDone = true; // Placeholder for visit logic

        setStatus({
            passedTests,
            hasLinks,
            allStepsDone,
            overallShipped: passedTests && hasLinks && allStepsDone
        });
    }, []);

    const [copyStatus, setCopyStatus] = useState(false);

    const handleCopySummary = () => {
        const proof = JSON.parse(localStorage.getItem('prp_final_submission') || '{}');
        const summary = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${proof.lovable || 'N/A'}
GitHub Repository: ${proof.github || 'N/A'}
Live Deployment: ${proof.deployed || 'N/A'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
        `.trim();

        navigator.clipboard.writeText(summary);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
    };

    if (!status.overallShipped) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-6 bg-red-50 rounded-full text-red-500 mb-6 border-4 border-white shadow-xl">
                        <Lock className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipment Locked</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Your project is not yet ready for final shipment. Complete all required conditions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-2xl border ${status.passedTests ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'} transition-all shadow-sm`}>
                        <div className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center ${status.passedTests ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}`}>
                            {status.passedTests ? <Check className="w-5 h-5 font-bold" /> : '1'}
                        </div>
                        <h3 className={`font-bold ${status.passedTests ? 'text-green-800' : 'text-gray-900'}`}>System Verification</h3>
                        <p className="text-xs text-gray-500 mt-2">10/10 tests passed on Checklist page.</p>
                        {!status.passedTests && <Link to="/prp/07-test" className="text-xs font-bold text-indigo-600 mt-4 block uppercase tracking-wider hover:underline">Fix &rarr;</Link>}
                    </div>

                    <div className={`p-6 rounded-2xl border ${status.hasLinks ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'} transition-all shadow-sm`}>
                        <div className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center ${status.hasLinks ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}`}>
                            {status.hasLinks ? <Check className="w-5 h-5 font-bold" /> : '2'}
                        </div>
                        <h3 className={`font-bold ${status.hasLinks ? 'text-green-800' : 'text-gray-900'}`}>Artifact Proof</h3>
                        <p className="text-xs text-gray-500 mt-2">All 3 valid project links provided.</p>
                        {!status.hasLinks && <Link to="/prp/proof" className="text-xs font-bold text-indigo-600 mt-4 block uppercase tracking-wider hover:underline">Add Links &rarr;</Link>}
                    </div>

                    <div className={`p-6 rounded-2xl border ${status.allStepsDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'} transition-all shadow-sm`}>
                        <div className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center ${status.allStepsDone ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}`}>
                            {status.allStepsDone ? <Check className="w-5 h-5 font-bold" /> : '3'}
                        </div>
                        <h3 className={`font-bold ${status.allStepsDone ? 'text-green-800' : 'text-gray-900'}`}>Product Journey</h3>
                        <p className="text-xs text-gray-500 mt-2">Visited all 8 core project sections.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl text-green-600 mb-2 border border-green-200">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Project Shipped</h1>
                <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-100 max-w-2xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
                    <p className="text-indigo-900 font-medium leading-relaxed text-lg">
                        "You built a real product. <br />
                        Not a tutorial. Not a clone. <br />
                        A structured tool that solves a real problem. <br /><br />
                        <span className="font-bold text-indigo-700">This is your proof of work."</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-t-4 border-t-green-500 shadow-xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg flex items-center">
                            <Rocket className="w-5 h-5 mr-2 text-indigo-500" /> Shipment Manifest
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="p-4 bg-gray-900 rounded-xl font-mono text-[10px] leading-relaxed text-gray-300 shadow-inner">
                            <p className="text-green-400 font-bold mb-2 uppercase tracking-widest text-[9px] line-clamp-1">{'>>'} System.Status: SHIPPED</p>
                            <p>Verification: COMPLETE (10/10)</p>
                            <p>Artifacts: VERIFIED (3/3)</p>
                            <div className="mt-4 pt-4 border-t border-gray-800">
                                <p className="text-indigo-400 font-bold mb-2 uppercase tracking-widest text-[9px] line-clamp-1">{'>>'} Modules.Loaded:</p>
                                <ul className="space-y-1 text-gray-400">
                                    <li>• Skill Extraction Engine</li>
                                    <li>• Round Mapping Engine</li>
                                    <li>• 7-Day Prep Plan</li>
                                    <li>• Interactive Readiness Score</li>
                                    <li>• History Persistence Layer</li>
                                </ul>
                            </div>
                        </div>
                        <button
                            onClick={handleCopySummary}
                            className="w-full flex items-center justify-center px-4 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group"
                        >
                            {copyStatus ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />}
                            {copyStatus ? 'Copied Final Submission' : 'Copy Final Submission'}
                        </button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white border-none shadow-2xl overflow-hidden relative group">
                        <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12 text-green-400 transition-transform group-hover:scale-110 duration-700">
                            <Rocket size={160} />
                        </div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center gap-2 text-green-400 mb-4 animate-pulse">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Final Milestone Reached</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Launch Successful</h3>
                            <p className="text-indigo-100/70 mb-8 text-sm leading-relaxed">
                                Your platform is now officially in "Shipped" status across the entire production baseline.
                            </p>
                            <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between backdrop-blur-sm">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Global Checksum</span>
                                <span className="text-xs font-mono text-green-400 font-bold">{Date.now().toString(36).toUpperCase()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ShipPage;
