import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Tag, Rate, Typography, message, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import orchidService from '../services/orchidService';
import FeedbackList from '../../feedback/components/FeedBackList';
import FeedbackForm from '../../feedback/components/FeedBackForm';
import { useAuth } from '../../../context/AuthContext';

const { Title, Paragraph } = Typography;

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
            <div className="flex justify-center items-center py-24">
                <Spin size="large" tip="Đang tải thông tin hoa lan..." />
            </div>
        );
    }

    if (!orchid) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy hoa lan</h2>
                <Button onClick={() => navigate('/')}>Về trang chủ</Button>
            </div>
        );
    }

    const feedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbacks.length).toFixed(1)
        : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Nút quay lại */}
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="hover:text-emerald-600">
                Quay lại
            </Button>

            {/* Thông tin chính của hoa lan */}
            <div className="bg-white rounded-none p-6 md:p-8 shadow-sm border grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative rounded-none overflow-hidden bg-gray-100 flex items-center justify-center min-h-[350px]">
                    <img
                        src={orchid.image || 'https://via.placeholder.com/500?text=No+Image'}
                        alt={orchid.orchidName}
                        className="w-full h-full object-cover max-h-[450px]"
                    />
                    {orchid.isSpecial && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-none shadow">
                            ĐẶC BIỆT
                        </span>
                    )}
                </div>

                <div className="flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag color="emerald" className="text-sm px-3 py-0.5">
                                {orchid.category}
                            </Tag>
                            <span className="text-gray-400 text-sm">Xuất xứ: {orchid.original || 'Không rõ'}</span>
                        </div>

                        <Title level={2} className="text-gray-800 !mb-2">
                            {orchid.orchidName}
                        </Title>

                        <div className="flex items-center gap-2 mb-4">
                            <Rate disabled allowHalf value={Number(averageRating)} className="text-amber-400" />
                            <span className="font-semibold text-gray-700">{averageRating} / 5</span>
                            <span className="text-gray-400 text-sm">({feedbacks.length} lượt đánh giá)</span>
                        </div>

                        <div className="text-3xl font-extrabold text-emerald-600 mb-6">
                            ${orchid.price?.toLocaleString()}
                        </div>

                        <Divider className="my-4" />

                        <div>
                            <h4 className="font-bold text-gray-700 mb-2">Mô tả sản phẩm:</h4>
                            <Paragraph className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {orchid.description || 'Chưa có mô tả cho loài hoa này.'}
                            </Paragraph>
                        </div>
                    </div>
                </div>
            </div>

            {/* Khu vực Feedback */}
            <div className="space-y-6">
                <Title level={3} className="text-gray-800">
                    Đánh giá & Bình luận ({feedbacks.length})
                </Title>

                {/* Form gửi feedback */}
                <FeedbackForm orchid={orchid} onFeedbackSubmitted={handleFeedbackSubmitted} />

                {/* Danh sách feedback (có truyền các hàm Sửa & Xóa) */}
                <FeedbackList
                    feedbacks={feedbacks}
                    currentEmail={user?.email}
                    isAdmin={isAdmin}
                    onUpdateFeedback={handleUpdateFeedback}
                    onDeleteFeedback={handleDeleteFeedback}
                />
            </div>
        </div>
    );
};

export default OrchidDetailPage;