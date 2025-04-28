import { SelectedPage } from '@/Components/Shared/Types';
import { useNavigate } from 'react-router-dom';
import AnchorLink from 'react-anchor-link-smooth-scroll';

type Props = {
  page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  const navigate = useNavigate();
  const lowerCasePage = page.toLowerCase().replace(/\s+/g, '') as SelectedPage;

  const handleLinkClick = () => {
    if (page.toLowerCase() === 'about') {
      navigate('/about'); // Navigate to About page
    } else if (page.toLowerCase() === 'doctors') {
      navigate('/doctors'); // Navigate to Doctors page
    } else if (page.toLowerCase() === 'services') {
      navigate('/services'); // Navigate to Services page
    } else {
      setSelectedPage(lowerCasePage); // Handle other cases
    }
  };

  return (
    <AnchorLink
      className={`${
        selectedPage === lowerCasePage
          ? 'text-primary border-b-2 mt-0.5 border-[#2b7dad]'
          : 'text-[#1d4d85]'
      } transition font-bold text-lg duration-500 hover:text-[#2b7dad]`}
      href={
        ['about', 'doctors', 'services'].includes(page.toLowerCase())
          ? undefined
          : `#${lowerCasePage}`
      }
      onClick={handleLinkClick}
    >
      {page}
    </AnchorLink>
  );
};

export default Link;
