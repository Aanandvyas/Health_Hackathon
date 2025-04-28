import { useNavigate } from "react-router-dom";
import Button from '@/Components/UI/Button';
import hero from "./hero.png";
import DescNums from './DescNums';
import SectionWrapper from '../SectionWrapper';

const Home = () => {
  const navigate = useNavigate();

  return (
    <SectionWrapper id="home">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 text-center md:text-left ">
        <div className="tracking-wider md:tracking-normal max-w-xs lg:max-w-xl">
          <h1 className="lg:text-6xl text-4xl font-bold text-green-500">
            Your Wellness, Our Commitment Health Comes First
          </h1>
          <p className="text-lg md:text-base lg:text-xl my-10">
            Share your medical history securely with doctors and loved ones via
            HealthMentá.ai, Prescription Manager, and Health Centers
          </p>
          <Button onClick={() => navigate("/Health-Menta/Doctors")}>
            Appointment Now
          </Button>
        </div>
        <div className="max-w-xs md:max-w-none">
          <img src={hero} alt="hero" />
        </div>
      </div>
      <DescNums />
    </SectionWrapper>
  );
};

export default Home;
