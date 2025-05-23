import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Box,
  Divider,
} from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const FilterModal = ({ visible, onHide, onApply, categories }) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dateType, setDateType] = useState('created_at');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Toggle category
  const toggleCategory = (id) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((c) => c !== id));

      // Remove subcategories belonging to removed category
      const removedCat = categories.find((c) => c.category_id === id);
      if (removedCat && removedCat.SubCategories) {
        setSelectedSubCategoryIds((prevSubs) =>
          prevSubs.filter(
            (subId) => !removedCat.SubCategories.some((sub) => sub.subcategory_id === subId),
          ),
        );
      }
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id]);
    }
  };

  // Toggle subcategory
  const toggleSubCategory = (id) => {
    if (selectedSubCategoryIds.includes(id)) {
      setSelectedSubCategoryIds(selectedSubCategoryIds.filter((c) => c !== id));
    } else {
      setSelectedSubCategoryIds([...selectedSubCategoryIds, id]);
    }
  };

  // Toggle status
  const toggleStatus = (val) => {
    if (selectedStatus === val) setSelectedStatus(null);
    else setSelectedStatus(val);
  };

  // Apply filter
  const handleApply = () => {
    onApply({
      categoryIds: selectedCategoryIds,
      subcategoryIds: selectedSubCategoryIds,
      is_active: selectedStatus,
      dateType,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    });
    onHide();
  };

  // Reset filter
  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedSubCategoryIds([]);
    setSelectedStatus(null);
    setDateType('created_at');
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Dialog open={visible} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Bộ lọc sản phẩm</DialogTitle>
      <DialogContent dividers>
        {/* Categories */}
        <Box mb={3}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            Theo Danh Mục
          </FormLabel>
          <FormGroup>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat.category_id}
                  control={
                    <Checkbox
                      checked={selectedCategoryIds.includes(cat.category_id)}
                      onChange={() => toggleCategory(cat.category_id)}
                    />
                  }
                  label={cat.category_name}
                />
              ))}
            </Stack>
          </FormGroup>
        </Box>

        <Divider />

        {/* Subcategories grouped by category */}
        <Box mt={3} mb={3}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            Danh Mục Con (Phân nhóm theo Category)
          </FormLabel>

          {selectedCategoryIds.length === 0 && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Chọn danh mục trước
            </Typography>
          )}

          {selectedCategoryIds.map((catId) => {
            const cat = categories.find((c) => c.category_id === catId);
            if (!cat) return null;

            return (
              <Box key={cat.category_id} mb={2}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  {cat.category_name}
                </Typography>
                {(!cat.SubCategories || cat.SubCategories.length === 0) && (
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Không có danh mục con
                  </Typography>
                )}
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {(cat.SubCategories || []).map((sub) => (
                    <FormControlLabel
                      key={sub.subcategory_id}
                      control={
                        <Checkbox
                          checked={selectedSubCategoryIds.includes(sub.subcategory_id)}
                          onChange={() => toggleSubCategory(sub.subcategory_id)}
                        />
                      }
                      label={sub.subcategory_name}
                    />
                  ))}
                </Stack>
              </Box>
            );
          })}
        </Box>

        <Divider />

        {/* Status */}
        <Box mt={3} mb={3}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            Trạng thái bán (is_active)
          </FormLabel>
          <FormGroup>
            <Stack direction="row" spacing={2}>
              {[
                { label: 'Tất cả', value: null },
                { label: 'Đang mở bán', value: true },
                { label: 'Đang dừng bán', value: false },
              ].map((opt) => (
                <FormControlLabel
                  key={opt.label}
                  control={
                    <Checkbox
                      checked={selectedStatus === opt.value}
                      onChange={() => toggleStatus(opt.value)}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </Stack>
          </FormGroup>
        </Box>

        <Divider />

        {/* Date Type */}
        <Box mt={3} mb={3}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            Loại ngày lọc
          </FormLabel>
          <RadioGroup row value={dateType} onChange={(e) => setDateType(e.target.value)}>
            <FormControlLabel value="created_at" control={<Radio />} label="Ngày tạo" />
            <FormControlLabel value="updated_at" control={<Radio />} label="Ngày cập nhật" />
          </RadioGroup>
        </Box>

        {/* Start Date */}
        <Box mb={3}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            Ngày bắt đầu
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={startDate ? dayjs(startDate) : null}
              onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
              maxDate={endDate ? dayjs(endDate) : undefined}
              clearable
            />
          </LocalizationProvider>
        </Box>

        {/* End Date */}
        <Box mb={1}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            Ngày kết thúc
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={endDate ? dayjs(endDate) : null}
              onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
              minDate={startDate ? dayjs(startDate) : undefined}
              clearable
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={handleReset} variant="outlined" color="primary">
          Thiết lập lại
        </Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
