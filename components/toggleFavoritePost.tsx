'use client'

import React, { useState } from 'react';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import axios from 'axios';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

interface User {
    _id: string;
    username: string;
    favoritesPost: string[];
    // Add other user fields if needed
}

interface FavoriteToggleProduct {
    postId: string;
    postTitle: string;
}

export default function ToggleFavoritePost({ postId, postTitle }: FavoriteToggleProduct) {
    const DOMAIN = process.env.NEXT_PUBLIC_HOSTDOMAIN
    const token = Cookies.get('token')

    const rawUser = Cookies.get('user');

    let user: User | null = null;
    try {
        const decodedUser = rawUser ? decodeURIComponent(rawUser) : null;
        user = decodedUser ? JSON.parse(decodedUser) : null;
    } catch (err) {
        console.error('Failed to decode or parse user cookie:', err);
        user = null;
    }

    const [favoritePost, setFavoritePost] = useState<string[]>(user?.favoritesPost || []);


    const toggleFavoritePost = async () => {
        if (!token || !user) {
            toast.warning('Vui lòng đăng nhập để thêm vào yêu thích.');
            return;
        }

        try {
            const token = Cookies.get("token");
            const response = await axios.post(`${DOMAIN}/api/user/favorites/post`, {
                postId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedFavorites: string[] = response.data.favoriesProduct;
            setFavoritePost(updatedFavorites);

            const updatedUser = { ...user, favoritesPost: updatedFavorites };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi thêm bài viết vào danh sách yêu thích.");
        }
    };

    const isPostFavorite = favoritePost.includes(postId);

    return (
        <div className='flex sm:flex-row justify-between items-center mt-3 mb-2 z-999'>
            <ToastContainer />
            <h2 className="text-lg font-bold mt-1 text-black line-clamp-1 text-muted">{postTitle}</h2>
            <div onClick={toggleFavoritePost} className='cursor-pointer transition-colors duration-300'>
                {isPostFavorite ? (
                    <IoMdHeart className='w-7 h-7 text-red-500 transition-colors duration-200' />
                ) : (
                    <IoMdHeartEmpty className='w-7 h-7 text-gray-600 hover:text-red-500 transition-colors duration-200' />
                )}
            </div>
        </div>
    )
}