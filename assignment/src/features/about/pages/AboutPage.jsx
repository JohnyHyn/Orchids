import { Typography, Row, Col, Card, Statistic, Tag } from 'antd';
import { TrophyOutlined, SafetyCertificateOutlined, TeamOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AboutPage = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-12 py-6">
            {/* Banner giới thiệu */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white rounded-none p-8 md:p-12 shadow-lg text-center">
                <Tag color="gold" className="text-sm px-3 py-1 mb-4 rounded-none">
                    Về Chúng Tôi
                </Tag>
                <h1 className="text-3xl md:text-5xl font-black mb-4">Orchid Paradise</h1>
                <p className="text-emerald-100 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                    Nơi hội tụ những tinh hoa hoa lan quý hiếm của Việt Nam và thế giới. Chúng tôi kết nối cộng đồng yêu lan,
                    bảo tồn các giống lan rừng quý bản địa và lan đột biến độc đáo.
                </p>
            </div>

            {/* Số liệu ấn tượng */}
            <div className="bg-white p-8 rounded-none border shadow-sm">
                <Row gutter={[24, 24]} className="text-center">
                    <Col xs={12} sm={6}>
                        <Statistic title="Giống Lan Quý" value={150} suffix="+" valueStyle={{ color: '#059669', fontWeight: 'bold' }} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic title="Thành Viên Đam Mê" value={2500} suffix="+" valueStyle={{ color: '#059669', fontWeight: 'bold' }} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic title="Tỷ Lệ Hài Lòng" value={99.8} suffix="%" valueStyle={{ color: '#059669', fontWeight: 'bold' }} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic title="Năm Kinh Nghiệm" value={8} valueStyle={{ color: '#059669', fontWeight: 'bold' }} />
                    </Col>
                </Row>
            </div>

            {/* Giá trị cốt lõi */}
            <div>
                <div className="text-center mb-8">
                    <Title level={2} className="!mb-2">Giá Trị Cốt Lõi Của Chúng Tôi</Title>
                    <p className="text-gray-500">Cam kết chất lượng và sự tận tâm cho từng nhành hoa</p>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card className="h-full rounded-none shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-emerald-50 rounded-none text-emerald-600 text-2xl">
                                    <SafetyCertificateOutlined />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">100% Chuẩn Giống & Đột Biến Thật</h3>
                                    <p className="text-gray-600 text-sm">
                                        Mỗi cây lan đều có nguồn gốc lai tạo hoặc xuất xứ rừng rõ ràng, bảo hành chuẩn mặt hoa đến khi nở.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="h-full rounded-none shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-emerald-50 rounded-none text-emerald-600 text-2xl">
                                    <HeartOutlined />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Tư Vấn Chăm Sóc Trọn Đời</h3>
                                    <p className="text-gray-600 text-sm">
                                        Đội ngũ kỹ thuật viên sẵn sàng hướng dẫn cách ghép giá thể, điều chỉnh ánh sáng và phòng trừ nấm bệnh.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="h-full rounded-none shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-emerald-50 rounded-none text-emerald-600 text-2xl">
                                    <TeamOutlined />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Sàn Giao Lưu Ký Gửi Minh Bạch</h3>
                                    <p className="text-gray-600 text-sm">
                                        Tạo sân chơi cho các nghệ nhân và nhà vườn ký gửi, đăng bán hoa lan an toàn với hệ thống đánh giá thật từ người mua.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card className="h-full rounded-none shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-emerald-50 rounded-none text-emerald-600 text-2xl">
                                    <TrophyOutlined />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Vườn Lan Đạt Tiêu Chuẩn</h3>
                                    <p className="text-gray-600 text-sm">
                                        Hệ thống nhà màng kiểm soát vi khí hậu hiện đại, đảm bảo cây con phát triển khỏe mạnh trước khi xuất vườn.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AboutPage;