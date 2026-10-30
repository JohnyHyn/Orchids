import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Tag, message } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';

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
        <div className="max-w-2xl mx-auto py-8">
            <Card className="rounded-2xl shadow-sm border p-4">
                {/* Header thông tin cá nhân */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b mb-6">
                    <Avatar
                        size={96}
                        src={user?.avatar}
                        icon={!user?.avatar && <UserOutlined />}
                        className="bg-emerald-600 shadow"
                    />
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                        <Tag color={isAdmin ? 'red' : 'blue'}>
                            {isAdmin ? 'Quản trị viên (Admin)' : 'Thành viên (Member)'}
                        </Tag>
                    </div>
                </div>

                {/* Form chỉnh sửa thông tin */}
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Địa chỉ Email" name="email">
                        <Input prefix={<MailOutlined />} disabled className="bg-gray-50 text-gray-500" />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input prefix={<UserOutlined />} size="large" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loading}
                        size="large"
                        className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                    >
                        Lưu thay đổi
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ProfilePage;