import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState } from "react";
import { getUsers, getRoles, updateUser } from "../../../api/userApi";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const User = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const [users, setUser] = useState([]);
    const [roles, setRoles] = useState([]);

    console.log("users", users);

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


    return (
        <div className='bg-[#FFFFFF] p-4 rounded-lg shadow-md'>
            {/* Tiêu đề */}
            <div className='flex flex-row justify-between items-center mb-4'>
                <h1 className='text-[32px] font-bold '>User List</h1>
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