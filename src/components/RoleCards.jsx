import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const roles = [
  {
    title: 'Entrepreneurs',
    description: 'Showcase your startup, find investors, and build your dream team.',
    icon: '🚀',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    linkTo: '/auth?role=entrepreneur'
  },
  {
    title: 'Investors',
    description: 'Discover promising startups and make data-driven investment decisions.',
    icon: '💰',
    color: 'bg-green-100',
    textColor: 'text-green-800',
    linkTo: '/auth?role=investor'
  },
  {
    title: 'Freelancers',
    description: 'Connect with startups and contribute to innovative projects.',
    icon: '💻',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    linkTo: '/auth?role=freelancer'
  }
];

export default function RoleCards() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Choose Your Role</h2>
          <p className="mt-4 text-lg text-gray-600">Join our platform as an entrepreneur, investor, or freelancer</p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className={`rounded-xl ${role.color} p-8 h-full transition-shadow duration-300 hover:shadow-xl`}>
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-2xl">
                  {role.icon}
                </div>
                <h3 className={`text-xl font-semibold ${role.textColor} mb-4`}>{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <Link
                  to={role.linkTo}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Get Started
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}