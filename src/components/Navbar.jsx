import { Link, NavLink } from 'react-router-dom'
import { FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa'

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link to="/" className="text-xl font-semibold tracking-tight hover:text-blue-600 transition">Tech Vogue</Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <NavItem to="/" icon={<FaHome />}>Home</NavItem>
          <NavItem to="/about" icon={<FaInfoCircle />}>About</NavItem>
          <NavItem to="/contact" icon={<FaEnvelope />}>Contact</NavItem>
          <NavItem to="/auth" icon={<FaSignInAlt />}>Login</NavItem>
        </nav>
      </div>
    </header>
  )
}

function NavItem({ to, children, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `inline-flex items-center gap-1.5 rounded-md px-2 py-1 ${isActive ? 'text-brand-700 bg-brand-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      {icon && <span className="text-brand-700">{icon}</span>}
      {children}
    </NavLink>
  )
}

