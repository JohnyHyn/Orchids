import { useState } from 'react';
import { Rate, Empty, Button, Modal, Form, Input, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, CheckCircleFilled } from '@ant-design/icons';

const { TextArea } = Input;

// Màu avatar (tông vàng kim / đen huyền) ổn định theo email
const AVATAR_GRADIENTS = [
    'from-gold-200 to-gold-500 text-ink-950',
    'from-gold-400 to-gold-700 text-ink-950',
    'from-stone-300 to-stone-500 text-ink-950',
    'from-gold-600 to-gold-900 text-gold-100',
    'from-ink-500 to-ink-700 text-gold-300',
    'from-stone-500 to-ink-600 text-gold-200',
];

const getAvatarGradient = (email = '') => {
    const hash = [...email].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '';

const FeedbackList = ({
    feedbacks = [],
    currentEmail,
    isAdmin = false,
    onUpdateFeedback,
    onDeleteFeedback,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-white/12 bg-ink-900 py-8">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có đánh giá nào cho hoa lan này. Hãy là người đầu tiên đánh giá!"
                />
            </div>
        );
    }

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        form.setFieldsValue({
            rating: Number(item.rating) || 5,
            comment: item.comment,
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (values) => {
        if (editingItem && onUpdateFeedback) {
            const updatedData = {
                ...editingItem,
                rating: values.rating,
                comment: values.comment,
                date: new Date().toISOString(),
            };
            await onUpdateFeedback(updatedData);
            setIsEditModalOpen(false);
        }
    };

    return (
        <>
            <div className="space-y-3">
                {feedbacks.map((item, index) => {
                    const isMyFeedback = currentEmail && item.author?.toLowerCase() === currentEmail.toLowerCase();

                    return (
                        <article
                            key={item.author || index}
                            className={`group relative rounded-lg border p-4 transition-all duration-300 hover:shadow-md hover:shadow-black/40 ${isMyFeedback
                                ? 'border-gold-400/50 bg-gold-400/5 ring-1 ring-gold-400/20'
                                : 'border-white/8 bg-ink-900 shadow-sm hover:border-gold-400/25'
                                }`}
                        >
                            <header className="flex items-start gap-4">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br font-brand text-lg font-semibold uppercase shadow-sm ring-1 ring-gold-400/30 ${getAvatarGradient(item.author)}`}
                                >
                                    {item.author?.charAt(0) || '?'}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="truncate font-semibold text-stone-100">{item.author}</span>
                                        {isMyFeedback && (
                                            <span className="inline-flex items-center gap-1 badge-gold rounded-full px-2 py-0.5 text-[11px] font-semibold text-ink-950">
                                                <CheckCircleFilled /> Đánh giá của bạn
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <Rate disabled value={Number(item.rating) || 5} style={{ fontSize: 14 }} />
                                        <span className="flex items-center gap-1 text-xs text-stone-500">
                                            <ClockCircleOutlined /> {formatDate(item.date)}
                                        </span>
                                    </div>
                                </div>

                                {/* Thao tác: Sửa (chủ đánh giá) / Xóa (Admin) */}
                                {(isMyFeedback || isAdmin) && (
                                    <div className="flex shrink-0 items-center gap-1">
                                        {/* 1. Nếu là đánh giá của mình -> Hiện nút Sửa */}
                                        {isMyFeedback && (
                                            <Tooltip title="Sửa đánh giá của bạn">
                                                <Button
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleOpenEdit(item)}
                                                >
                                                    Sửa
                                                </Button>
                                            </Tooltip>
                                        )}

                                        {/* 2. Nếu là Admin -> Hiện nút Xóa */}
                                        {isAdmin && (
                                            <Popconfirm
                                                title="Xóa đánh giá này?"
                                                description="Bạn có chắc muốn xóa đánh giá này với tư cách Quản trị viên?"
                                                onConfirm={() => onDeleteFeedback(item.author)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <Tooltip title="Xóa đánh giá (Admin)">
                                                    <Button size="small" danger icon={<DeleteOutlined />}>
                                                        Xóa
                                                    </Button>
                                                </Tooltip>
                                            </Popconfirm>
                                        )}
                                    </div>
                                )}
                            </header>

                            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-stone-300 md:pl-14">
                                {item.comment}
                            </p>
                        </article>
                    );
                })}
            </div>

            {/* Modal Sửa đánh giá */}
            <Modal
                title={
                    <span className="flex items-center gap-2">
                        <EditOutlined className="text-gold-400" /> Chỉnh sửa đánh giá của bạn
                    </span>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                forceRender
            >
                <Form form={form} layout="vertical" onFinish={handleEditSubmit} className="mt-4!" requiredMark={false}>
                    <Form.Item
                        label="Đánh giá số sao"
                        name="rating"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                    >
                        <Rate tooltips={['Tệ', 'Tạm được', 'Bình thường', 'Tốt', 'Tuyệt vời']} style={{ fontSize: 24 }} />
                    </Form.Item>

                    <Form.Item
                        label="Nhận xét"
                        name="comment"
                        rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
                    >
                        <TextArea rows={4} variant="filled" placeholder="Cập nhật nhận xét của bạn..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FeedbackList;
