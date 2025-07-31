'use client'
import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Admin_Home() {
    useEffect(() => {
        const token = localStorage.getItem("token");

        // Helper to check if token expired
        const isTokenExpired = (token: string): boolean => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.exp * 1000 < Date.now();
            } catch {
                return true;
            }
        };

        // Check once when component mounts
        if (token) {
            if (isTokenExpired(token)) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                window.location.href = "/login";
            } else {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        }
    }, []);

    const lineData = {
        labels: ['1/2', '2/2', '3/2', '4/2', '5/2', '6/2', '7/2'],
        datasets: [{ label: '', data: [1231, 3121, 4123, 5123, 4853, 5023, 6000], fill: false, borderColor: 'green' }]
    };

    const barData = {
        labels: ['Áo', 'Quần', 'Giày dép', 'Bàn', 'Ghế', 'Đồ Ăn', 'Sách', 'Nước hoa', 'Trang trí'],
        datasets: [{
            label: '', data: [1221, 654, 1412, 575, 1256, 5324, 2151, 5564, 3253], backgroundColor: [
                'red', 'teal', 'yellow', 'purple', 'gray', 'olive', 'blue', 'orange', 'maroon'
            ]
        }]
    };

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto text-black mb-14 mt-5">
            <ToastContainer />
            <h1 className="text-2xl font-bold text-center">Thống kê</h1>
            <div className="grid grid-cols-2  text-center border rounded p-4">
                <div>
                    <div className='border-b pb-2'>
                        <p className="font-bold">Số lượng bài viết</p>
                        <h2 className="text-xl">1000</h2>
                    </div>
                </div>
                <div className="border-l">
                    <div className='border-b pb-2'>
                        <p className="font-bold">Lượt xem bài viết (1 tuần)</p>
                        <h2 className="text-xl">12411</h2>
                    </div>
                </div>
                <div className='pt-2'>
                    <p className="font-bold">Số lượng danh mục</p>
                    <h2 className="text-xl">7</h2>
                </div>
                <div className='border-l pt-2'>
                    <p className="font-bold">Lượt click link (1 tuần)</p>
                    <h2 className="text-xl">12411</h2>
                </div>
            </div>
            <div>
                <p className="font-bold">Lượng truy cập trang trong 7 ngày: 100000</p>
                <Line data={lineData} />
            </div>
            <div>
                <p className="font-bold">Lượt xem theo danh mục trong 7 ngày</p>
                <Bar data={barData} />
            </div>
        </div>
    );
}
