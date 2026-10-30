import { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, SendOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const contactInfo = [
    { icon: <EnvironmentOutlined />, text: 'Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh' },
    { icon: <PhoneOutlined />, text: 'Hotline / Zalo: 091 937 5697 (Hỗ trợ 24/7)' },
    { icon: <MailOutlined />, text: 'nhuynh1307@gmail.com' },
];

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
        <div className="space-y-6">
            <div className="text-center">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Liên hệ</p>
                <h1 className="font-display text-3xl font-bold text-stone-50">Liên Hệ & Tư Vấn Hoa Lan</h1>
                <p className="mx-auto mt-1 max-w-xl text-sm text-stone-400">
                    Bạn muốn mua hoa lan, cần tư vấn cách chăm sóc hoặc muốn đăng ký ký gửi hoa lan lên hệ thống? Hãy để lại thông tin!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[5fr_7fr]">
                {/* Cột trái: Thông tin liên hệ trực tiếp */}
                <div className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-gold-400/20 bg-linear-to-br from-ink-900 via-ink-950 to-gold-950 p-6 shadow-2xl shadow-black/50">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.1]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)', backgroundSize: '24px 24px' }}
                    />
                    <div className="relative">
                        <h2 className="text-gold mb-2 font-display text-2xl font-bold">Thông Tin Vườn Lan</h2>
                        <p className="mb-5 text-sm leading-relaxed text-stone-400">
                            Mời bạn ghé thăm trực tiếp khu bảo tồn và vườn ươm để chiêm ngưỡng những tác phẩm hoa lan tuyệt đẹp.
                        </p>

                        <ul className="space-y-3 text-sm text-stone-300">
                            {contactInfo.map((item) => (
                                <li key={item.text} className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-400">
                                        {item.icon}
                                    </span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative mt-6 flex items-center gap-2 border-t border-gold-400/20 pt-4 text-xs text-gold-200/80">
                        <ClockCircleOutlined /> Giờ mở cửa vườn: 08:00 - 18:00 (Tất cả các ngày trong tuần)
                    </div>
                </div>

                {/* Cột phải: Form liên hệ tư vấn & đăng ký bán lan */}
                <div className="rounded-lg border border-white/8 bg-ink-900 p-5 sm:p-6">
                    <h2 className="mb-4 font-display text-xl font-bold text-stone-50">Gửi Yêu Cầu Cho Chúng Tôi</h2>

                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                            <Form.Item
                                label="Họ và tên"
                                name="fullname"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại / Zalo"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="0912 xxx xxx" />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input placeholder="example@gmail.com" />
                            </Form.Item>

                            <Form.Item
                                label="Nhu cầu của bạn"
                                name="purpose"
                                rules={[{ required: true, message: 'Vui lòng chọn nhu cầu!' }]}
                            >
                                <Select
                                    placeholder="Chọn nhu cầu tư vấn"
                                    options={[
                                        { value: 'buy', label: 'Cần tư vấn chọn mua hoa lan phù hợp' },
                                        { value: 'sell', label: 'Muốn đăng ký ký gửi / đăng bán hoa lan' },
                                        { value: 'care', label: 'Tư vấn kỹ thuật chăm sóc, phòng bệnh cho lan' },
                                        { value: 'other', label: 'Nhu cầu khác' },
                                    ]}
                                />
                            </Form.Item>
                        </div>

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
                            block
                        >
                            Gửi Thông Tin Tư Vấn
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
