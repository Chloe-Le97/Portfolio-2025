import { Link } from "react-router-dom";

import { socialLinks } from "../constants";


const CTA = () => {
  return (
    <section className='cta'>
      <p className='cta-text'>
        Want to know more about me? <br className='sm:block hidden' />
        Let’s connect!
      </p>
	  <div className='flex gap-3 justify-center items-center'>
          {socialLinks.map((link) => (
            <Link key={link.name} to={link.link} target='_blank'>
              <img
                src={link.iconUrl}
                alt={link.name}
                className='w-6 h-6 object-contain'
              />
            </Link>
          ))}
        </div>
    </section>
  );
};

export default CTA;
