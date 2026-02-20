import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, Circle, AlertTriangle, RotateCcw, ExternalLink } from 'lucide-react';

const testItems = [
    {
        id: 'jd-validation',
        label: 'JD required validation works',
        hint: 'Try clicking "Analyze" with an empty JD box. It should prevent submission.'
    },
    {
        id: 'short-jd-warning',
        label: 'Short JD warning shows for <200 chars',
        hint: 'Paste a short sentence. A yellow warning should appear below the box.'
    },
    {
        id: 'skills-grouping',
        label: 'Skills extraction groups correctly',
        hint: 'Paste a JD with Java, React, and SQL. Confirm they appear in Languages, Web, and Data categories.'
    },
    {
        id: 'round-mapping',
        label: 'Round mapping changes based on company + skills',
        hint: 'Compare "Google" (Enterprise/DSA) vs "Small Startup" (Startup/Practical) rounds.'
    },
    {
        id: 'deterministic-score',
        label: 'Score calculation is deterministic',
        hint: 'A specific JD should always yield the same initial base score.'
    },
    {
        id: 'live-score-toggles',
        label: 'Skill toggles update score live',
        hint: 'Toggle a skill to "I know this". The readiness score should increase by 2.'
    },
    {
        id: 'persistence-refresh',
        label: 'Changes persist after refresh',
        hint: 'Toggle a skill, refresh the page, and confirm the selection remains.'
    },
    {
        id: 'history-io',
        label: 'History saves and loads correctly',
        hint: 'Check if past analyses are visible in the Dashboard history list.'
    },
    {
        id: 'export-content',
        label: 'Export buttons copy the correct content',
        hint: 'Click "Copy 7-Day Plan" and paste it into a notepad to verify content.'
    },
    {
        id: 'no-console-errors',
        label: 'No console errors on core pages',
        hint: 'Open DevTools (F12) and browse Dashboard/Assessments. The console should be clean.'
    }
];

const TestPage = () => {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('placeready_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('placeready_checklist', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const toggleItem = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const resetChecklist = () => {
        if (window.confirm('Are you sure you want to reset all test progress?')) {
            setCheckedItems({});
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isComplete = passedCount === testItems.length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Verification</h1>
                    <p className="text-gray-500 mt-1">Ensure every feature is hardened before final shipping.</p>
                </div>
                <button
                    onClick={resetChecklist}
                    className="flex items-center px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Checklist
                </button>
            </div>

            {/* Summary Banner */}
            <Card className={`${isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} transition-colors`}>
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-amber-500'} text-white shadow-sm`}>
                            {isComplete ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold ${isComplete ? 'text-green-800' : 'text-amber-800'}`}>
                                Tests Passed: {passedCount} / {testItems.length}
                            </h2>
                            <p className={`text-sm ${isComplete ? 'text-green-600' : 'text-amber-600'} font-medium`}>
                                {isComplete
                                    ? "Verification complete! You can now proceed to ship the project."
                                    : "Fix issues and verify all components before shipping."}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Checklist items */}
            <div className="grid grid-cols-1 gap-4">
                {testItems.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${isChecked
                                    ? 'bg-white border-green-200 shadow-sm'
                                    : 'bg-white border-gray-100 hover:border-indigo-200 grayscale-0'
                                }`}
                        >
                            <div className={`mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'text-green-500' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                {isChecked ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </div>
                            <div className="flex-grow">
                                <h3 className={`font-bold transition-colors ${isChecked ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {item.label}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    <span className="font-bold text-gray-400 mr-1 italic uppercase tracking-wider text-[10px]">How to test:</span>
                                    {item.hint}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isComplete && (
                <div className="bg-gray-50 rounded-xl p-8 border border-dashed border-gray-200 text-center">
                    <p className="text-sm text-gray-400 italic font-medium">
                        Complete all verification steps to unlock the shipping manifest.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TestPage;
