import { Card, message } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const LoginPage = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = (credentialResponse) => {
        try {
            // Giải mã token trả về từ Google để lấy email, tên, ảnh đại diện
            const decoded = jwtDecode(credentialResponse.credential);
            const loggedUser = loginWithGoogle(decoded);

            if (loggedUser.role === 'admin') {
                message.success(`Xin chào Quản trị viên: ${loggedUser.name}`);
                navigate('/admin/orchids');
            } else {
                message.success(`Đăng nhập thành công! Chào ${loggedUser.name}`);
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            message.error('Đăng nhập thất bại, không thể giải mã tài khoản Google.');
        }
    };
    return (
        <div className="flex justify-center items-center py-16">
            <Card className="w-full max-w-md shadow-xl rounded-2xl p-6 text-center border-emerald-100">
                <div className="text-4xl mb-3">🌸</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Orchid Paradise</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Đăng nhập bằng tài khoản Google để tiếp tục. Tài khoản quản trị sẽ tự động nhận diện quyền Admin.
                </p>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => message.error('Đăng nhập Google thất bại!')}
                        useOneTap
                    />
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;