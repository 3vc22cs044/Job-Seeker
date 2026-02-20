import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [show, handleShow] = useState(false);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 100) {
                handleShow(true);
            } else {
                handleShow(false);
            }
        };
        window.addEventListener("scroll", scrollListener);
        return () => {
            window.removeEventListener("scroll", scrollListener);
        };
    }, []);

    return (
        <div className={`fixed top-0 w-full p-5 flex justify-between h-[64px] z-10 transition-all duration-500 ease-in ${show && "bg-[#111]"}`}>
            <img
                className="fixed left-5 w-[80px] object-contain"
                src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                alt="Netflix Logo"
            />
            <img
                className="fixed right-5 w-[32px] object-contain"
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                alt="Netflix Avatar"
            />
        </div>
    );
};

export default Navbar;
