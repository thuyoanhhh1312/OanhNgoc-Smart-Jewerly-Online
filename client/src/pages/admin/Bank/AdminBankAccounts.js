import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Popconfirm,
    Space,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import bankApi from '../../../api/bankApi';
import { BanksObject } from 'vietnam-qr-pay';

const { Title } = Typography;
const { Option } = Select;

const BANK_OPTIONS = [
    { label: 'VIB', value: 'vib', bank_code: BanksObject.vib?.bin || '' },
    { label: 'Techcombank', value: 'techcombank', bank_code: BanksObject.techcombank?.bin || '' },
    { label: 'MB Bank', value: 'mbbank', bank_code: BanksObject.mbbank?.bin || '' },
    { label: 'Agribank', value: 'agribank', bank_code: BanksObject.agribank?.bin || '' },
    { label: 'VietinBank', value: 'vietinbank', bank_code: BanksObject.vietinbank?.bin || '' },
    { label: 'Vietcombank', value: 'vietcombank', bank_code: BanksObject.vietcombank?.bin || '' },
    { label: 'Ví MoMo', value: 'momo', bank_code: BanksObject.banviet?.bin || '' }, // ví điện tử mặc định dùng bank Bản Việt
];

// Mặc định form values
const initialFormValues = {
    type: 'bank',
    bank_name: '',
    bank_code: '',
    account_number: '',
    account_name: '',
    is_enabled: true,
    description: '',
};

const AdminBankAccounts = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [form] = Form.useForm();

    // Load danh sách tài khoản
    const fetchAccounts = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const data = await bankApi.getBankAccounts({ all: true });
            setAccounts(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách tài khoản ngân hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [user?.token]);

    // Mở modal thêm mới
    const openAddModal = () => {
        setEditingAccount(null);
        form.resetFields();
        form.setFieldsValue(initialFormValues);
        setModalVisible(true);
    };

    // Mở modal sửa
    const openEditModal = (account) => {
        setEditingAccount(account);
        form.setFieldsValue(account);
        setModalVisible(true);
    };

    // Xử lý submit form
    const handleFormSubmit = async (values) => {
        if (!user?.token) {
            toast.error('Bạn chưa đăng nhập.');
            return;
        }
        try {
            if (editingAccount) {
                await bankApi.updateBankAccount(editingAccount.id, values, user.token);
                toast.success('Cập nhật tài khoản thành công.');
            } else {
                await bankApi.createBankAccount(values, user.token);
                toast.success('Thêm mới tài khoản thành công.');
            }
            setModalVisible(false);
            fetchAccounts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi lưu tài khoản.');
        }
    };

    // Xóa tài khoản
    const handleDelete = async (id) => {
        if (!user?.token) {
            toast.error('Bạn chưa đăng nhập.');
            return;
        }
        try {
            await bankApi.deleteBankAccount(id, user.token);
            toast.success('Xóa tài khoản thành công.');
            fetchAccounts();
        } catch (error) {
            toast.error('Lỗi khi xóa tài khoản.');
        }
    };

    // Bật/tắt trạng thái
    const handleToggleEnable = async (id, checked) => {
        if (!user?.token) {
            toast.error('Bạn chưa đăng nhập.');
            return;
        }
        try {
            await bankApi.toggleBankAccountStatus(id, checked, user.token);
            toast.success(`Tài khoản đã được ${checked ? 'bật' : 'tắt'}.`);
            fetchAccounts();
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái tài khoản.');
        }
    };

    // Khi chọn tên ngân hàng, tự động điền bank_code và loại
    const handleBankNameChange = (value) => {
        const selectedBank = BANK_OPTIONS.find(b => b.value === value);
        if (selectedBank) {
            form.setFieldsValue({
                bank_name: selectedBank.label,
                bank_code: selectedBank.bank_code,
                // Nếu ví điện tử (momo) thì loại mặc định 'momo', ngược lại 'bank'
                type: selectedBank.value === 'momo' ? 'momo' : 'bank',
            });
        } else {
            // reset nếu không tìm thấy
            form.setFieldsValue({
                bank_name: '',
                bank_code: '',
                type: 'bank',
            });
        }
    };

    // Khi đổi loại, nếu chọn momo tự set tên ngân hàng và mã
    const handleTypeChange = (value) => {
        if (value === 'momo') {
            const momoBank = BANK_OPTIONS.find(b => b.value === 'momo');
            form.setFieldsValue({
                bank_name: momoBank.label,
                bank_code: momoBank.bank_code,
            });
        } else if (value === 'bank') {
            form.setFieldsValue({
                bank_name: '',
                bank_code: '',
            });
        }
    };

    const columns = [
        {
            title: 'Tên ngân hàng',
            dataIndex: 'bank_name',
            key: 'bank_name',
            width: 180,
        },
        {
            title: 'Mã ngân hàng',
            dataIndex: 'bank_code',
            key: 'bank_code',
            width: 140,
            ellipsis: true,
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'account_number',
            key: 'account_number',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Tên chủ tài khoản',
            dataIndex: 'account_name',
            key: 'account_name',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            filters: [
                { text: 'Ngân hàng', value: 'bank' },
            ],
            onFilter: (value, record) => record.type === value,
            render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_enabled',
            key: 'is_enabled',
            width: 100,
            render: (text, record) => (
                <Switch
                    checked={record.is_enabled}
                    onChange={(checked) => handleToggleEnable(record.id, checked)}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                />
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 140,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        type="primary"
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa tài khoản này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            type="primary"
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }} className='bg-[#FFFFFF] rounded-lg shadow-md'>
            <Title level={3} style={{ marginBottom: 24 }}>
                Quản lý tài khoản ngân hàng
            </Title>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
                onClick={openAddModal}
            >
                Thêm tài khoản mới
            </Button>

            <Table
                columns={columns}
                dataSource={accounts}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
            />

            <Modal
                title={editingAccount ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialFormValues}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="type"
                        label="Loại"
                        rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                    >
                        <Select onChange={handleTypeChange}>
                            <Option value="bank">Ngân hàng</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="bank_name"
                        label="Tên ngân hàng"
                        rules={[{ required: true, message: 'Vui lòng chọn tên ngân hàng hoặc ví' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn ngân hàng"
                            optionFilterProp="children"
                            onChange={handleBankNameChange}
                            disabled={form.getFieldValue('type') === 'other'}
                        >
                            {BANK_OPTIONS.map((bank) => (
                                <Option key={bank.value} value={bank.value}>
                                    {bank.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="bank_code"
                        label="Mã ngân hàng"
                    >
                        <Input placeholder="Mã ngân hàng" disabled />
                    </Form.Item>

                    <Form.Item
                        name="account_number"
                        label="Số tài khoản"
                        rules={[{ required: true, message: 'Vui lòng nhập số tài khoản hoặc ví' }]}
                    >
                        <Input placeholder="Số tài khoản hoặc ví" />
                    </Form.Item>

                    <Form.Item
                        name="account_name"
                        label="Tên chủ tài khoản"
                    >
                        <Input placeholder="Tên chủ tài khoản" />
                    </Form.Item>

                    <Form.Item
                        name="is_enabled"
                        label="Trạng thái"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} placeholder="Mô tả thêm (nếu cần)" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminBankAccounts;