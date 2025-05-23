import React from "react";
import DashboardRevenue from "../../../components/DashboardRevenue";
import DashboardOrderCount from "../../../components/DashboardOrderCount";

const Dashboard = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <DashboardRevenue />
            <DashboardOrderCount />
        </div>
    )
}

export default Dashboard;