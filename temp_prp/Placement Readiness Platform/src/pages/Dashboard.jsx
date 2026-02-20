import React from 'react';
import ReadinessScore from '../components/dashboard/ReadinessScore';
import SkillRadar from '../components/dashboard/SkillRadar';
import PracticeCard from '../components/dashboard/PracticeCard';
import WeeklyGoals from '../components/dashboard/WeeklyGoals';
import AssessmentsList from '../components/dashboard/AssessmentsList';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {/* Top Row: Readiness & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 md:h-96">
                    <ReadinessScore score={72} />
                </div>
                <div className="h-80 md:h-96">
                    <SkillRadar />
                </div>
            </div>

            {/* Bottom Row: Actions & Lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <PracticeCard />
                </div>
                <div className="md:col-span-1">
                    <WeeklyGoals />
                </div>
                <div className="md:col-span-1">
                    <AssessmentsList />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
