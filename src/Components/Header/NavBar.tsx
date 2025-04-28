import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { SelectedPage } from '@/Components/Shared/Types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMediaQuery from '@/Hooks/useMediaQuery';
import { useNavigate } from "react-router-dom";



// import Links from './Links';
import Button from '../UI/Button';

type Props = {
  flexBetween: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};


  const NavBar = ({ flexBetween }: { flexBetween: string }) => {
  const navigate = useNavigate();
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isAboveMediumScreens = useMediaQuery('(min-width: 900px)');
  
    useEffect(() => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    }, []);
  return (
    <nav>
      {/* Desktop Menu */}
      {isAboveMediumScreens && (
        <div className={`${flexBetween} lg:gap-28 gap-20`}>
          <div className={`${flexBetween} gap-16`}>
            {/* <Links selectedPage={selectedPage} setSelectedPage={setSelectedPage} /> */}

            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500"
            >
              <Link to="/Health-Menta">Home</Link>
            </button>
            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500"
            ><Link to="/Health-Menta/about">About</Link>
            </button>

            {isLoggedIn && (
            <>
            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500"
            >
              <Link to="/Health-Menta/doctors">Doctors</Link>
            </button>
            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500"
            >
              <Link to="/Health-Menta/services">Services</Link>
            </button>
            </>
          )}

          </div>
          {!isLoggedIn ? (
          <Button onClick={() => navigate("/Health-Menta/login")}>
            Login
          </Button>
        ) : (
          <button onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.reload();
          }}>
            <Link to="/Health-Menta/login">Logout</Link>
          </button>
        )}
        </div>
      )}

      {/* Mobile Menu Toggle Button */}
      {!isAboveMediumScreens && (
        <button onClick={() => setIsMenuToggled((prev) => !prev)}>
          <Bars3Icon className="h-8 w-8" />
        </button>
      )}

      {/* Mobile Menu Modal */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 top-0 z-40 h-80 rounded-es-3xl w-[175px] md:w-[300px] bg-secondary drop-shadow-2xl">
          {/* Close Button */}
          <div className="flex justify-end p-5 md:pr-16 sm:pt-10">
            <button onClick={() => setIsMenuToggled((prev) => !prev)}>
              <XMarkIcon className="h-10 w-10" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="ml-[20%] flex flex-col items-start gap-5 text-2xl">
            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500"
            >
              <Link to="/Health-Menta">Home</Link>
            </button>
            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500">
              <Link to="/Health-Menta/about">About</Link>
            </button>


            {isLoggedIn && (
            <>
            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500">
              <Link to="/Health-Menta/doctors">Doctors</Link>
            </button>

            <button
              className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500">
              <Link to="/Health-Menta/services">Services</Link>
            </button>
            </>
          )}
          {!isLoggedIn ? (
          <button 
          className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500">
            <Link to="/Health-Menta/login">Login</Link>
          </button>
        ) : (
          <button
          className="text-lg font-bold text-primary hover:text-[#2b7dad] transition duration-500" 
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}>
            Logout
          </button>
        )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
