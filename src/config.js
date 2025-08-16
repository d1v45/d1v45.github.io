module.exports = {
  siteTitle: 'DIVAS',
  siteDescription:
    'DIVAS A S is an incoming Cybersecurity Professional, based in India, who loves exploring new things and helping tech beginners.',
  siteKeywords:
    'DIVAS A S, DIVAS, Divas, d1v45, hacker, web developer, pwn, javascript, python, go, rust, sist, chennai',
  siteUrl: 'https://d1v45.github.io/',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-45666519-2',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'DIVAS A S',
  location: 'Chennai, India',
  email: 'divagopi53@gmail.com',
  github: 'https://github.com/d1v45',
  twitterHandle: '@',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/d1v45',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/divas-a-s/',
    },
    {
      name: 'Tryhackme',
      url: 'https://www.tryhackme.com/p/d1v45',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/life__of__divas',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Projects',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
    { name: 'Blog',
      url: 'https://blog.d1v45.me/' 
    },
  ],

  navHeight: 100,

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
