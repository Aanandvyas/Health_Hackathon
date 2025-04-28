import { DoctorsData } from '@/Components/Shared/Consts';
import SectionWrapper from '../SectionWrapper';

const Doctors = () => {
  return (
    <SectionWrapper id="doctors">
      
      <h4 className="text-3xl tracking-wider font-bold text-center my-4 md:mt-10">
        {DoctorsData.heading2}
      </h4>
      <div className="mb-5 m-auto text-center max-w-2xl text-xs sm:text-base md:text-lg">
        {DoctorsData.desc}
      </div>
      <img className="m-auto" src={DoctorsData.img} />
    </SectionWrapper>
  );
};

export default Doctors;
