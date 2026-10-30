import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { message } from 'antd';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, isAdmin } = useAuth();

    // Chưa đăng nhập -> đá về trang Login
    if (!user) {
        message.warning('Bạn cần đăng nhập để truy cập trang này!');
        return <Navigate to="/login" replace />;
    }

    // Vào trang Admin nhưng không có quyền Admin -> đá về trang chủ
    if (requireAdmin && !isAdmin) {
        message.error('Bạn không có quyền quản trị viên!');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;