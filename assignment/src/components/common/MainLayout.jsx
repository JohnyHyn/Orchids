import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
                <Outlet />

            </main>
            <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
                © 2026 Orchid Paradise. Lab 6 Assignment.
            </footer>
        </div>
    );
};

export default MainLayout;