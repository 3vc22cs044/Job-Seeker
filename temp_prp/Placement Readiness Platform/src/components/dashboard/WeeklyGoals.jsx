import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils'; // Assuming we'll create this or use inline

// Helper for clsx/tailwind-merge if not imported from @/lib/utils
// For now, I'll inline the logic to be safe or use the one from card.jsx if exported
// I'll create a local utility for this file to be self-contained or import from card
// Imports handled by lib/utils

const WeeklyGoals = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const activity = [true, true, false, true, true, false, false]; // Mock data

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-3xl font-bold">12</span>
                            <span className="text-gray-500 ml-1">/ 20</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500 mb-1">Problems Solved</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: '60%' }}
                        ></div>
                    </div>

                    <div className="flex justify-between pt-2">
                        {days.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                                        activity[i] ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                                    )}
                                >
                                    {day}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyGoals;
