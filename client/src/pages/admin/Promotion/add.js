import React, { useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import promotionApi from "../../../api/promotionApi";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const AddPromotion = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const [promotionCode, setPromotionCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await promotionApi.createPromotion(promotionCode, discount, startDate, endDate, description, user.token);
            setPromotionCode('');
            setDiscount('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            navigate('/promotions');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <form onSubmit={handleSubmit} method="POST">
                        <div className="space-y-6">
                            <div>
                                <Label>Promotion Code <span className="text-red">*</span></Label>
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
                                <Label>Discount<span className="text-red">*</span></Label>
                                <Input
                                    type="number"
                                    name="discount"
                                    id="discount"
                                    placeholder="Discount Percent"
                                    value={discount}
                                    onChange={(e) => setDiscount(e?.target?.value)}
                                />
                            </div>
                            <div>
                                <Label>Start Date <span className="text-red">*</span></Label>
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
                                <Label>End Date <span className="text-red">*</span></Label>
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
                                <Label>Description <span className="text-red">*</span></Label>
                                <Input
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e?.target?.value)}
                                />
                            </div>
                            <div>
                                <Button type="submit" onClick={handleSubmit} className="w-full">Add Promotion</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPromotion;