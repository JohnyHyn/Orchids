import { Card, Tag, Rate, Typography, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const OrchidCard = ({ orchid }) => {
    const navigate = useNavigate();

    // Tính điểm đánh giá trung bình từ mảng feedback
    const feedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbacks.length).toFixed(1)
        : 0;

    return (
        <Card
            hoverable
            className="overflow-hidden rounded-none shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            cover={
                <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                        alt={orchid.orchidName}
                        src={orchid.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {orchid.isSpecial && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-none shadow">
                            ĐẶC BIỆT
                        </span>
                    )}
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-none shadow">
                        {orchid.category}
                    </span>
                </div>
            }
        >
            <div className="flex flex-col flex-1 justify-between">
                <div>
                    <Title level={5} className="mb-1 truncate text-gray-800" title={orchid.orchidName}>
                        {orchid.orchidName}
                    </Title>
                    <Text type="secondary" className="text-xs block mb-2">
                        Xuất xứ: {orchid.original || 'Không rõ'}
                    </Text>

                    {/* Đánh giá sao */}
                    <div className="flex items-center gap-1 mb-3">
                        <Rate disabled allowHalf value={Number(averageRating)} className="text-xs text-amber-400" />
                        <span className="text-xs text-gray-500">
                            ({feedbacks.length} đánh giá)
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <div className="text-emerald-600 font-bold text-lg">
                        ${orchid.price?.toLocaleString()}
                    </div>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => navigate(`/orchids/${orchid.id}`)}
                    >
                        Chi tiết
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default OrchidCard;