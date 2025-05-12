import React,{useState,useEffect} from 'react';
import MainLayout from '../layout/MainLayout';
import ProductApi from '../api/productApi';
import ProductCard from '../components/ui/product/productCard';
import axios from 'axios';

const Home = () => {
    console.log("Home");
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const res = await ProductApi.getProducts();
            setProducts(res);
        }catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);
    return (
        <MainLayout>
            <div className='p-2 grid grid-cols-4 gap-4'>
               {products.map((product, index) => (
                    <div key={index}> 
                        <ProductCard product={product} />
                    </div>
               ))}
            </div>
        </MainLayout>
    )
}

export default Home;