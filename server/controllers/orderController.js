import db from "../models/index.js";
import { Sequelize, Op } from 'sequelize'; // Sequelize và Op được sử dụng để tương tác với cơ sở dữ liệu.
// Op: là một đối tượng chứa các toán tử so sánh được sử dụng trong các truy vấn Sequelize.
// sequelize là một ORM (Object-Relational Mapping) cho Node.js, giúp tương tác với cơ sở dữ liệu một cách dễ dàng hơn.(MySQL)

export const getAllOrders = async (req, res) => { // req: đối tượng request của Express (chứa thông tin yêu cầu từ client).
  // res: đối tượng response của Express (dùng để gửi phản hồi về client).
  // Hàm này sẽ lấy tất cả đơn hàng từ cơ sở dữ liệu và trả về dưới dạng JSON.
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
        {
          model: db.User,
          attributes: ["name"],
        },
        {
          model: db.Promotion,
          attributes: ["promotion_code"],
        },
        {
          model: db.OrderStatus,
          attributes: ["status_name", "color_code"],
        },
        {
          model: db.OrderItem,
          attributes: ["quantity", "price"],
          include: [
            {
              model: db.Product,
              attributes: ["product_name"],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.status(200).json(orders); // Trả về danh sách đơn hàng dưới dạng JSON với mã trạng thái 200 (OK).
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.Order.findByPk(id, {
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
        {
          model: db.OrderStatus,
          attributes: ["status_name", "color_code"],
        },
        {
          model: db.OrderItem,
          attributes: ["quantity", "price"],
          include: [
            {
              model: db.Product,
              attributes: ["product_name"],
            },
          ],
        },
        {
          model: db.Promotion,
          attributes: ["promotion_code"],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};

export const updatedOrder = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;
  try {
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (status_id === 4 || status_id === 5) {
      return res.status(404).json({
        message: "Không được phép chỉnh sửa đơn hàng đã giao hoặc đã hủy",
      });
    }
    order.status_id = status_id;
    await order.save();
    res.status(200).json({ message: "Cập nhật đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

export const updatedStaff = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    order.user_id = user_id;
    await order.save();
    res.status(200).json({ message: "Cập nhật đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

export const getOrderByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await db.Order.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
        {
          model: db.OrderStatus,
          attributes: ["status_name", "color_code"],
        },
        {
          model: db.OrderItem,
          attributes: ["quantity", "price"],
          include: [
            {
              model: db.Product,
              attributes: ["product_name"],
            },
          ],
        },
      ],
    });
    if (!orders) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  const { customer_id, user_id, promotion_id, sub_total, discount, total, shipping_address, payment_method } = req.body;

  try {
    const deposit = (total * 0.1).toFixed(2); // 10% đặt cọc giữ 2 số thập phân
    const order = await db.Order.create({
      customer_id,
      user_id,
      promotion_id,
      sub_total,
      discount,
      total,
      deposit,
      deposit_status: 'pending', // Trạng thái đặt cọc ban đầu là đang chờ
      shipping_address,
      payment_method,
      status_id: 1, // trạng thái mới tạo
    });
// trả về client thông tin đơn hàng vừa tạo
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
};

export const updateIsDeposit = async (req, res) => {
  const { id } = req.params;
  const { is_deposit } = req.body;
  try {
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    order.is_deposit = is_deposit;
    await order.save();
    res.status(200).json({ message: "Cập nhật trạng thái đặt cọc thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đặt cọc:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đặt cọc", error: error.message });
  }
};
// Tính toán giá đơn hàng với mã khuyến mãi
export const calculatePrice = async (req, res) => {
  try {
    const { items, promotion_code } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không được để trống." });
    }
//items là một mảng chứa các sản phẩm trong đơn hàng, mỗi sản phẩm có cấu trúc { product_id, quantity, price } do client gửi lên.
    const productIds = items.map((i) => i.product_id); // Lấy danh sách ID sản phẩm từ mảng items
    //db.product là mô hình đại diện cho bảng sản phẩm trong cơ sở dữ liệu, được định nghĩa trong models/index.js.
    //findAll là một phương thức của Sequelize để truy vấn tất cả các bản ghi trong bảng sản phẩm.
    //where: { product_id: productIds } là điều kiện để chỉ lấy các sản phẩm có ID nằm trong mảng productIds.
    const products = await db.Product.findAll({ where: { product_id: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Một số sản phẩm không tồn tại trong hệ thống." });
    }
//tính sub_total là tổng giá trị của các sản phẩm trong đơn hàng, được tính bằng cách nhân giá của từng sản phẩm với số lượng tương ứng.
    let sub_total = 0;

    for (const item of items) {
      const product = products.find((p) => p.product_id === item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm có ID ${item.product_id} không tồn tại.` });
      }
      // Kiểm tra số lượng sản phẩm trong kho
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.product_name}" không đủ số lượng trong kho (còn ${product.quantity}).`,
        });
      }
      // sub_total = giá sản phẩm * số lượng đặt.Number() được sử dụng để chuyển đổi giá trị sang kiểu số, đảm bảo tính toán chính xác.
      sub_total += Number(product.price) * item.quantity;
    }

    let discount = 0; // Khởi tạo discount là 0, sẽ được cập nhật nếu có mã khuyến mãi hợp lệ.
    let valid = false; // Biến này sẽ cho biết mã khuyến mãi có hợp lệ hay không. (true nếu hợp lệ, false nếu không hợp lệ).
    let message = "Không có mã khuyến mãi áp dụng.";
    let promoInfo = null; // Thông tin về mã khuyến mãi nếu có, sẽ được trả về cho client.(null nếu không có mã khuyến mãi hoặc mã không hợp lệ).

    if (promotion_code) {
      // Kiểm tra mã khuyến mãi trong cơ sở dữ liệu
      const promo = await db.Promotion.findOne({
        where: {
          promotion_code, // mã trùng với mã khách hàng nhập vào
          start_date: { [Op.lte]: new Date() }, // Ngày bắt đầu khuyến mãi phải nhỏ hơn hoặc bằng ngày hiện tại
          end_date: { [Op.gte]: new Date() }, // Ngày kết thúc khuyến mãi phải lớn hơn hoặc bằng ngày hiện tại
          // Op.lte: là toán tử so sánh "nhỏ hơn hoặc bằng" trong Sequelize.
          // Op.gte: là toán tử so sánh "lớn hơn hoặc bằng" trong Sequelize.
        },
      });
      if (promo) { // Nếu tìm thấy mã khuyến mãi hợp lệ
        // Giả sử promo.discount là phần trăm, ví dụ 10 tương đương giảm 10%
        discount = sub_total * (Number(promo.discount) / 100);
        valid = true; // Đặt valid là true nếu mã khuyến mãi hợp lệ
        message = `Mã khuyến mãi hợp lệ, giảm ${promo.discount}% (${discount.toLocaleString('vi-VN')} đ).`; // Thông báo cho người dùng biết mã khuyến mãi hợp lệ và số tiền giảm.
        // promoInfo chứa thông tin chi tiết về mã khuyến mãi để trả về cho client
        promoInfo = {
          promotion_code: promo.promotion_code, // Mã khuyến mãi
          description: promo.description,
          discount_percent: promo.discount, // Phần trăm giảm giá
        };
      } else {
        message = "Mã khuyến mãi không hợp lệ hoặc đã hết hạn.";
      }
    }

    let total = sub_total - discount; // Tính tổng sau khi áp dụng giảm giá
    if (total < 0) total = 0; // Đảm bảo tổng không âm

    return res.json({
      sub_total, // Tổng giá trị trước giảm giá
      discount,
      total, // Tổng giá trị sau giảm giá
      valid, // Trả về true nếu mã khuyến mãi hợp lệ, false nếu không
      message, // Thông báo cho người dùng về kết quả áp dụng mã khuyến mãi
      promotion: promoInfo, // Trả về object hoặc null
    });
  } catch (error) {
    console.error("calculatePrice error:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi tính toán giá." });
  }
};

export const checkout = async (req, res) => {
  const t = await db.sequelize.transaction(); // Tạo một transaction(giao dịchdịch) mới để đảm bảo tính toàn vẹn dữ liệu trong quá trình tạo đơn hàng.
  // Transaction giúp đảm bảo rằng tất cả các thao tác liên quan đến đơn hàng sẽ được thực hiện thành công hoặc không có thao tác nào được thực hiện nếu có lỗi xảy ra.
  let finished = false; // Biến này dùng để theo dõi xem transaction đã hoàn thành hay chưa, tránh rollback không cần thiết nếu đã commit thành công.
  try {
    const { // Lấy thông tin từ request body
      customer_id,
      user_id = null,
      promotion_code = null,
      payment_method = null,
      shipping_address = null, // Địa chỉ giao hàng
      is_deposit = false, // Biến này xác định xem đơn hàng có yêu cầu đặt cọc hay không
      items = [], // Danh sách sản phẩm trong đơn hàng, mỗi sản phẩm có cấu trúc { product_id, quantity, price }
    } = req.body; // Destructuring để lấy các trường cần thiết từ request body

    let deposit_status = req.body.deposit_status ?? "none"; // Trạng thái đặt cọc, mặc định là "none" nếu không có trong request body
// deposit_status có thể là "pending", "paid" hoặc "none" (không yêu cầu đặt cọc).
    if (!customer_id) { // Kiểm tra xem customer_id có được cung cấp hay không
      await t.rollback(); // Nếu không có customer_id, rollback transaction và trả về lỗi
      return res.status(400).json({ message: "Vui lòng cung cấp mã khách hàng." });
    }
    if (!Array.isArray(items) || items.length === 0) { // Kiểm tra xem items có phải là mảng và không rỗng hay không
      await t.rollback();
      return res.status(400).json({ message: "Danh sách sản phẩm không được để trống." });
    }

    const productIds = items.map((i) => i.product_id); // Lấy danh sách ID sản phẩm từ mảng items
    const products = await db.Product.findAll({ // Truy vấn tất cả sản phẩm có ID nằm trong mảng productIds
      where: { product_id: productIds },
      transaction: t, // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu 
      // t là biến đại diện cho một giao dịch (transaction) Sequelize đã tạo trước đóđó
      lock: t.LOCK.UPDATE, // Khóa các bản ghi sản phẩm để tránh xung đột khi cập nhật tồn kho
    });

    if (products.length !== productIds.length) { // Kiểm tra xem có đủ sản phẩm trong cơ sở dữ liệu không
      await t.rollback();
      return res.status(400).json({ message: "Một số sản phẩm không tồn tại trong hệ thống." });
    }

    let sub_total = 0; // Khởi tạo sub_total là 0, sẽ được tính toán dựa trên giá và số lượng của các sản phẩm trong đơn hàng
    // Duyệt qua từng sản phẩm trong đơn hàng để tính toán sub_total và kiểm tra tồn kho
    for (const item of items) {
      const product = products.find((p) => p.product_id === item.product_id);
      if (!product) {
        await t.rollback();
        return res.status(400).json({ message: `Sản phẩm có ID ${item.product_id} không tồn tại.` });
      }
      if (product.quantity < item.quantity) { 
        await t.rollback();
        return res.status(400).json({
          message: `Sản phẩm "${product.product_name}" không đủ số lượng trong kho (còn ${product.quantity}).`,
        });
      }
      if (Number(product.price) !== Number(item.price)) { 
        await t.rollback();
        return res.status(400).json({
          message: `Giá sản phẩm "${product.product_name}" không khớp với giá hiện tại.`,
        });
      }
      sub_total += Number(item.price) * item.quantity; // Tính toán sub_total bằng cách nhân giá sản phẩm với số lượng đặt
    }

    // Xử lý khuyến mãi (theo phần trăm)
    let discount = 0;
    let promotion_id = null;
    if (promotion_code) {
      const promo = await db.Promotion.findOne({
        where: {
          promotion_code,
          start_date: { [db.Sequelize.Op.lte]: new Date() },
          end_date: { [db.Sequelize.Op.gte]: new Date() },
        },
        transaction: t,
      });
      if (!promo) {
        await t.rollback();
        return res.status(400).json({ message: "Mã khuyến mãi không hợp lệ hoặc đã hết hạn." });
      }
      // Giả sử promo.discount là phần trăm, ví dụ 10 tương đương giảm 10%
      discount = +(sub_total * (Number(promo.discount) / 100)).toFixed(2);
      promotion_id = promo.promotion_id;
    }

    let total = sub_total - discount;
    if (total < 0) total = 0;

    let deposit = 0;
    if (is_deposit) {
      deposit = Number((total * 0.1).toFixed(2)); // 10% đặt cọc
      if (!["pending", "paid", "none"].includes(deposit_status)) {
        await t.rollback();
        return res.status(400).json({ message: "Trạng thái đặt cọc không hợp lệ." });
      }
    } else {
      deposit_status = "none";
    }

    // Tạo đơn hàng
    const order = await db.Order.create(
      {
        customer_id,
        user_id,
        promotion_id,
        status_id: 1, // trạng thái mới
        sub_total,
        discount,
        total,
        deposit,
        is_deposit,
        deposit_status,
        shipping_address,
        payment_method,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    // Tạo chi tiết đơn hàng
    const orderItemsData = items.map((item) => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total_price: item.quantity * item.price,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await db.OrderItem.bulkCreate(orderItemsData, { transaction: t });

    // Cập nhật tồn kho, sold_quantity
    for (const item of items) {
      await db.Product.update(
        {
          quantity: db.Sequelize.literal(`quantity - ${item.quantity}`),
          sold_quantity: db.Sequelize.literal(`sold_quantity + ${item.quantity}`),
        },
        {
          where: { product_id: item.product_id },
          transaction: t,
        }
      );
    }

    await t.commit();
    finished = true;

    // Lấy lại đơn hàng với các thông tin liên quan để trả về
    const createdOrder = await db.Order.findOne({
      where: { order_id: order.order_id },
      include: [
        { model: db.OrderItem },
        { model: db.Customer, attributes: ["name", "email", "phone"] },
        { model: db.User, attributes: ["name"] },
        { model: db.Promotion },
        { model: db.OrderStatus },
      ],
    });

    return res.status(201).json({ message: "Tạo đơn hàng thành công.", order: createdOrder });
  } catch (error) {
    if (!finished) {
      await t.rollback();
    }
    console.error("checkout error:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng." });
  }
};
