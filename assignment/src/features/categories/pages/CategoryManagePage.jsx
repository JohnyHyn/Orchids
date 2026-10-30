import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined, SearchOutlined } from '@ant-design/icons';
import categoryService from '../services/categoryService';

const { TextArea } = Input;

const CategoryManagePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [keyword, setKeyword] = useState('');
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

    // Lọc nhanh trên bảng theo tên / mô tả
    const tableData = categories.filter((item) =>
        [item.name, item.description]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(keyword.toLowerCase()))
    );

    // Cấu hình các cột của bảng Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id) => <span className="font-mono text-xs text-stone-500">#{id}</span>,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            render: (text) => (
                <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-gold-300 to-gold-600 text-ink-950 shadow-sm">
                        <TagsOutlined />
                    </span>
                    <span className="font-semibold text-gold-400">{text}</span>
                </span>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <span className="text-stone-400">{text || <em className="text-stone-600">Chưa có mô tả</em>}</span>,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            className="text-gold-400!"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa danh mục"
                        description="Bạn có chắc chắn muốn xóa danh mục này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button shape="circle" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Quản trị</p>
                    <h1 className="font-display text-2xl font-bold text-stone-100">Quản lý Danh mục</h1>
                    <p className="mt-1 text-sm text-stone-400">Xem, thêm, sửa, xóa các loài danh mục hoa lan</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
                    Thêm Danh Mục
                </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/8 bg-ink-900 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-white/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-semibold text-stone-200">
                        Danh sách danh mục{' '}
                        <span className="ml-1 rounded-full bg-gold-400/10 px-2 py-0.5 text-xs font-medium text-gold-400">
                            {categories.length}
                        </span>
                    </h2>
                    <Input
                        placeholder="Tìm theo tên hoặc mô tả..."
                        prefix={<SearchOutlined className="text-stone-500" />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        allowClear
                        variant="filled"
                        className="sm:max-w-xs"
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 640 }}
                    pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} danh mục`, className: 'px-4' }}
                />
            </div>

            {/* Modal Thêm / Sửa Danh mục */}
            <Modal
                title={
                    <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold-400/10 text-gold-400">
                            {editingCategory ? <EditOutlined /> : <PlusOutlined />}
                        </span>
                        {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}
                    </span>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu"
                cancelText="Hủy"
                forceRender
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-5!">
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input prefix={<TagsOutlined className="text-stone-500" />} placeholder="Ví dụ: Dendrobium, Cattleya..." />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <TextArea rows={4} placeholder="Mô tả đặc điểm của dòng lan này..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagePage;
