import { useState } from 'react';
import { Form, Input, Button, Rate, Alert, message } from 'antd';
import { SendOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const { TextArea } = Input;

const FeedbackForm = ({ orchid, onFeedbackSubmitted }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // 1. Kiểm tra nếu chưa đăng nhập
    if (!user) {
        return (
            <Alert
                message="Đăng nhập để đánh giá"
                description="Chỉ thành viên đã đăng nhập mới có thể để lại bình luận và đánh giá số sao cho hoa lan này."
                type="info"
                showIcon
                action={
                    <Button type="primary" size="small" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                        Đăng nhập ngay
                    </Button>
                }
                className="rounded-xl"
            />
        );
    }

    // 2. Ràng buộc Task 3: Mỗi thành viên chỉ được feedback 1 lần trên 1 cây lan
    const feedbacks = Array.isArray(orchid.feedback) ? orchid.feedback : [];
    const hasFeedbacked = feedbacks.some(
        (fb) => fb.author?.toLowerCase() === user.email?.toLowerCase()
    );

    if (hasFeedbacked) {
        return (
            <Alert
                message="Bạn đã đánh giá hoa lan này"
                description="Theo quy định, mỗi thành viên chỉ được gửi đánh giá và nhận xét một lần duy nhất cho mỗi hoa lan."
                type="success"
                showIcon
                className="rounded-xl"
            />
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
            message.success('Cảm ơn bạn đã gửi đánh giá!');
        } catch (err) {
            console.error(err);
            message.error('Gửi đánh giá thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Gửi đánh giá của bạn</h3>
            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ rating: 5 }}>
                <Form.Item
                    label="Đánh giá số sao"
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                >
                    <Rate className="text-amber-400" />
                </Form.Item>

                <Form.Item
                    label="Nhận xét của bạn"
                    name="comment"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung nhận xét!' }]}
                >
                    <TextArea rows={3} placeholder="Chia sẻ cảm nhận về vẻ đẹp, hương thơm hay chất lượng của hoa..." />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<SendOutlined />}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    Gửi đánh giá
                </Button>
            </Form>
        </div>
    );
};

export default FeedbackForm;