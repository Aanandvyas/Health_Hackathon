// Import the single 'images' object from your new central image index file.
import { images } from '@/assets/images/index';

export const links = ['Home'];

export const descNums = [
  {
    num: '20+',
    text: 'Expert Doctors',
  },
  {
    num: '100+',
    text: 'Happy Patients',
  },
  {
    num: '24/7',
    text: 'Service',
  },
  {
    num: '97%',
    text: 'Accurate Bot',
  },
  {
    num: '5+',
    text: 'Different services',
  },
];

export const ServicesData = [
  {
    img: images.neurology,
    title: 'Neurology',
    id: 'neurology',
    heading: 'Neurology Department',
    texts: [
      'Expert neurological consultations',
      'Comprehensive brain and nerve care',
      'Advanced neuroimaging services',
      'Treatment for epilepsy and seizures',
      'Memory and cognitive assessments',
      'Pediatric neurology expertise',
      'Movement disorders management',
    ],
  },
  {
    img: images.cardiology,
    title: 'Cardiology',
    id: 'cardiology',
    heading: 'Cardiology Department',
    texts: [
      'Electrocardiogram (ECG)',
      'Echocardiogram',
      'Color Doppler Echo',
      'Dobutamine Stress Echo (DSE)',
      'Transesophageal Echo (TEE)',
      'Exercise Tolerance Test (ETT/TMT)',
      'Halter monitor',
      '24 Hour Ambulatory BP monitor',
      'Tilt Test/Tilt Table Test',
    ],
  },
  {
    img: images.orthopedics,
    title: 'Orthopedics',
    id: 'orthopedics',
    heading: 'Orthopedics Department',
    texts: [
      'Orthopedic surgery and joint replacements',
      'Sports injury and trauma care',
      'Physical therapy and rehabilitation',
      'Spine and back pain solutions',
      'Arthritis and joint disorder treatment',
      'Orthopedic consultations',
      'Customized orthopedic care plans',
    ],
  },
  {
    img: images.surgery,
    title: 'Surgery',
    id: 'surgery',
    heading: 'Surgery Department',
    texts: [
      'Minimally invasive and laparoscopic surgery',
      'Gastrointestinal surgery and endoscopy',
      'Plastic and reconstructive surgery',
      'Cancer and tumor resection',
      'Post-operative care and recovery',
      'Surgical consultations',
      'Emergency surgical interventions',
    ],
  },
  {
    img: images.dentistry,
    title: 'Dentistry',
    id: 'dentistry',
    heading: 'Dentistry Department',
    texts: [
      'Routine dental check-ups and cleanings',
      'Cosmetic dentistry and teeth whitening',
      'Oral surgery and extractions',
      'Dental implants and restorations',
      'Pediatric and family dentistry',
      'Gum disease treatment',
      'Orthodontic and braces options',
    ],
  },
  {
    img: images.radiology,
    title: 'Radiology',
    id: 'radiology',
    heading: 'Radiology Department',
    texts: [
      'Advanced diagnostic imaging services',
      'Mammography and breast health screening',
      'Interventional radiology procedures',
      'Virtual colonoscopy and body scans',
      'Radiology consultations',
      'Fast and accurate imaging results',
      'State-of-the-art radiology technology',
    ],
  },
  {
    img: images.urology,
    title: 'Urology',
    id: 'urology',
    heading: 'Urology Department',
    texts: [
      'Urinary tract and kidney evaluations',
      'Urologic surgery and stone removal',
      "Men's and women's urological health",
      'Prostate and bladder care',
      'Incontinence and pelvic floor therapy',
      'Urological consultations',
      'Comprehensive urology solutions',
    ],
  },
  {
    img: images.medicine,
    title: 'Medicine',
    id: 'medicine',
    heading: 'Medicine Department',
    texts: [
      'Primary care and internal medicine',
      'Chronic disease management and prevention',
      'Immunizations and wellness checks',
      'Holistic and integrative medicine',
      'Geriatric and pediatric medicine',
      'Health education and lifestyle coaching',
      'Individualized medical treatment plans',
    ],
  },
  {
    img: images.seeMoreImage,
    title: 'See More',
    id: 'seemore',
    heading: 'Explore Our Services',
    texts: [
      'Explore additional healthcare options',
      'Specialized medical services for all needs',
      'Discover a world of medical solutions',
      'Find the right care for you',
      'Comprehensive healthcare offerings',
      'More than meets the eye',
      'Healthcare beyond expectations',
    ],
  },
];

export const Banner1Data = {
  heading: 'We Are Always Here To Ensure Best Medical Treatment',
  texts: [
    'Easy make appointment',
    'Top specialist doctors',
    '24/7 service',
    'Discount for all medical treatments',
    'Enrolment is quick and easy',
  ],
  img: images.banner1,
};

export const DoctorsData = {
  heading: 'Meet Our Specialists',
  doctors: [
    {
      img: images.doc1,
      name: 'Dr. Madhav Mishra',
      job: 'Cardiologist',
    },
    {
      img: images.doc2,
      name: 'Dr. Mishti Sharma',
      job: 'Dentist',
    },
    {
      img: images.doc3,
      name: 'Dr. Pankaj Kumar',
      job: 'Surgeon',
    },
    {
      img: images.doc4,
      name: 'Dr. Ritu Singh',
      job: 'Neurologist',
    },
  ],
  heading2: 'Who Are We?',
  desc: 'A collaborative hospital service website is a digital platform that brings together healthcare professionals, patients and administrators to streamline and enganhe the delivery of healthcare services. This innovative platform allows for seamless communication and coordination among healthcare teams, enabling them to provide more efficient and personalized care to patients.',
  img: images.banner2,
};

export const FeedbackData = {
  heading: 'Patient Feedback',
  feedbacks: [
    {
      img: images.user1,
      name: 'Divya Kriplani ',
      job: 'Works at EY',
      desc: 'My experience with this hospital has been great. I highly recommend their services to anyone in need of quility healthcare. they truly prioritize patients care!',
    },
    {
      img: images.user2,
      name: 'Mayank Kumar',
      job: 'Works at Honeybee',
      desc: 'The healthcare professionals were top-natch. they were knowledgeable, attentive, and took the time to answer all of my questions and address my concerns',
    },
    {
      img: images.user3,
      name: 'Jhalak Sehgal',
      job: 'Phd Scholar',
      desc: "One thing that stood out to me was the efficiency of the service, i didn't have to wait long for my appointment, and the entire process was hassle-free experience",
    },
  ],
};

export const FooterData = {
  logo: images.logo,
  addresses: ['Vit Bhopal', 'Kothri Kalan'],
  phone: '8516894756',
  departments: [
    'Cardiology',
    'Dentistry',
    'Neurology',
    'Orthopedics',
    'Surgery',
    'More',
  ],
  links: links,
};
