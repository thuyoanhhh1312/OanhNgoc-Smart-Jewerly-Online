import React from 'react';
import MainLayout from '../layout/MainLayout';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    return (
        <MainLayout>
            <div>
                ProductDetail
            </div>
        </MainLayout>
    )
}

export default ProductDetail;