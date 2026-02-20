import React, { useState, useEffect } from 'react';
import AnalysisForm from '../components/analysis/AnalysisForm';
import AnalysisResult from '../components/analysis/AnalysisResult';
import HistoryList from '../components/analysis/HistoryList';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus } from 'lucide-react';

const Assessments = () => {
    const [view, setView] = useState('list'); // 'list' | 'new' | 'result'
    const [history, setHistory] = useState([]);
    const [currentResult, setCurrentResult] = useState(null);

    // Load history from localStorage on mount
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('placeready_analysis_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Basic validation: ensure each entry has an id and jdText
                const validHistory = parsed.filter(item => item && item.id && item.jdText);

                if (validHistory.length !== parsed.length) {
                    setLoadError(true);
                    setTimeout(() => setLoadError(false), 5000);
                }

                setHistory(validHistory);
            } catch (e) {
                console.error("Failed to parse history", e);
                setLoadError(true);
                setTimeout(() => setLoadError(false), 5000);
            }
        }
    }, []);

    // Save history whenever it changes
    useEffect(() => {
        localStorage.setItem('placeready_analysis_history', JSON.stringify(history));
    }, [history]);

    const handleAnalyze = (result) => {
        const newHistory = [result, ...history];
        setHistory(newHistory);
        setCurrentResult(result);
        setView('result');
    };

    const handleSelectHistory = (item) => {
        setCurrentResult(item);
        setView('result');
    };

    const handleUpdateResult = (updatedItem) => {
        const itemToSave = {
            ...updatedItem,
            updatedAt: new Date().toISOString()
        };
        const newHistory = history.map(item => item.id === itemToSave.id ? itemToSave : item);
        setHistory(newHistory);
        setCurrentResult(itemToSave);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Job Readiness Assessments</h1>
                {view !== 'new' && (
                    <button
                        onClick={() => { setCurrentResult(null); setView('new'); }}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Analysis
                    </button>
                )}
            </div>

            {loadError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <span className="text-lg">⚠️</span>
                    <p className="text-sm font-medium">One saved entry couldn't be loaded. Create a new analysis.</p>
                </div>
            )}

            <div className="mt-6">
                {view === 'list' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold mb-2">Analyze any Job Description</h2>
                                    <p className="text-indigo-100 mb-6 max-w-lg">
                                        Paste a JD to get a tailored preparation plan, round-wise checklist, and predicted interview questions instantly.
                                    </p>
                                    <button
                                        onClick={() => setView('new')}
                                        className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
                                    >
                                        Start Analysis
                                    </button>
                                </CardContent>
                            </Card>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                                <HistoryList history={history} onSelect={handleSelectHistory} />
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">How it works</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-gray-600">
                                    <div className="flex gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg text-primary font-bold">1</div>
                                        <p>Paste the text of any job description (LinkedIn, Indeed, etc).</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg text-primary font-bold">2</div>
                                        <p>Our intelligent system extracts key skills and technical requirements.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg text-primary font-bold">3</div>
                                        <p>Get a scored report with a 7-day study plan and mock questions.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {view === 'new' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4">
                            <button onClick={() => setView('list')} className="text-sm text-gray-500 hover:text-gray-900">
                                &larr; Back to Dashboard
                            </button>
                        </div>
                        <AnalysisForm onanalyze={handleAnalyze} />
                    </div>
                )}

                {view === 'result' && (
                    <AnalysisResult
                        result={currentResult}
                        onBack={() => setView('list')}
                        onUpdate={handleUpdateResult}
                    />
                )}
            </div>
        </div>
    );
};

export default Assessments;
