import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, Button, Rate, Image, Breadcrumb, message } from 'antd';
import {
    ArrowLeftOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    TagsOutlined,
    StarFilled,
    CrownFilled,
    SafetyCertificateOutlined,
    CarOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import orchidService from '../services/orchidService';
import { OrchidImageFallback } from '../components/OrchidCard';
import FeedbackList from '../../feedback/components/FeedbackList';
import FeedbackForm from '../../feedback/components/FeedbackForm';
import { useAuth } from '../../../context/AuthContext';

const SpecItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-ink-850 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink-900 text-lg text-gold-400 shadow-sm">
            {icon}
        </span>
        <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-stone-500">{label}</p>
            <p className="truncate font-semibold text-stone-200">{value}</p>
        </div>
    </div>
);

const OrchidDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 👉 1. HOOKS PHẢI NẰM Ở ĐÂY (BÊN TRONG COMPONENT)
    const { user, isAdmin } = useAuth();
    const [orchid, setOrchid] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tải thông tin hoa lan theo ID
    const fetchOrchidDetail = async () => {
        try {
            setLoading(true);
            const data = await orchidService.getById(id);
            setOrchid(data);
        } catch (err) {
            console.error(err);
            message.error('Không tìm thấy thông tin hoa lan!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrchidDetail();
    }, [id]);

    // 👉 2. CÁC HÀM XỬ LÝ FEEDBACK NẰM Ở ĐÂY
    // Gửi feedback mới
    const handleFeedbackSubmitted = async (newFeedback) => {
        const currentFeedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
        const updatedFeedbacks = [...currentFeedbacks, newFeedback];

        await orchidService.update(orchid.id, {
            ...orchid,
            feedback: updatedFeedbacks,
        });

        setOrchid({ ...orchid, feedback: updatedFeedbacks });
    };

    // Sửa feedback của thành viên
    const handleUpdateFeedback = async (updatedFeedback) => {
        const currentFeedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
        const updatedFeedbacks = currentFeedbacks.map((fb) =>
            fb.author?.toLowerCase() === updatedFeedback.author?.toLowerCase()
                ? updatedFeedback
                : fb
        );

        await orchidService.update(orchid.id, {
            ...orchid,
            feedback: updatedFeedbacks,
        });

        setOrchid({ ...orchid, feedback: updatedFeedbacks });
        message.success('Cập nhật đánh giá thành công!');
    };

    // Xóa feedback dành cho Admin
    const handleDeleteFeedback = async (authorEmail) => {
        const currentFeedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
        const updatedFeedbacks = currentFeedbacks.filter(
            (fb) => fb.author?.toLowerCase() !== authorEmail?.toLowerCase()
        );

        await orchidService.update(orchid.id, {
            ...orchid,
            feedback: updatedFeedbacks,
        });

        setOrchid({ ...orchid, feedback: updatedFeedbacks });
        message.success('Đã xóa đánh giá thành công!');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-stone-400">
                <Spin size="large" />
                <span>Đang tải thông tin hoa lan...</span>
            </div>
        );
    }

    if (!orchid) {
        return (
            <div className="mx-auto max-w-md rounded-lg border border-white/8 bg-ink-900 py-16 text-center shadow-sm">
                <div className="mb-4 text-6xl">🥀</div>
                <h2 className="mb-2 font-display text-2xl font-bold text-stone-100">Không tìm thấy hoa lan</h2>
                <p className="mb-6 text-stone-400">Hoa lan bạn tìm có thể đã bị xoá hoặc không tồn tại.</p>
                <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
                    Về trang chủ
                </Button>
            </div>
        );
    }

    const feedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbacks.length).toFixed(1)
        : 0;

    // Phân bố số sao (5 → 1) để hiển thị thanh thống kê
    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
        const count = feedbacks.filter((fb) => Math.round(Number(fb.rating) || 0) === star).length;
        return { star, count, percent: feedbacks.length ? (count / feedbacks.length) * 100 : 0 };
    });

    const descriptionParagraphs = (orchid.description || '')
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <div className="space-y-6 pb-6">
            {/* Breadcrumb + Quay lại */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Breadcrumb
                    items={[
                        { title: <Link to="/"><HomeOutlined /> Trang chủ</Link> },
                        { title: <span className="font-medium text-stone-200">{orchid.orchidName}</span> },
                    ]}
                />
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>

            {/* Thông tin chính của hoa lan */}
            <div className="grid animate-fade-up grid-cols-1 gap-6 rounded-lg border border-gold-400/15 bg-ink-900/80 p-4 shadow-2xl shadow-black/50 md:p-6 lg:grid-cols-[5fr_7fr] lg:gap-8">
                {/* Ảnh lớn */}
                <div className="relative">
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-gold-400/30 bg-ink-800 shadow-xl shadow-gold-500/10">
                        {orchid.image ? (
                            <Image
                                src={orchid.image}
                                alt={orchid.orchidName}
                                width="100%"
                                height="100%"
                                rootClassName="block! h-full w-full"
                                className="object-cover"
                                preview={{ mask: 'Phóng to' }}
                            />
                        ) : (
                            <OrchidImageFallback />
                        )}
                        {orchid.isSpecial && (
                            <span className="badge-gold pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-950 shadow-lg shadow-gold-500/30">
                                <CrownFilled /> Đặc Biệt
                            </span>
                        )}
                    </div>
                </div>

                {/* Thông số */}
                <div className="flex flex-col">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        {orchid.category && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-800 px-3 py-1 text-xs font-semibold text-stone-300 ring-1 ring-white/12">
                                <TagsOutlined /> {orchid.category}
                            </span>
                        )}
                        {orchid.isSpecial && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-400 ring-1 ring-gold-400/30">
                                <CrownFilled /> Giống lan quý hiếm
                            </span>
                        )}
                    </div>

                    <h1 className="mb-2 font-display text-2xl font-bold leading-tight text-stone-50 md:text-3xl">
                        {orchid.orchidName}
                    </h1>

                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <Rate disabled allowHalf value={Number(averageRating)} />
                        <span className="font-semibold text-stone-200">{averageRating} / 5</span>
                        <span className="text-sm text-stone-500">({feedbacks.length} lượt đánh giá)</span>
                    </div>

                    <div className="mb-4 rounded-lg bg-linear-to-r from-gold-400/10 to-transparent px-5 py-3 ring-1 ring-gold-400/20">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gold-400/70">Giá niêm yết</p>
                        <p className="text-gold font-display text-3xl font-bold tracking-tight">
                            ${orchid.price?.toLocaleString()}
                        </p>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        <SpecItem icon={<EnvironmentOutlined />} label="Xuất xứ" value={orchid.original || 'Không rõ'} />
                        <SpecItem icon={<TagsOutlined />} label="Danh mục" value={orchid.category || '—'} />
                    </div>

                    <div className="border-t border-white/8 pt-4">
                        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-400">Mô tả sản phẩm</h2>
                        {descriptionParagraphs.length > 0 ? (
                            <div className="space-y-2 text-[15px] leading-relaxed text-stone-300">
                                {descriptionParagraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        ) : (
                            <p className="italic text-stone-500">Chưa có mô tả cho loài hoa này.</p>
                        )}
                    </div>

                    <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/8 pt-4 text-center text-xs text-stone-400">
                        <div className="flex flex-col items-center gap-1"><SafetyCertificateOutlined className="text-lg text-gold-400" /> Chuẩn giống</div>
                        <div className="flex flex-col items-center gap-1"><CarOutlined className="text-lg text-gold-400" /> Giao hàng an toàn</div>
                        <div className="flex flex-col items-center gap-1"><CustomerServiceOutlined className="text-lg text-gold-400" /> Tư vấn chăm sóc</div>
                    </div>
                </div>
            </div>

            {/* Khu vực Feedback */}
            <section className="space-y-4">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Cộng đồng</p>
                    <h2 className="font-display text-2xl font-bold text-stone-50">
                        Đánh giá & Bình luận ({feedbacks.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Tổng quan đánh giá + Form */}
                    <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                        <div className="rounded-lg border border-gold-400/15 bg-ink-900 p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-4">
                                <span className="text-gold font-display text-4xl font-bold">{averageRating}</span>
                                <div>
                                    <Rate disabled allowHalf value={Number(averageRating)} style={{ fontSize: 16 }} />
                                    <p className="mt-1 text-xs text-stone-500">Dựa trên {feedbacks.length} đánh giá</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {ratingDistribution.map(({ star, count, percent }) => (
                                    <div key={star} className="flex items-center gap-3 text-xs">
                                        <span className="flex w-7 items-center gap-0.5 font-medium text-stone-300">
                                            {star} <StarFilled className="text-gold-400" />
                                        </span>
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-800">
                                            <div
                                                className="h-full rounded-full bg-linear-to-r from-gold-300 to-gold-500 transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="w-5 text-right text-stone-500">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form gửi feedback */}
                        <FeedbackForm orchid={orchid} onFeedbackSubmitted={handleFeedbackSubmitted} />
                    </div>

                    {/* Danh sách feedback (có truyền các hàm Sửa & Xóa) */}
                    <div className="lg:col-span-2">
                        <FeedbackList
                            feedbacks={feedbacks}
                            currentEmail={user?.email}
                            isAdmin={isAdmin}
                            onUpdateFeedback={handleUpdateFeedback}
                            onDeleteFeedback={handleDeleteFeedback}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OrchidDetailPage;
