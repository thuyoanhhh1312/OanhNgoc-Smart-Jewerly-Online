import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Button,
} from '@mui/material';

import { getRevenueByPeriod } from '../api/dashboardApi';

const DashboardRevenue = () => {
    const currentYear = new Date().getFullYear();

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(''); // '' = tất cả tháng
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useSelector(state => ({ ...state }));
    const accessToken = user?.token || '';

    const yearOptions = [];
    for (let y = 2020; y <= currentYear + 5; y++) {
        yearOptions.push(y);
    }
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleFetchData = async (selectedYear = year, selectedMonth = month) => {
        if (!selectedYear) {
            toast.error('Vui lòng chọn năm');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = { year: selectedYear };
            if (selectedMonth !== '') params.month = selectedMonth;

            const response = await getRevenueByPeriod({ ...params, accessToken });

            if (response.success) {
                const formattedData = response.data.map(item => ({
                    period: item.period,
                    totalRevenue: Number(item.totalRevenue),
                }));
                setData(formattedData);
            } else {
                setError(response.message || 'Lỗi không xác định');
                toast.error(response.message || 'Lỗi không xác định');
                setData([]);
            }
        } catch (err) {
            setError(err.message || 'Lỗi khi gọi API');
            toast.error(err.message || 'Lỗi khi gọi API');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Khi component mount, gọi API mặc định
    useEffect(() => {
        handleFetchData(currentYear, '');
    }, []);

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <Typography variant="h5" gutterBottom fontWeight="bold">
                Thống kê doanh thu theo khoảng thời gian
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="year-select-label">Năm</InputLabel>
                    <Select
                        labelId="year-select-label"
                        id="year-select"
                        value={year}
                        label="Năm"
                        onChange={e => {
                            setYear(e.target.value);
                            handleFetchData(e.target.value, month);
                        }}
                    >
                        <MenuItem value="">
                            <em>Chọn năm</em>
                        </MenuItem>
                        {yearOptions.map(y => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="month-select-label">Tháng</InputLabel>
                    <Select
                        labelId="month-select-label"
                        id="month-select"
                        value={month}
                        label="Tháng"
                        onChange={e => {
                            setMonth(e.target.value);
                            handleFetchData(year, e.target.value);
                        }}
                    >
                        <MenuItem value="">
                            <em>Tất cả tháng</em>
                        </MenuItem>
                        {monthOptions.map(m => (
                            <MenuItem key={m} value={m}>
                                Tháng {m}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Typography>Đang tải dữ liệu...</Typography>
            ) : error ? (
                <Typography color="error" fontWeight="bold">{error}</Typography>
            ) : data.length === 0 ? (
                <Typography>Chưa có dữ liệu để hiển thị</Typography>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis
                            tickFormatter={value => (value >= 1000 ? `${value / 1000}k` : value)}
                            width={80}
                        />
                        <Tooltip formatter={value => formatCurrency(value)} />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
};

export default DashboardRevenue;