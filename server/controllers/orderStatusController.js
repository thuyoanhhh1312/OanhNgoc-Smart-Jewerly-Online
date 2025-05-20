import db from "../models/index.js";

export const getAllOrderStatuses = async (req, res) => {
  try {
    const orderStatuses = await db.OrderStatus.findAll({
      attributes: ["status_id", "status_code", "status_name", "description", "display_order", "color_code"],
      order: [["display_order", "ASC"]],
    });
    res.status(200).json(orderStatuses);
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    res.status(500).json({ message: "Error fetching order statuses" });
  }
}

