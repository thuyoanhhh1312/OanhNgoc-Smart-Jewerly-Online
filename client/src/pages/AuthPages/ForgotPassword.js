import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import AuthLayout from "./AuthPageLayout";


const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await forgotPassword(values.email);
            toast.success(res.data.message || 'Vui lòng kiểm tra email để tiếp tục!');
            // Lấy token resetToken từ response, truyền qua state khi chuyển trang
            navigate('/reset-password', { state: { resetToken: res.data.resetToken } });
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Có lỗi xảy ra!');
            } else {
                toast.error('Không thể kết nối tới server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-50 p-4">
                <Card
                    style={{ maxWidth: 400, width: '100%' }}
                    bordered={false}
                    className="shadow-md rounded-lg"
                >
                    <Title level={3} className="text-center mb-6">Quên mật khẩu</Title>
                    <Text className="mb-4 block text-center text-gray-600">
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                    </Text>

                    <Form
                        name="forgot_password"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="example@domain.com"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} size="large">
                                Gửi liên kết
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
