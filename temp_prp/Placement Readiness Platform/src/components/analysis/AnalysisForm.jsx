import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { analyzeJobDescription } from '../../lib/analysis';

const AnalysisForm = ({ onanalyze }) => {
    const [jdText, setJdText] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!jdText.trim()) return;

        const result = analyzeJobDescription(jdText, company, role);
        onanalyze(result);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>New Job Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Company (Optional)</label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g. Google"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Role (Optional)</label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Frontend Engineer"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Job Description *</label>
                        <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste the full JD here..."
                            rows={8}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none bg-gray-50/50 transition-all"
                        />
                        <div className="flex justify-between items-center px-1">
                            <div className="flex-grow">
                                {jdText.length > 0 && jdText.length < 200 && (
                                    <p className="text-[10px] font-bold text-amber-500 uppercase animate-pulse">
                                        ⚠️ This JD is too short to analyze deeply. Paste full JD for better output.
                                    </p>
                                )}
                            </div>
                            <p className={`text-[10px] font-bold uppercase transition-colors ${jdText.length === 0 ? 'text-gray-400' :
                                    jdText.length < 200 ? 'text-amber-500' : 'text-green-500'
                                }`}>
                                {jdText.length} / 200+ characters
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                        Analyze Job Readiness
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AnalysisForm;
