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
    Image,
    message,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    StarFilled,
    CrownFilled,
    AppstoreOutlined,
    SearchOutlined,
    EnvironmentOutlined,
    PictureOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import orchidService from '../services/orchidService';
import categoryService from '../../categories/services/categoryService';

const { TextArea } = Input;

const IMAGE_FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#18181b"/><text x="50%" y="62%" font-size="24" text-anchor="middle">🌸</text></svg>'
)}`;

const OrchidManagePage = () => {
    const [orchids, setOrchids] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrchid, setEditingOrchid] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [form] = Form.useForm();
    const previewImage = Form.useWatch('image', form);

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

    // Lọc nhanh trên bảng theo tên / danh mục / xuất xứ
    const tableData = orchids.filter((item) =>
        [item.orchidName, item.category, item.original]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(keyword.toLowerCase()))
    );

    const stats = [
        { label: 'Tổng số hoa lan', value: orchids.length, icon: <AppstoreOutlined />, tone: 'from-gold-300 to-gold-600' },
        { label: 'Lan đặc biệt', value: orchids.filter((o) => o.isSpecial).length, icon: <CrownFilled />, tone: 'from-gold-100 to-gold-400' },
        {
            label: 'Tổng lượt đánh giá',
            value: orchids.reduce((sum, o) => sum + (Array.isArray(o.feedback) ? o.feedback.length : 0), 0),
            icon: <StarFilled />,
            tone: 'from-stone-300 to-stone-500',
        },
    ];

    // Cấu hình bảng hiển thị
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 90,
            render: (img, record) => (
                <Image
                    src={img}
                    alt={record.orchidName}
                    width={44}
                    height={44}
                    className="rounded-md object-cover"
                    rootClassName="overflow-hidden rounded-md ring-1 ring-white/10"
                    fallback={IMAGE_FALLBACK}
                />
            ),
        },
        {
            title: 'Tên hoa lan',
            dataIndex: 'orchidName',
            key: 'orchidName',
            sorter: (a, b) => (a.orchidName || '').localeCompare(b.orchidName || ''),
            render: (text, record) => (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-stone-100">{text}</span>
                    {record.isSpecial && (
                        <span className="badge-gold inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-950">
                            <CrownFilled /> Đặc biệt
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            filters: categories.map((c) => ({ text: c.name, value: c.name })),
            onFilter: (value, record) => record.category === value,
            render: (cat) => (
                <span className="rounded-full bg-gold-400/10 px-2.5 py-1 text-xs font-medium text-gold-400 ring-1 ring-gold-400/20">
                    {cat}
                </span>
            ),
        },
        {
            title: 'Giá ($)',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
            render: (val) => <span className="font-bold text-gold-400">${val?.toLocaleString()}</span>,
        },
        {
            title: 'Xuất xứ',
            dataIndex: 'original',
            key: 'original',
            render: (val) => (
                <span className="flex items-center gap-1 text-stone-400">
                    <EnvironmentOutlined className="text-stone-500" /> {val || '—'}
                </span>
            ),
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/10 px-2.5 py-1 text-xs font-semibold text-gold-400">
                        <StarFilled /> {avg} <span className="font-normal text-gold-400/70">({feedbacks.length})</span>
                    </span>
                );
            },
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
                        title="Xóa hoa lan"
                        description="Bạn có chắc chắn muốn xóa hoa lan này không?"
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
                    <h1 className="font-display text-2xl font-bold text-stone-100">Quản lý Hoa Lan</h1>
                    <p className="mt-1 text-sm text-stone-400">Xem, thêm mới, cập nhật giá và xóa các loại hoa lan</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
                    Thêm Hoa Lan
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4 rounded-lg border border-gold-400/15 bg-ink-900 px-4 py-3 shadow-sm">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-br text-lg text-ink-950 shadow-md shadow-gold-500/10 ${stat.tone}`}>
                            {stat.icon}
                        </span>
                        <div>
                            <p className="text-xs text-stone-400">{stat.label}</p>
                            <p className="text-gold font-display text-2xl font-bold">{loading ? '—' : stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-white/8 bg-ink-900 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-white/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-semibold text-stone-200">Danh sách hoa lan</h2>
                    <Input
                        placeholder="Tìm theo tên, danh mục, xuất xứ..."
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
                    scroll={{ x: 900 }}
                    pagination={{ pageSize: 8, showTotal: (total) => `Tổng ${total} hoa lan`, className: 'px-4' }}
                />
            </div>

            {/* Modal Thêm / Sửa Hoa Lan */}
            <Modal
                title={
                    <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold-400/10 text-gold-400">
                            {editingOrchid ? <EditOutlined /> : <PlusOutlined />}
                        </span>
                        {editingOrchid ? 'Chỉnh sửa Hoa Lan' : 'Thêm mới Hoa Lan'}
                    </span>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu dữ liệu"
                cancelText="Hủy"
                width={760}
                forceRender
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-5!">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Thông tin cơ bản</p>
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                        <Form.Item
                            label="Tên hoa lan"
                            name="orchidName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên hoa lan!' }]}
                        >
                            <Input placeholder="Ví dụ: Hoàng Thảo Kèn..." />
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

                        <Form.Item
                            label="Giá bán ($)"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                        >
                            <InputNumber
                                min={0}
                                className="w-full!"
                                prefix={<DollarOutlined className="text-stone-500" />}
                                placeholder="Ví dụ: 120"
                            />
                        </Form.Item>

                        <Form.Item label="Xuất xứ" name="original">
                            <Input prefix={<EnvironmentOutlined className="text-stone-500" />} placeholder="Ví dụ: Vietnam, Thailand..." />
                        </Form.Item>
                    </div>

                    <p className="mb-3 mt-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Hình ảnh & mô tả</p>
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[1fr_140px]">
                        <div>
                            <Form.Item
                                label="URL Hình ảnh"
                                name="image"
                                rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
                            >
                                <Input prefix={<PictureOutlined className="text-stone-500" />} placeholder="https://images.unsplash.com/..." />
                            </Form.Item>

                            <Form.Item label="Lan đặc biệt (Đột biến / Quý hiếm)" name="isSpecial" valuePropName="checked">
                                <Switch checkedChildren="Có" unCheckedChildren="Không" />
                            </Form.Item>
                        </div>
                        <div className="mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-md border border-dashed border-white/12 bg-ink-850 sm:mt-7">
                            {previewImage ? (
                                <img src={previewImage} alt="Xem trước" className="h-full w-full object-cover" />
                            ) : (
                                <span className="px-2 text-center text-xs text-stone-500">
                                    <PictureOutlined className="mb-1 block text-2xl" /> Xem trước ảnh
                                </span>
                            )}
                        </div>
                    </div>

                    <Form.Item label="Mô tả chi tiết" name="description">
                        <TextArea rows={4} placeholder="Mô tả chi tiết về cách chăm sóc, hương thơm..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrchidManagePage;

