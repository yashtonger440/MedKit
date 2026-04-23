import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href="/login";
    };

    if (!user) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <p className='text-lg'>Loading...</p>
            </div>
        );
    }

  return (
    <div className='min-h-screen bg-gray-700 flex justify-center items-center px-4'>

        <div className='bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center'>

            <div className='w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-3xl fond-bold mb-4'>
                {user.name?.charAt(0).toUpperCase()}
            </div>

            <h2 className='text-2xl font-bold text-gray-800'>
                {user.name}
            </h2>

            <p className='text-gray-500 mt-1'>{user.email}</p>

            <span className='inline-block mt-3 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full'>
                {user.role || "user"}
            </span>

            <div className='border-t my-6'></div>

            <div className='space-y-3'>

                <button className='w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition'>
                    Edit Profile
                </button>

                <button 
                onClick={handleLogout}
                className='w-full py-2 bg-red-500 rounded-lg hover:bg-red-600 transition text-white'>
                    Logout
                </button>

            </div>

        </div>
    </div>
  )
}

export default Profile
