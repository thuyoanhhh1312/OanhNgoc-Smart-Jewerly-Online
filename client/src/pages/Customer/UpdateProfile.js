import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
    Form,
    Input,
    Button,
    Radio,
    Typography,
    Divider,
    Spin,
    Space,
    Tooltip,
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

import { updateCustomerProfile, getCustomerByUserId } from "../../api/customerApi";

const { Title } = Typography;

const UpdateProfile = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        async function fetchCustomer() {
            setLoading(true);
            try {
                const userId = user?.id;
                if (!userId) throw new Error("Không có user id");

                const data = await getCustomerByUserId(userId);

                form.setFieldsValue({
                    name: data.name || "",
                    phone: data.phone || "",
                    gender: data.gender || "Nam",
                    address: data.address || "",
                });
            } catch (error) {
                toast.error("Lấy thông tin khách hàng thất bại");
            } finally {
                setLoading(false);
            }
        }

        fetchCustomer();
    }, [form, user]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                name: values.name,
                phone: values.phone,
                gender: values.gender,
                address: values.address,
            };

            await updateCustomerProfile(payload, user?.token);
            toast.success("Cập nhật thông tin cá nhân thành công");
            setEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
        } finally {
            setLoading(false);
        }
    };

    const toggleEdit = () => {
        if (editing) {
            form.resetFields();
        }
        setEditing(!editing);
    };

    return (
        <MainLayout>
            <div className="max-w-[1200px] mx-auto my-2 p-6 bg-white rounded-md shadow-md relative">
                <Title level={3} className="text-center mb-6">
                    Thông tin cá nhân
                </Title>

                {/* Nút chỉnh sửa */}
                <div className="absolute top-6 right-6 cursor-pointer" onClick={toggleEdit}>
                    <Tooltip title={editing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}>
                        {editing ? (
                            <CloseOutlined style={{ fontSize: 22, color: "#1890ff" }} />
                        ) : (
                            <EditOutlined style={{ fontSize: 22, color: "#1890ff" }} />
                        )}
                    </Tooltip>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ gender: "Nam" }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                        >
                            <Input placeholder="Nhập họ và tên" disabled={!editing} />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại" },
                                {
                                    pattern: /^[0-9]{9,11}$/,
                                    message:
                                        "Số điện thoại không hợp lệ (9-11 chữ số, chỉ nhập số)",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" maxLength={11} disabled={!editing} />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                        >
                            <Radio.Group disabled={!editing}>
                                <Radio value="Nam">Nam</Radio>
                                <Radio value="Nữ">Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Divider orientation="left">Địa chỉ</Divider>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                        >
                            <Input.TextArea
                                placeholder="Nhập địa chỉ"
                                rows={3}
                                disabled={!editing}
                                maxLength={200}
                            />
                        </Form.Item>

                        {editing && (
                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        loading={loading}
                                    >
                                        Cập nhật thông tin
                                    </Button>
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            form.resetFields();
                                            setEditing(false);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </Space>
                            </Form.Item>
                        )}
                    </Form>
                )}
            </div>
        </MainLayout>
    );
};

export default UpdateProfile;