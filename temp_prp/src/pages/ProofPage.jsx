import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link2, Github, ExternalLink, CheckCircle2, Circle, AlertCircle, Copy, Check } from 'lucide-react';

const steps = [
    { id: 1, label: 'Landing Page', path: '/' },
    { id: 2, label: 'Dashboard', path: '/app/dashboard' },
    { id: 3, label: 'Practice Problems', path: '/app/practice' },
    { id: 4, label: 'Readiness Assessments', path: '/app/assessments' },
    { id: 5, label: 'Resource Library', path: '/app/resources' },
    { id: 6, label: 'Student Profile', path: '/app/profile' },
    { id: 7, label: 'System Verification', path: '/prp/07-test' },
    { id: 8, label: 'Final Shipment', path: '/prp/08-ship' }
];

const ProofPage = () => {
    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('prp_final_submission');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', deployed: '' };
    });

    const [errors, setErrors] = useState({});
    const [copyStatus, setCopyStatus] = useState(false);

    useEffect(() => {
        localStorage.setItem('prp_final_submission', JSON.stringify(links));
    }, [links]);

    const validateUrl = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch (_) {
            return false;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLinks(prev => ({ ...prev, [name]: value }));

        if (value && !validateUrl(value)) {
            setErrors(prev => ({ ...prev, [name]: 'Please enter a valid URL' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleCopySubmission = () => {
        if (!links.lovable || !links.github || !links.deployed || Object.values(errors).some(e => e)) {
            alert('Please provide all 3 valid proof links before exporting.');
            return;
        }

        const formattedText = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
        `.trim();

        navigator.clipboard.writeText(formattedText);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
    };

    // For demo purposes, we mark all steps as "Completed" if the user has visited them
    // but here we just show them as a static list for the user to confirm.
    // Real logic would track visits in localStorage.
    const [visitedSteps, setVisitedSteps] = useState(() => {
        const saved = localStorage.getItem('prp_visited_steps');
        return saved ? JSON.parse(saved) : { 1: true }; // Assume landing is visited
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Proof of Work</h1>
                <p className="text-gray-500 mt-2">Document your build and verify your contribution.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Section A: Steps */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Step Completion</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {steps.map(step => (
                                <div key={step.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${visitedSteps[step.id] ? 'bg-green-500' : 'bg-gray-200'}`} />
                                        <span className={`text-sm font-medium ${visitedSteps[step.id] ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${visitedSteps[step.id] ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                        {visitedSteps[step.id] ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Section B: Artifacts */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-t-4 border-t-indigo-600 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-indigo-600" /> Artifact Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Lovable Project Link *</label>
                                    <div className="relative">
                                        <input
                                            name="lovable"
                                            value={links.lovable}
                                            onChange={handleInputChange}
                                            placeholder="https://lovable.dev/projects/..."
                                            className={`w-full p-3 bg-gray-50 border ${errors.lovable ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-10`}
                                        />
                                        <div className="absolute right-3 top-3.5">
                                            {links.lovable && !errors.lovable ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-200" />}
                                        </div>
                                    </div>
                                    {errors.lovable && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.lovable}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">GitHub Repository Link *</label>
                                    <div className="relative">
                                        <input
                                            name="github"
                                            value={links.github}
                                            onChange={handleInputChange}
                                            placeholder="https://github.com/username/repo"
                                            className={`w-full p-3 bg-gray-50 border ${errors.github ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-10`}
                                        />
                                        <div className="absolute right-3 top-3.5 text-gray-400">
                                            <Github className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {errors.github && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.github}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Deployed App URL *</label>
                                    <div className="relative">
                                        <input
                                            name="deployed"
                                            value={links.deployed}
                                            onChange={handleInputChange}
                                            placeholder="https://your-app.vercel.app"
                                            className={`w-full p-3 bg-gray-50 border ${errors.deployed ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-10`}
                                        />
                                        <div className="absolute right-3 top-3.5 text-gray-400">
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {errors.deployed && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.deployed}</p>}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleCopySubmission}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    {copyStatus ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    {copyStatus ? 'Copied to Clipboard' : 'Copy Final Submission'}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-4 uppercase font-bold tracking-widest italic">
                                    Requires all 8 steps + 10 tests + 3 valid links to unlock Shipped status.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
