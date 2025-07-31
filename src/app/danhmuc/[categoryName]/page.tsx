
import "./DanhMuc.css"
import { toast } from "react-toastify";
// import Breadcrumb from "../components/BreadCrumb";
import DanhMucClient from './DanhMucClient';

interface Params {
    categoryName: string;
}

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

export default async function DanhMuc({ params }: { params: Params }) {
    const DOMAIN = process.env.NEXT_PUBLIC_HOSTDOMAIN;
    const categoryName = decodeURIComponent(params.categoryName);

    let selectedCategory = ""
    let categories: Category[] = []
    try {
        const response = await fetch(`${DOMAIN}/api/categories`);
        categories = await response.json();
        // Auto-select if param matches category.title
        if (categoryName) {
            const matched = categories.find(
                (cat) => cat.title.toLowerCase() === decodeURIComponent(categoryName).toLowerCase()
            );
            if (matched) {
                selectedCategory = matched.title;
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }

    let products: Product[] = [];
    try {
        if (!selectedCategory) {
            // Nếu không chọn danh mục, tải tất cả sản phẩm
            const response = await fetch(`${DOMAIN}/api/products/`);
            products = await response.json();
        } else {
            // Nếu có chọn danh mục
            const res = await fetch(`${DOMAIN}/api/products/category/${encodeURIComponent(selectedCategory)}`);
            const data = await res.json();
            products = Array.isArray(data) ? data : [];
        }
    } catch (error) {
        console.error(error);
        toast.error("Không thể tải sản phẩm.");
    }
    return (
        <>
            <DanhMucClient categoryName={selectedCategory} products={products} categories={categories} />
        </>
    );
}
