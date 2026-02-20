import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Clock, Briefcase, ChevronRight } from 'lucide-react';

const HistoryList = ({ history, onSelect }) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p>No analysis history found.</p>
                <p className="text-sm mt-1">Run a new analysis to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {history.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md cursor-pointer transition-all group"
                >
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${item.finalScore >= 70 ? 'bg-green-100 text-green-700' : (item.finalScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                            <span className="font-bold text-sm block min-w-[20px] text-center">{item.finalScore}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {item.role || 'Unknown Role'}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {item.company || 'Unknown Company'}</span>
                                <span>•</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
            ))}
        </div>
    );
};

export default HistoryList;
