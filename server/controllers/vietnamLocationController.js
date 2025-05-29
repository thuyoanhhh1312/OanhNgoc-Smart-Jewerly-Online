import axios from 'axios';

const API_BASE_URL = 'https://provinces.open-api.vn/api';

/**
 * Lấy danh sách tỉnh/thành phố
 */
export async function getProvinces(req, res) {
  try {
    const response = await axios.get(`${API_BASE_URL}/p/`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching provinces:', error.message);
    return res.status(500).json({ error: 'Lấy danh sách tỉnh/thành thất bại' });
  }
}

/**
 * Lấy danh sách quận/huyện theo tỉnh/thành
 */
export async function getDistrictsByProvince(req, res) {
  const { provinceCode } = req.params;

  if (!provinceCode) {
    return res.status(400).json({ error: 'Thiếu mã tỉnh/thành' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
    const districts = response.data.districts || [];
    return res.json(districts);
  } catch (error) {
    console.error(`Error fetching districts for province ${provinceCode}:`, error.message);
    return res.status(500).json({ error: 'Lấy danh sách quận/huyện thất bại' });
  }
}

/**
 * Lấy danh sách phường/xã theo quận/huyện
 */
export async function getWardsByDistrict(req, res) {
  const { districtCode } = req.params;

  if (!districtCode) {
    return res.status(400).json({ error: 'Thiếu mã quận/huyện' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/d/${districtCode}?depth=2`);
    const wards = response.data.wards || [];
    return res.json(wards);
  } catch (error) {
    console.error(`Error fetching wards for district ${districtCode}:`, error.message);
    return res.status(500).json({ error: 'Lấy danh sách phường/xã thất bại' });
  }
}
