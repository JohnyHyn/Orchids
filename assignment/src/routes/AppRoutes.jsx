import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import HomePage from '../features/orchids/pages/HomePage';
import OrchidDetailPage from '../features/orchids/pages/OrchidDetailPage';
import OrchidManagePage from '../features/orchids/pages/OrchidManagePage';
import CategoryManagePage from '../features/categories/pages/CategoryManagePage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import AboutPage from '../features/about/pages/AboutPage';
import ContactPage from '../features/contact/pages/ContactPage';
import LandingPage from '../features/landing/pages/LandingPage';
const AppRoutes = () => {
    return (
        <Routes>
            {/* Landing Page giới thiệu (toàn màn hình, không dùng MainLayout) */}
            <Route path="/welcome" element={<LandingPage />} />

            <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<HomePage />} />
                <Route path="orchids/:id" element={<OrchidDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />

                {/* Member Route (Phải đăng nhập) */}
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes (Chỉ email Admin mới vào được) */}
                <Route
                    path="admin/orchids"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <OrchidManagePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/categories"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <CategoryManagePage />
                        </ProtectedRoute>
                    }
                />

                {/* 404 Route */}
                <Route
                    path="*"
                    element={<div className="text-center py-20 text-xl font-bold">404 - Không tìm thấy trang</div>}
                />
            </Route>
        </Routes>
    );
};

export default AppRoutes;