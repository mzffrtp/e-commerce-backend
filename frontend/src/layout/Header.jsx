import React, { useState } from 'react'
import { SlBasket } from "react-icons/sl";

const Header = () => {

    const [openMenu, setOpenMenu] = useState(false)
    const menuItems = [{
        name: "Profil",
        url: "/profile"
    },
    {
        name: "Admin",
        url: "/admin"
    },
    {
        name: "Logout",
        url: "/logout"
    }]
    return (
        <header className='bg-gray-100 h-16 px-5 flex items-center justify-between'>
            <div className='text-4xl'>
                e-com&see
            </div>
            <div className='flex items-center gap-5'>
                <div className='flex items-center'>
                    <input
                        className='p-2 outline-none'
                        type='text' placeholder='Search ..' />
                    <div className='p-2 ml-2 hover:bg-lime-300 rounded-full cursor-pointer'> Search</div>
                </div>

                <div className='relative'

                >
                    <img
                        onClick={() => setOpenMenu(!openMenu)}
                        className='w-8 h-8 rounded-full
                        '
                        alt=''
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRog6epfJWr_aK4Q5m5o6OYOGoJAHZMpky4mA&usqp=CAU' />
                    {openMenu && <div className='absolute right-0 mt-4 w-[150px] bg-white shadow-lg shadow-gray-500'>
                        {menuItems.map((item, i) => (
                            <div className='px-2 py-1 hover:bg-gray-100' key={i}>{item.name}</div>
                        ))}
                    </div>}
                </div>
                <div className='relative'>
                    <SlBasket size={30} />
                    <div className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded- full flex items-center justify-center rounded-full p-1'>4</div>
                </div>
            </div>

        </header>
    )
}

export default Header