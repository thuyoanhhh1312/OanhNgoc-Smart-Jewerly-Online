import React, { useEffect, useState } from 'react';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import Button from '../../../components/ui/button/Button';
import promotionApi from '../../../api/promotionApi';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const EditPromotion = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { id } = useParams();
  const [promotionCode, setPromotionCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await promotionApi.updatePromotion(
        id,
        promotionCode,
        discount,
        startDate,
        endDate,
        description,
        user.token,
      );

      await Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        text: 'Mã giảm giá đã được cập nhật.',
        confirmButtonText: 'OK',
      });

      navigate('/admin/promotions');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const data = await promotionApi.getPromotionById(id);
        setPromotionCode(data.promotion_code);
        setDiscount(data.discount);
        setStartDate(data.start_date.split('T')[0]);
        setEndDate(data.end_date.split('T')[0]);
        setDescription(data.description);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPromotion();
  }, [id]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <form onSubmit={handleSubmit} method="POST">
            <div className="space-y-6">
              <div>
                <Label>
                  Promotion Code <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="promotion_code"
                  id="promotion_code"
                  placeholder="Promotion Code"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  Discount<span className="text-red">*</span>
                </Label>
                <Input
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="Discount"
                  value={discount}
                  onChange={(e) => setDiscount(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  Start Date <span className="text-red">*</span>
                </Label>
                <Input
                  type="date"
                  name="start_date"
                  id="start_date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  End Date <span className="text-red">*</span>
                </Label>
                <Input
                  type="date"
                  name="end_date"
                  id="end_date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  Description <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e?.target?.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
                  Update Promotion
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPromotion;
