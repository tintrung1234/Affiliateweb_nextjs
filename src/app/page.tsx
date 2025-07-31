import SlideShow from '../../components/SlideShow';
import Image from 'next/image';
import SearchBox from '../../components/SearchBox';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'
import ToggleFavorite from '../../components/toggleFavoriteProduct';
import ScrollProduct from '../../components/ScrollProduct';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number | string;
    views: number;
    rating: number;
    imageUrl: string;
}

interface Category {
    _id: string;
    title: string;
}

interface User {
    _id: string;
    username: string;
    favoritesProduct: string[];
}

export default async function Home() {
    const DOMAIN = process.env.NEXT_PUBLIC_HOSTDOMAIN

    const token = Cookies.get('token');
    const rawUser = Cookies.get('user');

    let user: User | null = null;
    try {
        user = rawUser ? JSON.parse(decodeURIComponent(rawUser)) : null;
    } catch (err) {
        user = null;
    }

    let categories: Category[] = [];
    try {
        const response = await fetch(`${DOMAIN}/api/categories`);
        categories = await response.json();
    } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
    }

    const productsByCategory: Record<string, Product[]> = {};
    for (const category of categories) {
        try {
            const res = await fetch(`${DOMAIN}/api/products/category/${encodeURIComponent(category.title)}`);
            const result = await res.json();

            productsByCategory[category.title] = Array.isArray(result) ? result : [];
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    }

    console.log(productsByCategory)

    let top2Products: Product[] = [];
    try {
        const response = await fetch(`${DOMAIN}/api/products/top2product`);
        top2Products = await response.json();
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm top:', error);
    }

    return (
        <div className='w-full px-6'>
            <SlideShow />
            <div className='relative h-[6vh] px-5 w-full mt-3 flex items-center justify-end'>
                <SearchBox type='product' />
            </div>
            <div className='px-5'>
                {/* Slogan */}
                <div className='flex text-3xl sm:text-4xl lg:text-5xl font-bold text-black items-center mt-5'>
                    <h1 className='mr-4 text-red-500'>Best</h1>
                    <h1>Deals,</h1>
                </div>
                <div className='flex text-3xl sm:text-4xl lg:text-5xl font-bold text-black items-center'>
                    <h1 className='mr-4 text-gray-400'>Zero</h1>
                    <h1>Stress</h1>
                </div>
                <p className='text-black font-bold mt-2 tracking-wide'>Bạn chỉ cần mua sắm – việc tìm deal đã có chúng tôi lo</p>
                <hr className="h-px my-3 w-[40vw] bg-gray-200 border-0 dark:bg-gray-700 mb-12"></hr>
            </div>

            <div className='max-w-[90vw] mx-auto mb-10'>

                {/* product by category session */}
                <ScrollProduct categories={categories} productsByCategory={productsByCategory} />

                {/* Top discount weekly */}
                <div className='mt-15 px-5 flex items-center'
                    data-aos="fade-right"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out">
                    <Image src="/assets/img/ic_cart.png" width={42} height={44} className='mr-3' alt="Cart" />

                    <h1 className='font-bold text-black text-[30px]'>TOP GIẢM GIÁ HÀNG TUẦN</h1>
                </div>

                <div className='flex px-5 mb-10 mt-3  justify-between gap-2' data-aos="fade-up">
                    {/* product */}
                    {top2Products.map(Products => {
                        return (
                            <div
                                key={Products._id}
                                className='relative border border-black outline w-full sm:w-[calc(97vw/2-2rem)] justify-between rounded-[25px] cursor-pointer'>
                                <div className='relative w-full h-[40vh]'>
                                    <Image
                                        src={Products.imageUrl}
                                        fill
                                        className="object-cover rounded-tl-[25px] rounded-tr-[25px]"
                                        alt={Products.title}
                                    />
                                </div>
                                <div className='flex sm:flex-row flex-col justify-between px-4 items-center mt-3 mb-2'>
                                    <div className='flex'>
                                        <h2 className='text-gray-400 font-bold text-sm sm:text-base mr-2'>Views:</h2>
                                        <h2 className='text-gray-400 font-bold text-sm sm:text-base'>{Products.views || 1246}</h2>
                                    </div>
                                    <div className='flex items-center'>
                                        <Image src="assets/img/ic_star.png" alt='start icon' width={42} height={44} className='object-cover sm:w-8 sm:h-8' />
                                        <h2 className='text-black font-bold text-base sm:text-lg'>{Products.rating || 5}</h2>
                                    </div>
                                </div>
                                <div className='px-4'>
                                    <ToggleFavorite
                                        productId={Products._id}
                                        productTitle={Products.title} />
                                </div>
                                <div className="font-bold flex sm:flex-row flex-col text-sm sm:text-base mt-1 px-4 mb-3">
                                    <p className="mr-2 text-black">Giá tiền:</p>
                                    <p className="text-red-500">{Number(Products.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}
