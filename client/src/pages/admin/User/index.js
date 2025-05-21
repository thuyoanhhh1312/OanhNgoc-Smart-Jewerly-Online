import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState, useRef } from "react";
import { getUsers, getRoles, updateUser } from "../../../api/userApi";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const User = () => {
    const { user } = useSelector((state) => ({ ...state }));
    //const user = useSelector((state) => state.userReducer); // Lấy user từ redux
    const [users, setUser] = useState([]);
    const [keyword, setKeyword] = useState("");

    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    // Ref để giữ timeout debounce
    const debounceTimeout = useRef(null);
    const token = JSON.parse(localStorage.getItem("user"))?.token;


    const roleBodyTemplate = (rowData) => {
        const role = rowData?.Role ? rowData?.Role : null;

        return (
            <>
                {
                    role ? (<div>{role?.name}</div>) : (<p></p>)
                }
            </>
        )
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUser(data);
        };
        const fetchRoles = async () => {
            const roleData = await getRoles();
            setRoles(roleData);
        };

        fetchRoles();
        fetchUsers();
    }, []);
    const fetchUsers = async (searchKeyword = "") => {
        try {
            const data = await getUsers(searchKeyword);
            setUser(data);
        } catch (error) {
            alert("Lấy danh sách người dùng lỗi");
        }
    };

    // Hàm gọi khi input thay đổi
    const handleKeywordChange = (e) => {
        const value = e.target.value;
        setKeyword(value);

        // Clear timeout nếu người dùng gõ tiếp
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Đặt timeout gọi API sau 500ms kể từ lần gõ cuối
        debounceTimeout.current = setTimeout(() => {
            fetchUsers(value);
        }, 500);
    };

    const handleAddUserClick = () => {
        if (user?.role_id !== 1) {
            alert("Bạn không có quyền truy cập chức năng của admin");
            return;
        }
        navigate("/admin/user/add");
    };
    return (
        <div className='bg-[#FFFFFF] p-4 rounded-lg shadow-md'>
            {/* Tiêu đề */}
            <div className='flex flex-row justify-between items-center mb-4'>
                <h1 className='text-[32px] font-bold '>User List</h1>
                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddUserClick}
                    >
                        Add New User
                    </button>
                </div>
            </div>
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    className="border border-gray-300 rounded p-2 flex-1"
                    value={keyword}
                    onChange={handleKeywordChange}
                />
            </div>

            <DataTable value={users} paginator rows={10} showGridlines paginatorTemplate="PrevPageLink PageLinks NextPageLink">
                <Column field="name" header="Tên" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field="email" header="Email" sortable headerClassName='bg-[#d2d4d6]'></Column>
                <Column field='Role' header="Role" sortable headerClassName='bg-[#d2d4d6]' body={roleBodyTemplate}></Column>
                <Column
                    body={(rowData) => (
                        <div className="flex flex-row gap-2">
                            <Link to={`/admin/user/edit/${rowData.id}`}>
                                <button className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
                            </Link>

                        </div>
                    )}
                    header="Actions"
                    headerClassName="bg-[#d2d4d6]"
                ></Column>
            </DataTable>
        </div>
    );
};

export default User;