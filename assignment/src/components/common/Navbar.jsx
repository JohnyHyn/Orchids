import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, Avatar, Dropdown } from 'antd';
import {
    HomeOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    InfoCircleOutlined,
    ContactsOutlined,
    CrownFilled,
    SafetyCertificateFilled,
    DownOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const publicLinks = [
    { to: '/', label: 'Trang chủ', icon: <HomeOutlined />, end: true },
    { to: '/about', label: 'Giới thiệu', icon: <InfoCircleOutlined /> },
    { to: '/contact', label: 'Liên hệ tư vấn', icon: <ContactsOutlined /> },
];

const adminLinks = [
    { to: '/admin/orchids', label: 'Quản lý Lan', icon: <AppstoreOutlined /> },
    { to: '/admin/categories', label: 'Quản lý Danh mục', icon: <UnorderedListOutlined /> },
];

// Huy hiệu vai trò: Admin (vàng kim lấp lánh) / Thành viên (viền vàng)
export const RoleBadge = ({ isAdmin }) =>
    isAdmin ? (
        <span className="badge-gold inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-950 shadow-sm">
            <CrownFilled /> Quản trị viên
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold-400 ring-1 ring-gold-400/30">
            <SafetyCertificateFilled /> Thành viên
        </span>
    );

export const BrandLogo = () => (
    <span className="flex items-center gap-3">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/60 bg-ink-950 shadow-lg shadow-gold-500/20">
            <span className="absolute inset-0.5 rounded-sm border border-gold-400/20" />
            <span className="text-gold font-brand text-xl font-bold">O</span>
        </span>
        <span className="flex flex-col leading-none">
            <span className="text-gold font-brand text-lg font-bold tracking-wider">Orchid Paradise</span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.35em] text-stone-500">
                Luxury Orchid Boutique
            </span>
        </span>
    </span>
);

const navLinkClass = ({ isActive }) =>
    [
        'relative flex shrink-0 items-center gap-1.5 py-1 text-sm font-medium transition-colors duration-200',
        'after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-linear-to-r after:from-gold-300 after:to-gold-600 after:transition-all after:duration-300',
        isActive
            ? 'text-gold-400 after:w-full'
            : 'text-stone-300 hover:text-gold-400 after:w-0 hover:after:w-full',
    ].join(' ');

const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();
    const renderLinks = () => (
        <>
            {publicLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                    {link.icon} {link.label}
                </NavLink>
            ))}
            {/* Chỉ hiển thị menu Admin khi đăng nhập bằng email Admin */}
            {isAdmin && (
                <>
                    <span className="h-5 w-px shrink-0 bg-ink-600" />
                    {adminLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={navLinkClass}>
                            {link.icon} {link.label}
                        </NavLink>
                    ))}
                </>
            )}
        </>
    );

    // Menu xổ xuống khi bấm vào Avatar người dùng
    const userMenuItems = [
        {
            key: 'user-info',
            label: (
                <div className="flex min-w-60 items-center gap-3 px-1 py-2">
                    <Avatar
                        size={44}
                        src={user?.avatar}
                        icon={!user?.avatar && <UserOutlined />}
                        className="shrink-0 ring-2 ring-gold-400/20"
                        style={{ backgroundColor: '#2e240c', color: '#d4af37' }}
                    />
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-stone-100">{user?.name}</p>
                        <p className="mb-1.5 truncate text-xs text-stone-400">{user?.email}</p>
                        <RoleBadge isAdmin={isAdmin} />
                    </div>
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
        ...(isAdmin
            ? adminLinks.map((link) => ({
                key: link.to,
                icon: link.icon,
                label: link.label,
                onClick: () => navigate(link.to),
            }))
            : []),
        { type: 'divider' },
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
        <header className="sticky top-0 z-50 border-b border-gold-400/15 bg-ink-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
                {/* Logo */}
                <Link to="/" className="shrink-0 transition-opacity hover:opacity-90">
                    <BrandLogo />
                </Link>

                {/* Menu Điều Hướng (màn hình lớn) */}
                <nav className="hidden min-w-0 flex-1 items-center gap-5 overflow-x-auto py-2 md:flex xl:gap-6">{renderLinks()}</nav>

                {/* Khu vực Tài khoản */}
                <div className="ml-auto flex shrink-0 items-center">
                    {user ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                            <button
                                type="button"
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/12 bg-ink-900 py-1 pl-1 pr-2.5 shadow-sm transition-all hover:border-gold-400/50 hover:shadow-md"
                            >
                                <Avatar
                                    size={30}
                                    shape="square"
                                    src={user.avatar}
                                    icon={!user.avatar && <UserOutlined />}
                                    style={{ backgroundColor: '#2e240c', color: '#d4af37' }}
                                />
                                <span className="hidden max-w-36 truncate text-sm font-medium text-stone-200 sm:inline">
                                    {user.name}
                                </span>
                                {isAdmin && <CrownFilled className="text-gold-400" />}
                                <DownOutlined className="text-[10px] text-stone-500" />
                            </button>
                        </Dropdown>
                    ) : (
                        <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </div>

            {/* Menu Điều Hướng (màn hình nhỏ): một hàng cuộn ngang, không cần nút menu */}
            <nav className="flex gap-5 overflow-x-auto whitespace-nowrap border-t border-white/8 px-4 py-2.5 md:hidden">
                {renderLinks()}
            </nav>
        </header>
    );
};

export default Navbar;
