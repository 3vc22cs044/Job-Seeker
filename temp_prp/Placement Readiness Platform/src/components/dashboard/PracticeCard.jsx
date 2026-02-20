import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowRight } from 'lucide-react';

const PracticeCard = () => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Continue Practice</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-gray-900">Dynamic Programming</span>
                            <span className="text-gray-500">3 / 10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                style={{ width: '30%' }}
                            ></div>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition-colors">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PracticeCard;
