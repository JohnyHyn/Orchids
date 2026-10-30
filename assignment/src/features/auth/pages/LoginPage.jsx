import { message } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import {
    StarFilled,
    EditOutlined,
    CrownFilled,
    SafetyCertificateFilled,
    ArrowLeftOutlined,
    LockOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import { BrandLogo } from '../../../components/common/Navbar';

const benefits = [
    { icon: <StarFilled />, title: 'Đánh giá hoa lan', text: 'Chấm sao và chia sẻ cảm nhận về từng giống lan.' },
    { icon: <EditOutlined />, title: 'Quản lý đánh giá', text: 'Chỉnh sửa nhận xét của bạn bất cứ lúc nào.' },
    { icon: <CrownFilled />, title: 'Nhận diện quyền Admin', text: 'Tài khoản quản trị được tự động cấp quyền.' },
];

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
        <div className="mx-auto grid max-w-4xl animate-fade-up overflow-hidden rounded-lg border border-gold-400/25 bg-ink-900 shadow-2xl shadow-black/60 md:grid-cols-2">
            {/* Cột thương hiệu */}
            <div className="relative hidden overflow-hidden border-r border-gold-400/15 bg-linear-to-br from-ink-950 via-ink-900 to-gold-950 p-8 text-stone-50 md:flex md:flex-col">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)', backgroundSize: '24px 24px' }}
                />
                <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l border-t border-gold-400/60" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b border-r border-gold-400/60" />

                <div className="relative">
                    <BrandLogo />
                </div>

                <div className="relative mt-8">
                    <h2 className="font-display text-3xl font-bold leading-tight">
                        Chào mừng đến với{' '}
                        <span className="text-gold italic">
                            vườn lan
                        </span>
                    </h2>
                    <p className="mt-2 text-sm text-stone-400">
                        Tham gia cộng đồng yêu hoa lan để trải nghiệm đầy đủ các tính năng.
                    </p>
                </div>

                <ul className="relative mt-6 space-y-3">
                    {benefits.map((item) => (
                        <li key={item.title} className="flex items-start gap-3 rounded-md border border-gold-400/15 bg-ink-950/50 p-3 backdrop-blur">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-gold-200 to-gold-500 text-ink-950">
                                {item.icon}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gold-100">{item.title}</p>
                                <p className="text-xs text-stone-400">{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cột đăng nhập */}
            <div className="flex flex-col justify-center p-6 sm:p-10">
                <div className="mb-6 md:hidden">
                    <BrandLogo />
                </div>

                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-gold-400/10 text-xl text-gold-400 ring-1 ring-gold-400/20">
                    <LockOutlined />
                </span>
                <h1 className="text-gold font-display text-3xl font-bold">Đăng nhập</h1>
                <p className="mt-1 text-sm text-stone-400">
                    Sử dụng tài khoản Google để tiếp tục. Tài khoản quản trị sẽ tự động nhận diện quyền Admin.
                </p>

                <div className="mt-6 flex justify-center rounded-md border border-gold-400/15 bg-ink-950 p-4">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => message.error('Đăng nhập Google thất bại!')}
                        useOneTap
                        theme="filled_black"
                        shape="rectangular"
                    />
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs text-stone-500">
                    <SafetyCertificateFilled className="text-gold-400" />
                    Chúng tôi chỉ lưu tên, email và ảnh đại diện từ tài khoản Google của bạn.
                </p>

                <div className="mt-6 border-t border-white/8 pt-4">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-400! hover:text-gold-200!">
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
