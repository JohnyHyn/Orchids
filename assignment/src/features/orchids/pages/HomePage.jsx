import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Select, Empty, Button } from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    ArrowDownOutlined,
    CrownFilled,
} from '@ant-design/icons';
import orchidService from '../services/orchidService';
import categoryService from '../../categories/services/categoryService';
import OrchidCard from '../components/OrchidCard';
import { LANDING_SEEN_KEY } from '../../landing/pages/LandingPage';

const CardSkeleton = () => (
    <div className="animate-pulse overflow-hidden rounded-lg border border-white/8 bg-ink-900">
        <div className="aspect-[1.618/1] bg-ink-800" />
        <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded-full bg-ink-800" />
            <div className="h-3 w-1/2 rounded-full bg-ink-800" />
            <div className="h-3 w-2/3 rounded-full bg-ink-800" />
            <div className="flex justify-between border-t border-white/8 pt-4">
                <div className="h-5 w-16 rounded-full bg-ink-800" />
                <div className="h-7 w-20 rounded-full bg-ink-800" />
            </div>
        </div>
    </div>
);

const HomePage = () => {
    const [orchids, setOrchids] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const collectionRef = useRef(null);

    // State tìm kiếm & lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // 1. Tải dữ liệu ban đầu
    const fetchData = async () => {
        try {
            setLoading(true);
            const [orchidsRes, categoriesRes] = await Promise.all([
                orchidService.getAll(),
                categoryService.getAll(),
            ]);
            setOrchids(orchidsRes || []);
            setCategories(categoriesRes || []);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Lần đầu truy cập: chuyển tới Landing Page giới thiệu
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem(LANDING_SEEN_KEY)) {
            navigate('/welcome', { replace: true });
        }
    }, [navigate]);

    // 2. Logic tìm kiếm và lọc danh mục
    const filteredOrchids = orchids.filter((item) => {
        const matchName = item.orchidName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !selectedCategory || item.category === selectedCategory;
        return matchName && matchCategory;
    });

    // Reset bộ lọc
    const handleReset = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    const specialCount = orchids.filter((item) => item.isSpecial).length;
    const heroStats = [
        { value: orchids.length, label: 'Giống lan' },
        { value: categories.length, label: 'Danh mục' },
        { value: specialCount, label: 'Lan đặc biệt' },
    ];

    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div>
                <section className="relative overflow-hidden rounded-lg border border-gold-400/20 bg-linear-to-br from-ink-900 via-ink-950 to-gold-950 px-6 pb-16 pt-8 text-stone-50 shadow-2xl shadow-black/60 md:px-10 md:pb-20 md:pt-10">
                    {/* Hoạ tiết trang trí */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.12]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)', backgroundSize: '28px 28px' }}
                    />
                    {/* Viền góc vàng kim */}
                    <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l border-t border-gold-400/60" />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b border-r border-gold-400/60" />
                    <div className="relative grid animate-fade-up items-end gap-6 md:grid-cols-[1fr_auto]">
                        <div className="max-w-2xl">
                            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-200 backdrop-blur">
                                <CrownFilled className="text-gold-300" /> Bộ sưu tập hoa lan cao cấp 2026
                            </span>
                            <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
                                Vẻ đẹp quý phái của{' '}
                                <span className="text-gold italic">
                                    Hoa Lan
                                </span>
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-400 md:text-base">
                                Khám phá những giống lan quý hiếm và tuyệt đẹp được tuyển chọn từ khắp nơi.
                                Đăng nhập để cùng cộng đồng chia sẻ cảm nhận và đánh giá.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => collectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-linear-to-r from-gold-300 to-gold-500 px-6 py-2.5 text-sm font-semibold text-ink-950 shadow-lg shadow-gold-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-500/40"
                                >
                                    Khám phá ngay <ArrowDownOutlined />
                                </button>
                                <Link
                                    to="/about"
                                    className="inline-flex items-center rounded-lg border border-gold-400/40 px-5 py-2.5 text-sm font-medium text-gold-200! transition-colors hover:bg-gold-400/10"
                                >
                                    Về vườn lan
                                </Link>
                            </div>
                        </div>

                        <dl className="grid grid-cols-3 divide-x divide-gold-400/15 overflow-hidden rounded-lg border border-gold-400/25 bg-ink-950/60 backdrop-blur md:min-w-44 md:grid-cols-1 md:divide-x-0 md:divide-y md:divide-gold-400/15">
                            {heroStats.map((stat) => (
                                <div key={stat.label} className="px-5 py-3 text-center md:text-left">
                                    <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{stat.label}</dt>
                                    <dd className="text-gold font-display text-2xl font-bold">
                                        {loading ? '—' : stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* Floating Search & Filter Bar */}
                <div className="relative z-10 mx-3 -mt-8 flex flex-col items-stretch gap-3 rounded-lg border border-gold-400/20 bg-ink-900/95 p-3 shadow-xl shadow-black/60 backdrop-blur md:mx-8 md:flex-row md:items-center">
                    {/* Tìm theo tên */}
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm theo tên hoa lan..."
                            prefix={<SearchOutlined className="mr-1 text-gold-400" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                            variant="filled"
                        />
                    </div>

                    {/* Lọc theo danh mục */}
                    <div className="w-full md:w-72">
                        <Select
                            placeholder="Lọc theo danh mục"
                            prefix={<AppstoreOutlined className="mr-1 text-gold-400" />}
                            value={selectedCategory || undefined}
                            onChange={(value) => setSelectedCategory(value || '')}
                            allowClear
                            variant="filled"
                            className="w-full"
                            options={[
                                { value: '', label: 'Tất cả danh mục' },
                                ...categories.map((cat) => ({
                                    value: cat.name,
                                    label: cat.name,
                                })),
                            ]}
                        />
                    </div>

                    {/* Nút đặt lại */}
                    {(searchTerm || selectedCategory) && (
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Đặt lại
                        </Button>
                    )}
                </div>
            </div>

            {/* Danh sách Hoa Lan */}
            <section ref={collectionRef} className="scroll-mt-28 space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Bộ sưu tập</p>
                        <h2 className="font-display text-2xl font-bold text-stone-50">
                            {selectedCategory || 'Tất cả hoa lan'}
                        </h2>
                    </div>
                    {!loading && (
                        <p className="text-sm text-stone-400">
                            Hiển thị <strong className="text-stone-200">{filteredOrchids.length}</strong> / {orchids.length} giống lan
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                ) : filteredOrchids.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/12 bg-ink-900 py-10">
                        <Empty description="Không tìm thấy hoa lan nào phù hợp">
                            {(searchTerm || selectedCategory) && (
                                <Button type="primary" icon={<ReloadOutlined />} onClick={handleReset}>
                                    Xoá bộ lọc
                                </Button>
                            )}
                        </Empty>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredOrchids.map((orchid) => (
                            <OrchidCard key={orchid.id} orchid={orchid} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
