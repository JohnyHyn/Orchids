import { useState } from 'react';
import { Rate } from 'antd';
import { ArrowRightOutlined, EnvironmentOutlined, CrownFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Khung ảnh dự phòng khi hoa lan chưa có ảnh hoặc ảnh lỗi
export const OrchidImageFallback = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-ink-800 to-ink-700 text-gold-400/60">
        <span className="font-brand text-5xl">✿</span>
        <span className="text-xs font-medium">Chưa có hình ảnh</span>
    </div>
);

const OrchidCard = ({ orchid }) => {
    const [imgError, setImgError] = useState(false);

    // Tính điểm đánh giá trung bình từ mảng feedback
    const feedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbacks.length).toFixed(1)
        : 0;

    return (
        <Link
            to={`/orchids/${orchid.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-ink-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/10"
        >
            {/* Khung ảnh tỷ lệ vàng */}
            <div className="relative aspect-[1.618/1] overflow-hidden bg-ink-800">
                {orchid.image && !imgError ? (
                    <img
                        alt={orchid.orchidName}
                        src={orchid.image}
                        loading="lazy"
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <OrchidImageFallback />
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {orchid.isSpecial && (
                    <span className="badge-gold absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950 shadow-lg shadow-gold-500/30">
                        <CrownFilled /> Đặc Biệt
                    </span>
                )}
                {orchid.category && (
                    <span className="absolute right-3 top-3 rounded-full border border-gold-400/30 bg-ink-950/75 px-2.5 py-1 text-[11px] font-semibold text-gold-300 shadow-sm backdrop-blur">
                        {orchid.category}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3
                    className="mb-1 truncate font-display text-[17px] font-semibold text-stone-100 transition-colors group-hover:text-gold-400"
                    title={orchid.orchidName}
                >
                    {orchid.orchidName}
                </h3>
                <p className="mb-3 flex items-center gap-1 text-xs text-stone-500">
                    <EnvironmentOutlined /> {orchid.original || 'Không rõ xuất xứ'}
                </p>

                {/* Đánh giá sao */}
                <div className="mb-3 flex items-center gap-2">
                    <Rate disabled allowHalf value={Number(averageRating)} style={{ fontSize: 14 }} />
                    <span className="text-xs text-stone-400">
                        {feedbacks.length > 0 && <strong className="text-gold-400">{averageRating}</strong>} ({feedbacks.length} đánh giá)
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-3">
                    <div className="text-gold font-display text-xl font-bold tracking-tight">
                        ${orchid.price?.toLocaleString()}
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gold-400/10 px-3 py-1.5 text-xs font-semibold text-gold-400 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-ink-950">
                        Chi tiết <ArrowRightOutlined className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default OrchidCard;
