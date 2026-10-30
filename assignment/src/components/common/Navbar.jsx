import { Link, useNavigate } from 'react-router-dom';
import { Button, Space, Avatar, Dropdown, Tag } from 'antd';
import {
    HomeOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { InfoCircleOutlined, ContactsOutlined } from '@ant-design/icons';
const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();

    // Menu xổ xuống khi bấm vào Avatar người dùng
    const userMenuItems = [
        {
            key: 'user-info',
            label: (
                <div className="px-2 py-1">
                    <p className="font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <Tag color={isAdmin ? 'red' : 'blue'} className="mt-1">
                        {isAdmin ? 'Quản trị viên (Admin)' : 'Thành viên'}
                    </Tag>
                </div>
            ),
        },
        { type: 'divider' },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
            label: 'Đăng xuất',
            onClick: () => {
                logout();
                navigate('/');
            },
        },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-emerald-600 flex items-center gap-2 hover:opacity-80">
                    <span>🌸 Orchid Paradise</span>
                </Link>

                {/* Menu Điều Hướng */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                        <HomeOutlined /> Trang chủ
                    </Link>
                    <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                        <InfoCircleOutlined /> Giới thiệu
                    </Link>
                    <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                        <ContactsOutlined /> Liên hệ tư vấn
                    </Link>
                    {/* Chỉ hiển thị menu Admin khi đăng nhập bằng email Admin */}
                    {isAdmin && (
                        <>
                            <Link to="/admin/orchids" className="text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                                <AppstoreOutlined /> Quản lý Lan
                            </Link>
                            <Link to="/admin/categories" className="text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                                <UnorderedListOutlined /> Quản lý Danh mục
                            </Link>
                        </>
                    )}
                </div>

                {/* Khu vực Tài khoản */}
                <Space>
                    {user ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                <Avatar
                                    src={user.avatar}
                                    icon={!user.avatar && <UserOutlined />}
                                    className="bg-emerald-600"
                                />
                                <span className="font-medium text-gray-700 hidden sm:inline">{user.name}</span>
                            </div>
                        </Dropdown>
                    ) : (
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Button>
                    )}
                </Space>
            </div>
        </header>
    );
};

export default Navbar;