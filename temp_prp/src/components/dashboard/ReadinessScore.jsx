import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ReadinessScore = ({ score = 72 }) => {
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <Card className="flex flex-col items-center justify-center p-6 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-800">Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="relative flex items-center justify-center">
                    <svg
                        height={radius * 2}
                        width={radius * 2}
                        className="transform -rotate-90"
                    >
                        <circle
                            stroke="#e5e7eb"
                            strokeWidth={stroke}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <circle
                            stroke="currentColor"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                            strokeLinecap="round"
                            className="text-primary"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-gray-900">{score}</span>
                        <span className="text-sm font-medium text-gray-500">/ 100</span>
                    </div>
                </div>
                <span className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-wide">Readiness Score</span>
            </CardContent>
        </Card>
    );
};

export default ReadinessScore;
