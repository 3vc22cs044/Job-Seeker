import React from 'react';
import Assessments from './Assessments';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Content for {title} goes here.</p>
            </div>
        </div>
    );
};

export const Dashboard = () => <PlaceholderPage title="Dashboard" />;
export const Practice = () => <PlaceholderPage title="Practice Problems" />;
export { Assessments }; // Exporting the real component
export const Resources = () => <PlaceholderPage title="Resources" />;
export const Profile = () => <PlaceholderPage title="User Profile" />;
