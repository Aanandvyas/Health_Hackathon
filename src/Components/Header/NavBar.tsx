import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useMediaQuery from '@/Hooks/useMediaQuery';
import { SelectedPage } from '@/Components/Shared/Types'; // Assuming this path is correct
import Button from '../UI/Button'; // Assuming this path is correct

// Helper NavLink component to reduce repetition
type NavLinkProps = {
  page: string;
  to: string;
  selectedPage: SelectedPage;
  setSelectedPage: Dispatch<SetStateAction<SelectedPage>>;
  closeMobileMenu?: () => void; // Optional: Function to close mobile menu
};

const NavLink = ({ page, to, selectedPage, setSelectedPage, closeMobileMenu }: NavLinkProps) => {
  // Normalize page name to match the enum format (e.g., "About Us" -> "aboutus")
  const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;
  
  const baseStyles = "text-lg font-bold text-primary hover:text-green-500 transition duration-300";
  const activeStyles = "text-green-500"; // Style for the active link

  return (
    <Link
      to={to}
      className={`${baseStyles} ${selectedPage === lowerCasePage ? activeStyles : ""}`}
      onClick={() => {
        setSelectedPage(lowerCasePage);
        if (closeMobileMenu) {
            closeMobileMenu();
        }
      }}
    >
      {page}
    </Link>
  );
};


// Main NavBar component
type Props = {
  flexBetween: string;
  selectedPage: SelectedPage;
  setSelectedPage: Dispatch<SetStateAction<SelectedPage>>;
};

const NavBar = ({ flexBetween, selectedPage, setSelectedPage }: Props) => {
  const navigate = useNavigate();
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  // Initialize state directly from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const isAboveMediumScreens = useMediaQuery('(min-width: 900px)');

  // This effect listens for changes to localStorage from other tabs/pages
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // Manually trigger a storage event to update the UI immediately
    window.dispatchEvent(new Event("storage")); 
    navigate("/login");
  };

  return (
    <nav>
      {/* ================== DESKTOP NAV ================== */}
      {isAboveMediumScreens ? (
        <div className={`${flexBetween} w-full gap-5 `}>
          <div className={`${flexBetween} gap-10`}>
            {/* Using the new NavLink component */}
            <NavLink page="Home" to="/" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
            <NavLink page="About" to="/about" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
            {isLoggedIn && (
              <>
                <NavLink page="Doctors" to="/doctors" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                <NavLink page="Services" to="/services" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
              </>
            )}
          </div>

          <div className={`${flexBetween} gap-10`}>
            {!isLoggedIn ? (
              <Button onClick={() => navigate("/login")}>Login</Button>
            ) : (
              <Button onClick={handleLogout}>Logout</Button>
            )}
          </div>
        </div>
      ) : (
        <button className="rounded-full bg-green-500 p-2" onClick={() => setIsMenuToggled(true)}>
          <Bars3Icon className="h-6 w-6 text-white" />
        </button>
      )}

      {/* ================== MOBILE MENU MODAL ================== */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 top-0 z-40 h-full w-[300px] bg-white drop-shadow-xl">
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="ml-[33%] flex flex-col gap-10 text-2xl">
            <NavLink page="Home" to="/" selectedPage={selectedPage} setSelectedPage={setSelectedPage} closeMobileMenu={() => setIsMenuToggled(false)} />
            <NavLink page="About" to="/about" selectedPage={selectedPage} setSelectedPage={setSelectedPage} closeMobileMenu={() => setIsMenuToggled(false)} />
            {isLoggedIn && (
              <>
                <NavLink page="Doctors" to="/doctors" selectedPage={selectedPage} setSelectedPage={setSelectedPage} closeMobileMenu={() => setIsMenuToggled(false)} />
                <NavLink page="Services" to="/services" selectedPage={selectedPage} setSelectedPage={setSelectedPage} closeMobileMenu={() => setIsMenuToggled(false)} />
              </>
            )}
            <div className="mt-8 ">
              {!isLoggedIn ? (
                <Button onClick={() => {
                  navigate("/login");
                  setIsMenuToggled(false);
                }}>
                  Login
                </Button>
              ) : (
                <Button onClick={() => {
                  handleLogout();
                  setIsMenuToggled(false);
                }}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
