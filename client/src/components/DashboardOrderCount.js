import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Box, MenuItem, FormControl, Select, InputLabel, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { getOrderCountByPeriod } from '../api/dashboardApi';

const DashboardOrderCount = () => {
    const { user } = useSelector(state => ({ ...state }));
    const accessToken = user?.token || '';

    const periodOptions = [
        { label: 'Ngày (7 ngày gần nhất)', value: 'day' },
        { label: 'Tuần (6 tuần gần nhất)', value: 'week' },
        { label: 'Tháng (6 tháng gần nhất)', value: 'month' },
    ];

    const [period, setPeriod] = useState('day');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errorDate, setErrorDate] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatDateForApi = (date) => {
        if (!date) return null;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const fetchOrderCount = async (periodValue, start, end) => {
        if (!periodValue) {
            toast.error('Vui lòng chọn khoảng thời gian');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await getOrderCountByPeriod({
                period: periodValue,
                startDate: formatDateForApi(start),
                endDate: formatDateForApi(end),
                accessToken,
            });

            if (res.success) {
                setData(res.data);
            } else {
                setError(res.message || 'Lỗi không xác định');
                toast.error(res.message || 'Lỗi không xác định');
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

    // Kiểm soát chọn ngày bắt đầu
    const handleStartDateChange = (date) => {
        setErrorDate(null);
        setStartDate(date);
        if (endDate && date && endDate < date) {
            // Nếu endDate trước startDate thì reset endDate
            setEndDate(null);
            toast.info('Ngày kết thúc đã bị đặt lại do trước ngày bắt đầu');
        }
    };

    // Kiểm soát chọn ngày kết thúc
    const handleEndDateChange = (date) => {
        setErrorDate(null);
        if (startDate && date && date < startDate) {
            setErrorDate('Ngày kết thúc không thể trước ngày bắt đầu');
            toast.error('Ngày kết thúc không thể trước ngày bắt đầu');
            return;
        }
        setEndDate(date);
    };

    useEffect(() => {
        fetchOrderCount(period, startDate, endDate);
    }, [period, startDate, endDate]);

    const formatNumber = (num) => num.toLocaleString();

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <h2 style={{ marginBottom: 24 }}>Thống kê số lượng đơn hàng</h2>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel id="period-select-label">Khoảng thời gian</InputLabel>
                    <Select
                        labelId="period-select-label"
                        value={period}
                        label="Khoảng thời gian"
                        onChange={e => setPeriod(e.target.value)}
                    >
                        {periodOptions.map(({ label, value }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Ngày bắt đầu (tuỳ chọn)"
                        value={startDate}
                        onChange={handleStartDateChange}
                        maxDate={new Date()}
                        renderInput={(params) => <TextField {...params} sx={{ minWidth: 180 }} />}
                        clearable
                    />
                    <DatePicker
                        label="Ngày kết thúc (tuỳ chọn)"
                        value={endDate}
                        onChange={handleEndDateChange}
                        minDate={startDate || undefined}
                        maxDate={new Date()}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{ minWidth: 180 }}
                                error={Boolean(errorDate)}
                                helperText={errorDate || ''}
                            />
                        )}
                        clearable
                    />
                </LocalizationProvider>
            </Box>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : error ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
            ) : data.length === 0 ? (
                <p>Chưa có dữ liệu để hiển thị</p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={formatNumber} width={80} />
                        <Tooltip formatter={formatNumber} />
                        <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
};

export default DashboardOrderCount;