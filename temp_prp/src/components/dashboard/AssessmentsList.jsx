import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock, MoreVertical } from 'lucide-react';

const AssessmentsList = () => {
    const assessments = [
        { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', type: 'Technical' },
        { title: 'System Design Review', time: 'Wed, 2:00 PM', type: 'Design' },
        { title: 'HR Interview Prep', time: 'Friday, 11:00 AM', type: 'Behavioral' },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Upcoming Assessments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {assessments.map((item, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex-shrink-0 mt-1">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {item.time}
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AssessmentsList;
