import { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, message } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import { RoleBadge } from '../../../components/common/Navbar';

const ProfilePage = () => {
    const { user, isAdmin, updateProfile } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, form]);

    const onFinish = (values) => {
        try {
            setLoading(true);
            // Gọi hàm updateProfile từ AuthContext
            updateProfile({ name: values.name });
            message.success('Cập nhật thông tin thành công!');
        } catch (err) {
            console.error(err);
            message.error('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-gold-400/20 bg-ink-900 shadow-2xl shadow-black/50">
            {/* Header thông tin cá nhân */}
            <div className="relative flex flex-col items-center gap-5 overflow-hidden border-b border-gold-400/15 bg-linear-to-br from-ink-900 via-ink-950 to-gold-950 p-6 sm:flex-row">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.1]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)', backgroundSize: '24px 24px' }}
                />
                <Avatar
                    size={88}
                    src={user?.avatar}
                    icon={!user?.avatar && <UserOutlined />}
                    className="relative shrink-0 ring-2 ring-gold-400/60 ring-offset-4 ring-offset-ink-950"
                    style={{ backgroundColor: '#2e240c', color: '#d4af37' }}
                />
                <div className="relative text-center sm:text-left">
                    <h1 className="text-gold font-display text-2xl font-bold">{user?.name}</h1>
                    <p className="mb-2 text-sm text-stone-400">{user?.email}</p>
                    <RoleBadge isAdmin={isAdmin} />
                </div>
            </div>

            {/* Form chỉnh sửa thông tin */}
            <div className="p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Thông tin tài khoản</p>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                        <Form.Item label="Địa chỉ Email" name="email">
                            <Input prefix={<MailOutlined />} disabled />
                        </Form.Item>

                        <Form.Item
                            label="Họ và tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input prefix={<UserOutlined className="text-gold-400" />} />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end border-t border-white/8 pt-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ProfilePage;
