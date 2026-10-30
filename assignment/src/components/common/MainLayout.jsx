import { Link, Outlet } from 'react-router-dom';
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    RightOutlined,
} from '@ant-design/icons';
import Navbar, { BrandLogo } from './Navbar';

const commitments = [
    'Giống lan chuẩn gốc, có nguồn gốc rõ ràng',
    'Đóng gói chuyên dụng, giữ ẩm khi vận chuyển',
    'Bảo hành cây sống 30 ngày',
    'Tư vấn chăm sóc trọn đời miễn phí',
];

const openingHours = [
    { day: 'Thứ 2 – Thứ 6', time: '08:00 – 18:00' },
    { day: 'Thứ 7', time: '07:30 – 19:00' },
    { day: 'Chủ nhật & Lễ', time: '08:00 – 17:00' },
];

const quickLinks = [
    { to: '/welcome', label: 'Trang chào mừng' },
    { to: '/', label: 'Bộ sưu tập hoa lan' },
    { to: '/about', label: 'Giới thiệu vườn lan' },
    { to: '/contact', label: 'Liên hệ tư vấn' },
    { to: '/profile', label: 'Hồ sơ cá nhân' },
];

const FooterHeading = ({ children }) => (
    <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{children}</h4>
);

const MainLayout = () => {
    return (
        <div className="flex min-h-screen flex-col text-stone-200">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                <Outlet />

            </main>

            <footer className="relative mt-6 overflow-hidden border-t border-gold-400/20 bg-linear-to-b from-ink-900 to-ink-950 text-stone-400">
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-gold-400/5 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Thương hiệu */}
                    <div className="space-y-4">
                        <BrandLogo />
                        <p className="text-sm leading-relaxed">
                            Sàn hoa lan cao cấp dành cho người yêu lan — tuyển chọn những giống lan quý hiếm,
                            được chăm sóc tận tâm trong vườn lan sinh thái.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><EnvironmentOutlined className="text-gold-400" /> Đà Lạt, Lâm Đồng, Việt Nam</li>
                            <li className="flex items-center gap-2"><PhoneOutlined className="text-gold-400" /> 0909 000 000</li>
                            <li className="flex items-center gap-2"><MailOutlined className="text-gold-400" /> hello@orchidparadise.vn</li>
                        </ul>
                    </div>

                    {/* Cam kết chất lượng */}
                    <div>
                        <FooterHeading>Cam kết chất lượng</FooterHeading>
                        <ul className="space-y-3 text-sm">
                            {commitments.map((item) => (
                                <li key={item} className="flex items-start gap-2.5">
                                    <CheckCircleFilled className="mt-0.5 text-gold-400" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Giờ mở cửa */}
                    <div>
                        <FooterHeading>Giờ mở cửa vườn lan</FooterHeading>
                        <ul className="space-y-3 text-sm">
                            {openingHours.map((item) => (
                                <li key={item.day} className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                                    <span className="flex items-center gap-2">
                                        <ClockCircleOutlined className="text-gold-400" /> {item.day}
                                    </span>
                                    <span className="font-medium text-gold-200">{item.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liên kết nhanh */}
                    <div>
                        <FooterHeading>Liên kết nhanh</FooterHeading>
                        <ul className="space-y-3 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="group inline-flex items-center gap-2 text-stone-400! transition-colors hover:text-gold-300!"
                                    >
                                        <RightOutlined className="text-[10px] text-gold-400 transition-transform group-hover:translate-x-1" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="relative border-t border-white/8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-stone-500 sm:flex-row">
                        <span>© 2026 Orchid Paradise. Lab 6 Assignment.</span>
                        <span>✦ Tinh hoa hoa lan — Quý phái & huyền bí ✦</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
