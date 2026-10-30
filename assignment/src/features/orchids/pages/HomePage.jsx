import { useState, useEffect } from 'react';
import { Input, Select, Spin, Empty, Button, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import orchidService from '../services/orchidService';
import categoryService from '../../categories/services/categoryService';
import OrchidCard from '../components/OrchidCard';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const [orchids, setOrchids] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State tìm kiếm & lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // 1. Tải dữ liệu ban đầu
    const fetchData = async () => {
        try {
            setLoading(true);
            const [orchidsRes, categoriesRes] = await Promise.all([
                orchidService.getAll(),
                categoryService.getAll(),
            ]);
            setOrchids(orchidsRes || []);
            setCategories(categoriesRes || []);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Logic tìm kiếm và lọc danh mục
    const filteredOrchids = orchids.filter((item) => {
        const matchName = item.orchidName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !selectedCategory || item.category === selectedCategory;
        return matchName && matchCategory;
    });

    // Reset bộ lọc
    const handleReset = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    return (
        <div className="space-y-8">
            {/* Hero Banner giới thiệu */}
            <div className="bg-emerald-700 text-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Bộ Sưu Tập Hoa Lan Quý</h1>
                <p className="text-emerald-100 max-w-2xl text-sm md:text-base">
                    Khám phá những giống lan quý hiếm và tuyệt đẹp. Đăng nhập để cùng cộng đồng chia sẻ cảm nhận và đánh giá.
                </p>
            </div>

            {/* Thanh công cụ Tìm kiếm & Lọc (Task 1) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row items-center gap-4">
                {/* Tìm theo tên */}
                <div className="flex-1 w-full">
                    <Input
                        placeholder="Tìm kiếm theo tên hoa lan..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        size="large"
                    />
                </div>

                {/* Lọc theo danh mục */}
                <div className="w-full md:w-64">
                    <Select
                        placeholder="Lọc theo danh mục"
                        value={selectedCategory || undefined}
                        onChange={(value) => setSelectedCategory(value || '')}
                        allowClear
                        size="large"
                        className="w-full"
                        options={[
                            { value: '', label: 'Tất cả danh mục' },
                            ...categories.map((cat) => ({
                                value: cat.name,
                                label: cat.name,
                            })),
                        ]}
                    />
                </div>

                {/* Nút đặt lại */}
                {(searchTerm || selectedCategory) && (
                    <Button icon={<ReloadOutlined />} onClick={handleReset} size="large">
                        Đặt lại
                    </Button>
                )}
            </div>

            {/* Danh sách Hoa Lan */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" tip="Đang tải danh sách hoa lan..." />
                </div>
            ) : filteredOrchids.length === 0 ? (
                <Empty description="Không tìm thấy hoa lan nào phù hợp" className="py-12" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredOrchids.map((orchid) => (
                        <OrchidCard key={orchid.id} orchid={orchid} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;