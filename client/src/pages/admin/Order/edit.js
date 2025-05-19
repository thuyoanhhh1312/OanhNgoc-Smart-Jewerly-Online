import React, { useEffect, useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import promotionApi from "../../../api/promotionApi";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

const EditOrder = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { id } = useParams();
  const [orderCode, setOrderCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [userName, setUserName] = useState("");
  const [statusName, setStatusName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await promotionApi.updatePromotion(
        id,
        orderCode,
        customerName,
        userName,
        statusName,
        totalAmount,
        user.token
      );
      navigate("/orders");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await promotionApi.getPromotionById(id);
        setOrderCode(data.order_code);
        setCustomerName(data.customer_name);
        setUserName(data.user_name);
        setStatusName(data.status_name);
        setTotalAmount(data.total_amount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <form onSubmit={handleSubmit} method="POST">
            <div className="space-y-6">
              <div>
                <Label>
                  Order Code <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="order_code"
                  id="order_code"
                  placeholder="Order Code"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  Customer Name <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="customer_name"
                  id="customer_name"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  User Name <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="user_name"
                  id="user_name"
                  placeholder="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  Status Name <span className="text-red">*</span>
                </Label>
                <Input
                  type="text"
                  name="status_name"
                  id="status_name"
                  placeholder="Status Name"
                  value={statusName}
                  onChange={(e) => setStatusName(e?.target?.value)}
                />
              </div>
              <div>
                <Label>
                  Total Amount <span className="text-red">*</span>
                </Label>
                <Input
                  type="number"
                  name="total_amount"
                  id="total_amount"
                  placeholder="Total Amount"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e?.target?.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Order
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
