import React, { useState } from 'react';
import { BiSearchAlt2, BiMenu } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';

const Sidebar = () => {

    const [search, setSearch] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    };

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
        } else {
            toast.error("User not found!");
        }
    };

    return (
        <div className='flex h-full relative'>
            {/* Sidebar Container */}
            <div className={`fixed inset-0 md:static z-20 bg-gray-900 md:bg-transparent p-4 mt-14 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 md:w-1/4`}>
                <form onSubmit={searchSubmitHandler} className='flex items-center gap-2'>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='input input-bordered rounded-md w-full md:w-auto'
                        type="text"
                        placeholder='Search...'
                    />
                    <button type='submit' className='btn bg-zinc-700 text-white'>
                        <BiSearchAlt2 className='w-6 h-6 outline-none' />
                    </button>
                </form>
                <div className="divider px-3"></div>
                <OtherUsers />
                <div className='mt-2'>
                    <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
                </div>
            </div>

            {/* Toggle Button for Mobile */}
            <button 
                className="fixed top-2 left-2 md:hidden p-2 text-white z-30 bg-gray-900 rounded" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <BiMenu className='w-6 h-6' />
            </button>

            {/* Main Content (Chat) */}
            <div className={`flex-grow md:w-3/4 w-full p-4 transition-all ${isSidebarOpen ? 'blur-sm md:blur-none' : 'blur-0'}`}>
                {/* Chat container content here */}
                <div className="overflow-auto h-full">
                    {/* Your chat messages go here */}
                </div>
            </div>

            {/* Overlay when Sidebar is Open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
