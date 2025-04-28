import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
  BsGithub,
} from 'react-icons/bs';
const SocialsDiv = () => {
  return (
    <div className="flex gap-3 my-3 text-2xl ml-1">
      <a target="_blank" href="">
        <BsLinkedin />
      </a>
      <a target="_blank" href="">
        <BsGithub />
      </a>
      <a target="_blank" href="">
        <BsFacebook />
      </a>
      <a target="_blank" href="">
        <BsInstagram />
      </a>
      <a target="_blank" href="">
        <BsTwitter />
      </a>
    </div>
  );
};

export default SocialsDiv;
