import { NavLink } from "react-router-dom";


import { logo2 } from "../assets/images";

const Navbar = () => {
  return (
    <header className='header'>
      <NavLink to='/'>
        <img src={logo2} alt='logo' className='w-18 h-18 object-contain' width={50} height={50} />
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium'>
        <NavLink to='/contact' className={({ isActive }) => isActive ? "text-blue-600" : "[color:#545454]"}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
