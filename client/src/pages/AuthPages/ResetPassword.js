import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { resetPassword } from '../../api/auth'; // api auth
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from "./AuthPageLayout";

const { Title, Text } = Typography;

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy resetToken truyền qua state từ ForgotPasswordPage
    const resetToken = location.state?.resetToken || '';

    useEffect(() => {
        if (!resetToken) {
            toast.error('Không có token đổi mật khẩu. Vui lòng làm lại bước quên mật khẩu.');
            navigate('/forgot-password');
        }
    }, [resetToken, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await resetPassword({
                password: values.password,
                confirm_password: values.confirm_password,
                resetToken,
            });
            toast.success('Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.');
            navigate('/signin');
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
                    <Title level={3} className="text-center mb-6">Đặt lại mật khẩu</Title>
                    <Text className="mb-4 block text-center text-gray-600">
                        Vui lòng nhập mật khẩu mới của bạn
                    </Text>

                    <Form
                        name="reset_password"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="password"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu mới"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            label="Xác nhận mật khẩu"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Xác nhận mật khẩu"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} size="large">
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </AuthLayout>

    );
};

export default ResetPassword;
