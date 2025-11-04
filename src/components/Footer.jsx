import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 p-4 text-sm text-gray-600 md:flex-row">
        <div>© {new Date().getFullYear()} Tech Vogue</div>
        <div className="flex items-center gap-4 text-base text-gray-700">
          <a href="#" aria-label="Twitter" className="hover:text-blue-600"><FaTwitter /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-600"><FaLinkedin /></a>
          <a href="#" aria-label="GitHub" className="hover:text-blue-600"><FaGithub /></a>
        </div>
      </div>
    </footer>
  )
}

