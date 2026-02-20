import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, FileText, BookOpen, User, Menu, CheckCircle, Send, ClipboardList } from 'lucide-react';
import GlobalLayout from '../components/layout/GlobalLayout';

const DashboardLayout = () => {
    const location = useLocation();

    // Calculate status and progress for GlobalLayout
    const [checklistStatus, setChecklistStatus] = React.useState({});
    const [proofData, setProofData] = React.useState({});

    React.useEffect(() => {
        const savedChecklist = localStorage.getItem('placeready_checklist');
        const savedProof = localStorage.getItem('prp_final_submission');
        if (savedChecklist) setChecklistStatus(JSON.parse(savedChecklist));
        if (savedProof) setProofData(JSON.parse(savedProof));
    }, [location.pathname]); // Update on navigation

    const passedTests = Object.values(checklistStatus).filter(Boolean).length === 10;
    const hasLinks = proofData.lovable && proofData.github && proofData.deployed;
    const allStepsDone = true; // Placeholder for 8 steps logic, will refine in ProofPage

    const isShipped = passedTests && hasLinks && allStepsDone;
    const currentStatus = isShipped ? 'Shipped' : 'In Progress';

    // Step mapping
    const pathToStep = {
        '/': 0,
        '/app/dashboard': 1,
        '/app/practice': 2,
        '/app/assessments': 3,
        '/app/resources': 4,
        '/app/profile': 5,
        '/prp/07-test': 6,
        '/prp/proof': 7,
        '/prp/08-ship': 8
    };
    const currentStep = pathToStep[location.pathname] || 1;

    const navItems = [
        { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { name: 'Practice', path: '/app/practice', icon: Code },
        { name: 'Assessments', path: '/app/assessments', icon: FileText },
        { name: 'Resources', path: '/app/resources', icon: BookOpen },
        { name: 'Profile', path: '/app/profile', icon: User },
        { name: 'Test Checklist', path: '/prp/07-test', icon: CheckCircle },
        { name: 'Proof of Work', path: '/prp/proof', icon: ClipboardList },
        { name: 'Ship Project', path: '/prp/08-ship', icon: Send },
    ];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4 mb-5">
                                <span className="text-xl font-bold text-primary">Placement Prep</span>
                            </div>
                            <nav className="mt-5 flex-1 px-2 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                ? 'bg-indigo-50 text-primary'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <item.icon
                                                className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <div className="flex items-center w-full">
                                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                    S
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">Student User</p>
                                    <p className="text-xs font-medium text-gray-500">View Profile</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Mobile header */}
                <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                    <button className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <GlobalLayout
                    stepCurrent={currentStep}
                    stepTotal={8}
                    status={currentStatus}
                >
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </GlobalLayout>
            </div>
        </div>
    );
};

export default DashboardLayout;
