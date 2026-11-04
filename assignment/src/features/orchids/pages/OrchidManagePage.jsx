import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Space,
    Popconfirm,
    Tag,
    Image,
    message,
    Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarFilled } from '@ant-design/icons';
import orchidService from '../services/orchidService';
import categoryService from '../../categories/services/categoryService';

const { Title } = Typography;
const { TextArea } = Input;

const OrchidManagePage = () => {
    const [orchids, setOrchids] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrchid, setEditingOrchid] = useState(null);
    const [form] = Form.useForm();

    // 1. Tải danh sách Hoa Lan & Danh Mục từ API
    const fetchData = async () => {
        try {
            setLoading(true);
            const [orchidsRes, categoriesRes] = await Promise.all([
                orchidService.getAll(),
                categoryService.getAll(),
            ]);
            setOrchids(orchidsRes || []);
            setCategories(categoriesRes || []);
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Mở modal Thêm mới
    const handleAdd = () => {
        setEditingOrchid(null);
        form.resetFields();
        form.setFieldsValue({ isSpecial: false }); // Giá trị mặc định
        setIsModalOpen(true);
    };

    // Mở modal Sửa
    const handleEdit = (record) => {
        setEditingOrchid(record);
        form.setFieldsValue({
            orchidName: record.orchidName,
            image: record.image,
            price: record.price,
            category: record.category,
            original: record.original,
            isSpecial: record.isSpecial || false,
            description: record.description,
        });
        setIsModalOpen(true);
    };

    // Xóa hoa lan (DELETE)
    const handleDelete = async (id) => {
        try {
            await orchidService.delete(id);
            message.success('Xóa hoa lan thành công!');
            fetchData();
        } catch (err) {
            console.error(err);
            message.error('Xóa hoa lan thất bại!');
        }
    };

    // Submit Form (POST hoặc PUT)
    const handleFormSubmit = async (values) => {
        try {
            if (editingOrchid) {
                // Cập nhật (PUT) - Giữ nguyên mảng feedback hiện có của cây lan
                const updatedPayload = {
                    ...values,
                    feedback: editingOrchid.feedback || [],
                };
                await orchidService.update(editingOrchid.id, updatedPayload);
                message.success('Cập nhật hoa lan thành công!');
            } else {
                // Thêm mới (POST) - Khởi tạo feedback là mảng rỗng []
                const newPayload = {
                    ...values,
                    feedback: [],
                };
                await orchidService.create(newPayload);
                message.success('Thêm mới hoa lan thành công!');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
            message.error('Lưu hoa lan thất bại!');
        }
    };

    // Cấu hình bảng hiển thị
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 80,
            render: (img, record) => (
                <Image
                    src={img || 'https://via.placeholder.com/60?text=No+Img'}
                    alt={record.orchidName}
                    width={50}
                    height={50}
                    className="rounded-none object-cover"
                    fallback="https://via.placeholder.com/60?text=Error"
                />
            ),
        },
        {
            title: 'Tên hoa lan',
            dataIndex: 'orchidName',
            key: 'orchidName',
            render: (text, record) => (
                <div>
                    <span className="font-semibold text-gray-800">{text}</span>
                    {record.isSpecial && (
                        <Tag color="red" className="ml-2 text-xs">
                            Đặc biệt
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => <Tag color="emerald">{cat}</Tag>,
        },
        {
            title: 'Giá ($)',
            dataIndex: 'price',
            key: 'price',
            render: (val) => <span className="font-bold text-emerald-600">${val?.toLocaleString()}</span>,
        },
        {
            title: 'Xuất xứ',
            dataIndex: 'original',
            key: 'original',
        },
        {
            title: 'Đánh giá',
            key: 'feedback',
            render: (_, record) => {
                const feedbacks = Array.isArray(record.feedback) ? record.feedback : [];
                const avg = feedbacks.length > 0
                    ? (feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbacks.length).toFixed(1)
                    : 0;
                return (
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                        <StarFilled /> {avg} ({feedbacks.length})
                    </span>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 140,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-blue-600" />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Xóa hoa lan"
                        description="Bạn có chắc chắn muốn xóa hoa lan này không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="!mb-1">Quản lý Hoa Lan</Title>
                    <p className="text-gray-500 text-sm">Xem, thêm mới, cập nhật giá và xóa các loại hoa lan</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleAdd}
                >
                    Thêm Hoa Lan
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={orchids}
                rowKey="id"
                loading={loading}
                className="bg-white rounded-none shadow-sm border overflow-hidden"
            />

            {/* Modal Thêm / Sửa Hoa Lan */}
            <Modal
                title={editingOrchid ? 'Chỉnh sửa Hoa Lan' : 'Thêm mới Hoa Lan'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu dữ liệu"
                cancelText="Hủy"
                width={650}
                okButtonProps={{ className: 'bg-emerald-600 hover:bg-emerald-700' }}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                            label="Tên hoa lan"
                            name="orchidName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên hoa lan!' }]}
                        >
                            <Input placeholder="" />
                        </Form.Item>

                        <Form.Item
                            label="Danh mục"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select
                                placeholder="Chọn danh mục"
                                options={categories.map((c) => ({ value: c.name, label: c.name }))}
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                            label="Giá bán ($)"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                        >
                            <InputNumber min={0} className="w-full" placeholder="" />
                        </Form.Item>

                        <Form.Item label="Xuất xứ" name="original">
                            <Input placeholder="Ví dụ: Vietnam, Thailand..." />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="URL Hình ảnh"
                        name="image"
                        rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
                    >
                        <Input placeholder="https://images.unsplash.com/..." />
                    </Form.Item>

                    <Form.Item label="Lan đặc biệt (Đột biến / Quý hiếm)" name="isSpecial" valuePropName="checked">
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>

                    <Form.Item label="Mô tả chi tiết" name="description">
                        <TextArea rows={3} placeholder="Mô tả chi tiết về cách chăm sóc, hương thơm..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrchidManagePage;