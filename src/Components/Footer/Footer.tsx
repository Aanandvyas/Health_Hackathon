import ContactDiv from "./ContactDiv";
import FeedbackDiv from "./FeedbackDiv";  

const Footer = () => {
  return (
    <div className="bg-[#D5F5FF] text-black mt-20 p-10 md:px-16">
      <div className="max-w-[1250px] mx-auto flex flex-wrap justify-around items-start gap-6 md:gap-14">
        <div className="space-y-2">
          <ul className="font-bold text-lg ">
            <li>BizTech Innovators</li>
            <li>Vit Bhopal University</li>
            <li>Pin Code - 466114</li>
            <li>Phone - +91 8516894756</li>
          </ul>
        </div>
        <ContactDiv />
        <FeedbackDiv /> 
      </div>
    </div>
  );
};

export default Footer;
