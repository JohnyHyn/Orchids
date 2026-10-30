import { useState } from 'react';
import { Form, Input, Button, Rate, Avatar, message } from 'antd';
import {
    SendOutlined,
    LoginOutlined,
    CheckCircleFilled,
    LockOutlined,
    UserOutlined,
    InfoCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const { TextArea } = Input;

const RATING_LABELS = ['Tệ', 'Tạm được', 'Bình thường', 'Tốt', 'Tuyệt vời'];
const RATING_CAPTIONS = [
    'Rất tiếc vì trải nghiệm chưa tốt',
    'Còn nhiều điểm cần cải thiện',
    'Đạt mức mong đợi',
    'Hài lòng với chất lượng',
    'Hoàn hảo, đáng để sưu tầm',
];

// Gợi ý nhanh: bấm để thêm vào nội dung nhận xét
const QUICK_TAGS = ['Hoa nở đẹp', 'Hương thơm dịu', 'Cây khỏe mạnh', 'Đóng gói cẩn thận', 'Đúng mô tả'];

// Khung chung cho các trạng thái của hộp đánh giá
const BoxShell = ({ children, className = '' }) => (
    <div className={`relative overflow-hidden rounded-lg border border-gold-400/25 bg-ink-900 shadow-xl shadow-black/40 ${className}`}>
        <div className="gold-rule absolute inset-x-0 top-0" />
        {children}
    </div>
);

const FeedbackForm = ({ orchid, onFeedbackSubmitted }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [ratingValue, setRatingValue] = useState(5);

    // 1. Kiểm tra nếu chưa đăng nhập
    if (!user) {
        return (
            <BoxShell className="p-6 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/10 text-2xl text-gold-400 shadow-lg shadow-gold-500/10">
                    <LockOutlined />
                </span>
                <h3 className="text-gold mb-1 font-display text-xl font-bold">Đăng nhập để đánh giá</h3>
                <p className="mx-auto mb-5 max-w-xs text-sm leading-relaxed text-stone-400">
                    Chỉ thành viên đã đăng nhập mới có thể để lại bình luận và đánh giá số sao cho hoa lan này.
                </p>
                <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                    Đăng nhập ngay
                </Button>
            </BoxShell>
        );
    }

    // 2. Ràng buộc Task 3: Mỗi thành viên chỉ được feedback 1 lần trên 1 cây lan
    const feedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
    const hasFeedbacked = feedbacks.some(
        (fb) => fb.author?.toLowerCase() === user.email?.toLowerCase()
    );

    if (hasFeedbacked) {
        return (
            <BoxShell className="p-5">
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold-200 to-gold-500 text-xl text-ink-950 shadow-lg shadow-gold-500/20">
                        <CheckCircleFilled />
                    </span>
                    <div>
                        <h3 className="mb-1 font-display text-lg font-semibold text-gold-200">Bạn đã đánh giá hoa lan này</h3>
                        <p className="text-sm leading-relaxed text-stone-400">
                            Theo quy định, mỗi thành viên chỉ được gửi đánh giá và nhận xét một lần duy nhất cho mỗi hoa lan.
                            Bạn có thể chỉnh sửa đánh giá của mình trong danh sách bên cạnh.
                        </p>
                    </div>
                </div>
            </BoxShell>
        );
    }

    // 3. Xử lý gửi feedback
    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const newFeedback = {
                rating: values.rating,
                comment: values.comment,
                author: user.email,
                date: new Date().toISOString(),
            };

            await onFeedbackSubmitted(newFeedback);
            form.resetFields();
            setRatingValue(5);
            message.success('Cảm ơn bạn đã gửi đánh giá!');
        } catch (err) {
            console.error(err);
            message.error('Gửi đánh giá thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    // Thêm gợi ý nhanh vào ô nhận xét
    const handleAddTag = (tag) => {
        const current = (form.getFieldValue('comment') || '').trim();
        if (current.toLowerCase().includes(tag.toLowerCase())) return;
        form.setFieldValue('comment', current ? `${current.replace(/[.,]$/, '')}, ${tag.toLowerCase()}.` : `${tag}.`);
        form.validateFields(['comment']);
    };

    const ratingIndex = Math.min(Math.max(Math.ceil(ratingValue || 0), 1), 5) - 1;

    return (
        <BoxShell>
            {/* Tiêu đề hộp đánh giá */}
            <div className="flex flex-col items-center gap-2 border-b border-white/8 px-6 pb-5 pt-6 text-center">
                <Avatar
                    size={52}
                    src={user.avatar}
                    icon={!user.avatar && <UserOutlined />}
                    className="ring-1 ring-gold-400/60 ring-offset-2 ring-offset-ink-900"
                    style={{ backgroundColor: '#2e240c', color: '#d4af37' }}
                />
                <div className="min-w-0 max-w-full">
                    <h3 className="text-gold font-display text-xl font-bold leading-tight">Viết đánh giá</h3>
                    <p className="mt-0.5 truncate text-xs text-stone-500">
                        Đánh giá với tư cách <span className="text-stone-300">{user.name || user.email}</span>
                    </p>
                </div>
            </div>

            {/* Lưu ý: antd reset padding của <Form>, nên đặt padding ở thẻ bọc bên ngoài */}
            <div className="px-6 pb-6 pt-5">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ rating: 5 }}
                    onValuesChange={(changed) => {
                        if ('rating' in changed) setRatingValue(changed.rating);
                    }}
                    requiredMark={false}
                >
                    <div className="space-y-5">
                        {/* Bảng chọn số sao */}
                        <div className="flex flex-col items-center rounded-lg border border-gold-400/15 bg-ink-950/70 px-4 py-5 text-center">
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
                                Mức độ hài lòng của bạn
                            </p>
                            <Form.Item
                                name="rating"
                                rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                                className="mb-2! w-full [&_.ant-form-item-control-input-content]:flex [&_.ant-form-item-control-input-content]:justify-center [&_.ant-form-item-explain]:text-center"
                            >
                                <Rate tooltips={RATING_LABELS} allowClear={false} style={{ fontSize: 32 }} />
                            </Form.Item>
                            <p className="font-display text-lg font-semibold text-gold-200">
                                {RATING_LABELS[ratingIndex]}
                                <span className="ml-2 text-sm font-normal text-stone-500">· {ratingValue || 0}/5</span>
                            </p>
                            <p className="mt-0.5 text-xs text-stone-500">{RATING_CAPTIONS[ratingIndex]}</p>
                        </div>

                        {/* Nội dung nhận xét */}
                        <div>
                            <label htmlFor="feedback-comment" className="mb-3 block text-center text-sm font-medium text-stone-200">
                                Nhận xét của bạn
                            </label>
                            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
                                {QUICK_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleAddTag(tag)}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/10 bg-ink-850 px-2.5 py-1 text-xs text-stone-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
                                    >
                                        <PlusOutlined className="text-[9px]" /> {tag}
                                    </button>
                                ))}
                            </div>
                            <Form.Item
                                name="comment"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung nhận xét!' }]}
                                className="mb-0!"
                            >
                                <TextArea
                                    id="feedback-comment"
                                    rows={4}
                                    showCount
                                    placeholder="Chia sẻ cảm nhận về vẻ đẹp, hương thơm hay chất lượng của hoa..."
                                />
                            </Form.Item>
                        </div>

                        {/* Chân hộp: ghi chú + nút gửi */}
                        <div className="flex flex-col items-center gap-3 border-t border-white/8 pt-5 text-center">
                            <p className="max-w-xs text-xs leading-relaxed text-stone-500">
                                <InfoCircleOutlined className="mr-1.5 text-gold-400" />
                                Mỗi thành viên chỉ được đánh giá một lần cho mỗi hoa lan, nhưng có thể chỉnh sửa sau.
                            </p>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={submitting}
                                icon={<SendOutlined />}
                            >
                                Gửi đánh giá
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </BoxShell>
    );
};

export default FeedbackForm;
