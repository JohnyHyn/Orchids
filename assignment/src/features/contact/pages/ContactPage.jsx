import { useState } from 'react';
import { Card, Form, Input, Select, Button, Row, Col, Typography, message } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const onFinish = (values) => {
        setSubmitting(true);
        // Giả lập gửi thông tin lên hệ thống
        setTimeout(() => {
            setSubmitting(false);
            message.success('Cảm ơn bạn! Chuyên viên hoa lan sẽ liên hệ tư vấn trong vòng 24 giờ.');
            form.resetFields();
        }, 800);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-6">
            <div className="text-center">
                <Title level={2} className="!mb-2 text-gray-800">Liên Hệ & Tư Vấn Hoa Lan</Title>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Bạn muốn mua hoa lan, cần tư vấn cách chăm sóc hoặc muốn đăng ký ký gửi hoa lan lên hệ thống? Hãy để lại thông tin!
                </p>
            </div>

            <Row gutter={[32, 32]}>
                {/* Cột trái: Thông tin liên hệ trực tiếp */}
                <Col xs={24} md={10}>
                    <div className="bg-emerald-800 text-white p-8 rounded-3xl h-full flex flex-col justify-between shadow-md space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Thông Tin Vườn Lan</h3>
                            <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                                Mời bạn ghé thăm trực tiếp khu bảo tồn và vườn ươm để chiêm ngưỡng những tác phẩm hoa lan tuyệt đẹp.
                            </p>

                            <div className="space-y-4 text-emerald-100 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-700/60 rounded-lg text-white">
                                        <EnvironmentOutlined />
                                    </div>
                                    <span>Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-700/60 rounded-lg text-white">
                                        <PhoneOutlined />
                                    </div>
                                    <span>Hotline / Zalo: 091 937 5697 (Hỗ trợ 24/7)</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-700/60 rounded-lg text-white">
                                        <MailOutlined />
                                    </div>
                                    <span>nhuynh1307@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-emerald-700 pt-4 text-xs text-emerald-200">
                            🕒 Giờ mở cửa vườn: 08:00 - 18:00 (Tất cả các ngày trong tuần)
                        </div>
                    </div>
                </Col>

                {/* Cột phải: Form liên hệ tư vấn & đăng ký bán lan */}
                <Col xs={24} md={14}>
                    <Card className="rounded-3xl shadow-sm border p-4 sm:p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Gửi Yêu Cầu Cho Chúng Tôi</h3>

                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="fullname"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                    >
                                        <Input size="large" placeholder="Nguyễn Văn A" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Số điện thoại / Zalo"
                                        name="phone"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input size="large" placeholder="0912 xxx xxx" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Địa chỉ Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input size="large" placeholder="example@gmail.com" />
                            </Form.Item>

                            <Form.Item
                                label="Nhu cầu của bạn"
                                name="purpose"
                                rules={[{ required: true, message: 'Vui lòng chọn nhu cầu!' }]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Chọn nhu cầu tư vấn"
                                    options={[
                                        { value: 'buy', label: 'Cần tư vấn chọn mua hoa lan phù hợp' },
                                        { value: 'sell', label: 'Muốn đăng ký ký gửi / đăng bán hoa lan' },
                                        { value: 'care', label: 'Tư vấn kỹ thuật chăm sóc, phòng bệnh cho lan' },
                                        { value: 'other', label: 'Nhu cầu khác' },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Nội dung chi tiết"
                                name="content"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Mô tả cụ thể về loài lan bạn đang quan tâm hoặc thông tin giò lan muốn ký gửi bán..."
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined />}
                                loading={submitting}
                                size="large"
                                className="bg-emerald-600 hover:bg-emerald-700 w-full"
                            >
                                Gửi Thông Tin Tư Vấn
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ContactPage;