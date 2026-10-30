import { useState } from 'react';
import { List, Avatar, Rate, Typography, Empty, Button, Modal, Form, Input, Popconfirm, Tag } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

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
            <Empty
                description="Chưa có đánh giá nào cho hoa lan này. Hãy là người đầu tiên đánh giá!"
                className="py-6"
            />
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
            <List
                itemLayout="horizontal"
                dataSource={feedbacks}
                renderItem={(item) => {
                    const isMyFeedback = currentEmail && item.author?.toLowerCase() === currentEmail.toLowerCase();

                    // Danh sách các nút thao tác cho từng bình luận
                    const actions = [];

                    // 1. Nếu là đánh giá của mình -> Hiện nút Sửa
                    if (isMyFeedback) {
                        actions.push(
                            <Button
                                key="edit"
                                type="link"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleOpenEdit(item)}
                                className="text-blue-600 font-medium"
                            >
                                Sửa
                            </Button>
                        );
                    }

                    // 2. Nếu là Admin -> Hiện nút Xóa
                    if (isAdmin) {
                        actions.push(
                            <Popconfirm
                                key="delete"
                                title="Xóa đánh giá này?"
                                description="Bạn có chắc muốn xóa đánh giá này với tư cách Quản trị viên?"
                                onConfirm={() => onDeleteFeedback(item.author)}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                            >
                                <Button key="del-btn" type="link" size="small" danger icon={<DeleteOutlined />}>
                                    Xóa (Admin)
                                </Button>
                            </Popconfirm>
                        );
                    }

                    return (
                        <List.Item
                            actions={actions}
                            className={`p-4 rounded-xl mb-3 border shadow-sm transition-all ${isMyFeedback ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-gray-100'
                                }`}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={<UserOutlined />}
                                        className={isMyFeedback ? 'bg-emerald-600' : 'bg-gray-400'}
                                    />
                                }
                                title={
                                    <div className="flex items-center gap-2">
                                        <Text strong className="text-gray-800">{item.author}</Text>
                                        {isMyFeedback && (
                                            <Tag color="green" className="text-xs">
                                                Đánh giá của bạn
                                            </Tag>
                                        )}
                                        <span className="text-gray-400 text-xs ml-auto sm:ml-2">
                                            {item.date ? new Date(item.date).toLocaleString('vi-VN') : ''}
                                        </span>
                                    </div>
                                }
                                description={
                                    <div className="mt-2 space-y-1">
                                        <Rate
                                            disabled
                                            defaultValue={Number(item.rating) || 5}
                                            className="text-xs text-amber-400"
                                        />
                                        <Paragraph className="text-gray-700 mb-0 whitespace-pre-line text-sm mt-1">
                                            {item.comment}
                                        </Paragraph>
                                    </div>
                                }
                            />
                        </List.Item>
                    );
                }}
            />

            {/* Modal Sửa đánh giá */}
            <Modal
                title="Chỉnh sửa đánh giá của bạn"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                okButtonProps={{ className: 'bg-emerald-600 hover:bg-emerald-700' }}
            >
                <Form form={form} layout="vertical" onFinish={handleEditSubmit} className="mt-4">
                    <Form.Item
                        label="Đánh giá số sao"
                        name="rating"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                    >
                        <Rate className="text-amber-400" />
                    </Form.Item>

                    <Form.Item
                        label="Nhận xét"
                        name="comment"
                        rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
                    >
                        <TextArea rows={3} placeholder="Cập nhật nhận xét của bạn..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FeedbackList;