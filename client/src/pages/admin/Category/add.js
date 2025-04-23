import React, { useState } from 'react';
import Input from '../../../components/form/input/InputField';
import Label from '../../../components/form/Label';
import categoryApi from '../../../api/categoryApi';
import Button from '../../../components/ui/button/Button';
import { useNavigate } from 'react-router';
const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await categoryApi.createCategory(categoryName, description);
            setCategoryName('');
            setDescription('');
            navigate('/categories');
        } catch (err){
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
                                <Label>Category Name <span className="text-red">*</span></Label>
                                <Input 
                                type="text"
                                name="category_name"
                                id="category_name"
                                placeholder="Category Name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e?.target?.value)}
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
                                <Button type="submit" onClick={handleSubmit} className="w-full">Add Category</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;