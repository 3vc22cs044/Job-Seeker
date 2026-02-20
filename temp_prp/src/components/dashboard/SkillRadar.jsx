import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const data = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const SkillRadar = () => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Student"
                            dataKey="A"
                            stroke="hsl(245, 58%, 51%)"
                            strokeWidth={2}
                            fill="hsl(245, 58%, 51%)"
                            fillOpacity={0.3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default SkillRadar;
