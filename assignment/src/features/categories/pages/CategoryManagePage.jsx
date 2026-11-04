import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import categoryService from '../services/categoryService';

const { Title } = Typography;
const { TextArea } = Input;

const CategoryManagePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // 1. Lấy danh sách Categories (GET)
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data || []);
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi tải danh sách danh mục!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Mở modal Thêm mới
    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Mở modal Sửa
    const handleEdit = (record) => {
        setEditingCategory(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
        });
        setIsModalOpen(true);
    };

    // Xóa danh mục (DELETE)
    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id);
            message.success('Xóa danh mục thành công!');
            fetchCategories();
        } catch (err) {
            console.error(err);
            message.error('Xóa danh mục thất bại!');
        }
    };

    // Submit form (POST hoặc PUT)
    const handleFormSubmit = async (values) => {
        try {
            if (editingCategory) {
                // Cập nhật (PUT)
                await categoryService.update(editingCategory.id, values);
                message.success('Cập nhật danh mục thành công!');
            } else {
                // Thêm mới (POST)
                await categoryService.create(values);
                message.success('Thêm danh mục mới thành công!');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            console.error(err);
            message.error('Lưu danh mục thất bại!');
        }
    };

    // Cấu hình các cột của bảng Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-semibold text-emerald-700">{text}</span>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-blue-600" />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Xóa danh mục"
                        description="Bạn có chắc chắn muốn xóa danh mục này?"
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
                    <Title level={2} className="!mb-1">Quản lý Danh mục</Title>
                    <p className="text-gray-500 text-sm">Xem, thêm, sửa, xóa các loài danh mục hoa lan</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleAdd}
                >
                    Thêm Danh Mục
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                className="bg-white rounded-none shadow-sm border overflow-hidden"
            />

            {/* Modal Thêm / Sửa Danh mục */}
            <Modal
                title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu"
                cancelText="Hủy"
                okButtonProps={{ className: 'bg-emerald-600 hover:bg-emerald-700' }}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Ví dụ: Dendrobium, Cattleya..." />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <TextArea rows={3} placeholder="Mô tả đặc điểm của dòng lan này..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagePage;