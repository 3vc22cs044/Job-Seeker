import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Video, BarChart2, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar Placeholder if needed, but Hero serves well */}

            {/* Hero Section */}
            <section className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Ace Your Placement</span>
                        <span className="block text-primary">Practice, assess, and prepare</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        The comprehensive platform to master coding interviews, aptitude tests, and soft skills. Your dream job is just a preparation away.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <Link
                                to="/app/dashboard"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover md:py-4 md:text-lg md:px-10 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                        {/* Feature 1 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <Code className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Practice Problems</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Solve curated coding challenges sorted by company and difficulty.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <Video className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Mock Interviews</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Simulate real interview scenarios with AI-driven feedback.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <BarChart2 className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Visualize your improvement with detailed analytics and insights.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="font-bold text-xl">PlacementPrep</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; 2026 Placement Readiness Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
