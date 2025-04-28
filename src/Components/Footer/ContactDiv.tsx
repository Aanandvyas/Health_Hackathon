import SocialsDiv from '../Socials/SocialsDiv';
import Input from '../UI/Input';

const ContactDiv = () => {
  return (
    <div className="max-w-xs w-full">
      <p className="text-lg font-bold mb-4">
        Share Your Innovation With Us so we can help Others
      </p>
      <Input placeholder="Your Email"   />
      <SocialsDiv />
    </div>
  );
};

export default ContactDiv;
