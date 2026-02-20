import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Calendar, HelpCircle, ArrowLeft, Download, Copy, Check, AlertCircle } from 'lucide-react';
import ReadinessScore from '../dashboard/ReadinessScore';

const AnalysisResult = ({ result, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('flow');
    const [copyStatus, setCopyStatus] = useState(null);

    const intel = result.companyIntel || { size: 'Startup', industry: 'Technology Services', hiringFocus: 'Practical problem solving + stack depth' };

    if (!result) return null;

    // Initialize confidence map from result or default to "practice"
    const skillConfidenceMap = result.skillConfidenceMap || {};

    const handleToggleSkill = (skill) => {
        const currentStatus = skillConfidenceMap[skill] || 'practice';
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';

        const newMap = { ...skillConfidenceMap, [skill]: newStatus };

        // Calculate new score based on baseScore + adjustments
        const newScore = calculateLiveScore(result.baseScore, newMap, result.extractedSkills);

        onUpdate({
            ...result,
            skillConfidenceMap: newMap,
            finalScore: newScore
        });
    };

    const calculateLiveScore = (baseScore, confidenceMap, skills) => {
        let adjustment = 0;
        Object.entries(skills).forEach(([category, items]) => {
            items.forEach(skill => {
                const status = confidenceMap[skill] || 'practice';
                adjustment += status === 'know' ? 2 : -2;
            });
        });

        return Math.max(0, Math.min(100, baseScore + adjustment));
    };

    // Skills are now categorized, flat for weakSkills calc
    const flatSkills = useMemo(() => {
        return Object.values(result.extractedSkills || {}).flat();
    }, [result.extractedSkills]);


    const weakSkills = useMemo(() => {
        const weak = [];
        Object.values(result.extractedSkills || {}).flat().forEach(skill => {
            if ((skillConfidenceMap[skill] || 'practice') === 'practice') {
                weak.push(skill);
            }
        });
        return weak.slice(0, 3);
    }, [result.extractedSkills, skillConfidenceMap]);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(type);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const handleDownload = () => {
        const content = `
ANALYSIS REPORT: ${result.role || 'Job'} for ${result.company || 'Unknown'}
Generated on: ${new Date(result.createdAt).toLocaleDateString()}
Readiness Score: ${result.finalScore}/100

COMPANY INTEL:
Industry: ${intel.industry}
Size: ${intel.size} (${intel.sizeDesc} employees)
Hiring Focus: ${intel.hiringFocus}

ROUND MAPPING:
${(result.roundMapping || []).map((r, i) => `${i + 1}. ${r.roundTitle}\n   Focus: ${r.focusAreas.join(', ')}\n   Why: ${r.whyItMatters}`).join('\n\n')}

SKILLS:
${Object.entries(result.extractedSkills).map(([cat, items]) => `${cat}: ${items.join(', ')}`).join('\n')}

7-DAY PREP PLAN:
${(result.plan7Days || []).map(d => `${d.day} - ${d.focus}: ${d.tasks.join('. ')}`).join('\n')}

ROUND-WISE CHECKLIST:
${(result.checklist || []).map(c => `${c.roundTitle}:\n${c.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')}

TOP INTERVIEW QUESTIONS:
${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim();


        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.company || 'Job'}_Readiness_Report.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {result.role || 'Job'} Analysis {result.company ? `for ${result.company}` : ''}
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500">Generated on {new Date(result.createdAt).toLocaleDateString()}</p>
                            {intel.isDemo && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase border border-amber-100">
                                    Demo Mode: Heuristic Intel
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                >
                    <Download className="w-4 h-4 mr-2" /> Download Report
                </button>
            </div>

            {/* Top Section: Score, Company & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <CardContent className="p-0 h-full">
                            <ReadinessScore score={result.finalScore} />
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <Card className="h-full border-t-4 border-t-indigo-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Industry</p>
                                <p className="text-sm font-semibold text-gray-700">{intel.industry}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Scale</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-700">{intel.size}</p>
                                    <span className="text-[10px] text-gray-400">({intel.sizeDesc} emp)</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Hiring Focus</p>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">{intel.hiringFocus}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1 lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                                Skills Extracted
                                <span className="text-xs font-normal text-gray-500 italic">Click tag to toggle</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(result.extractedSkills || {}).map(([category, items]) => (
                                    <div key={category} className="space-y-2">
                                        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {items.map(skill => {
                                                const isKnown = skillConfidenceMap[skill] === 'know';
                                                return (
                                                    <button
                                                        key={skill}
                                                        onClick={() => handleToggleSkill(skill)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${isKnown
                                                            ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                                                            : 'bg-indigo-50 text-indigo-700 border-indigo-100 opacity-80 hover:opacity-100'
                                                            }`}
                                                    >
                                                        {isKnown && <Check className="w-3 h-3" />}
                                                        {skill}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase flex items-center px-2">Export:</span>
                <button
                    onClick={() => handleCopy((result.plan7Days || []).map(d => `${d.day}: ${d.focus} - ${d.tasks.join(', ')}`).join('\n'), 'plan')}
                    className="flex items-center px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-all"
                >
                    {copyStatus === 'plan' ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                    Copy 7-Day Plan
                </button>
                <button
                    onClick={() => handleCopy((result.checklist || []).map(c => `${c.roundTitle}:\n${c.items.join('\n')}`).join('\n\n'), 'checklist')}
                    className="flex items-center px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-all"
                >
                    {copyStatus === 'checklist' ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                    Copy Checklist
                </button>
                <button
                    onClick={() => handleCopy(result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n'), 'questions')}
                    className="flex items-center px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-all"
                >
                    {copyStatus === 'questions' ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                    Copy 10 Questions
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('flow')}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'flow' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        ⚡ Round Mapping
                    </button>
                    <button
                        onClick={() => setActiveTab('checklist')}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'checklist' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" /> Preparation Checklist
                    </button>
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'plan' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <Calendar className="w-4 h-4 mr-2" /> 7-Day Plan
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <HelpCircle className="w-4 h-4 mr-2" /> Likely Questions
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'flow' && (
                    <div className="max-w-2xl mx-auto py-6">
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 z-0"></div>
                            <div className="space-y-10 relative z-10">
                                {(result.roundMapping || []).map((round, idx) => (
                                    <div key={idx} className="flex gap-6 items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-110">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-primary hover:shadow-md">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{round.roundTitle}</h4>
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                                        Focus: {round.focusAreas.join(', ')}
                                                    </span>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-indigo-300">
                                                    <p className="text-sm text-gray-600 italic">
                                                        "{round.whyItMatters}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'checklist' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(result.checklist || []).map((round, idx) => (
                            <Card key={idx} className="border-l-4 border-l-primary">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-base">{round.roundTitle}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <ul className="space-y-2">
                                        {round.items.map((item, i) => (
                                            <li key={i} className="flex items-start text-sm text-gray-700">
                                                <div className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div className="space-y-4">
                        {(result.plan7Days || []).map((day, i) => (
                            <div key={i} className="flex bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex-shrink-0 w-24 font-bold text-primary">{day.day}</div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{day.focus}</h4>
                                    <div className="mt-1 space-y-1">
                                        {day.tasks.map((task, idx) => (
                                            <p key={idx} className="text-sm text-gray-500">{task}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'questions' && (
                    <Card>
                        <CardContent className="pt-6">
                            <ul className="space-y-4">
                                {result.questions.map((q, i) => (
                                    <li key={i} className="p-3 bg-gray-50 rounded-md border border-gray-100 text-gray-800 font-medium">
                                        <span className="text-primary font-bold mr-2">Q{i + 1}.</span> {q}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Action Next Box */}
            <Card className="bg-primary text-white border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <AlertCircle size={120} />
                </div>
                <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Next Steps for {result.role || 'Success'}</h3>
                            {weakSkills.length > 0 ? (
                                <p className="text-indigo-100">
                                    Focus on mastering <span className="text-white font-bold">{weakSkills.join(', ')}</span> as these are your current weak areas.
                                </p>
                            ) : (
                                <p className="text-indigo-100">You're looking strong across all extracted skills!</p>
                            )}
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => setActiveTab('plan')}
                                className="px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
                            >
                                Start Day 1 plan now
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalysisResult;

