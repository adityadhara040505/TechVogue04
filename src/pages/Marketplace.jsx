import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Marketplace() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.description.toLowerCase().includes(search.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Project Marketplace
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="featured">Featured</option>
          </select>
          <Link
            to="/projects/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Post a Project
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No projects found</p>
          <Link
            to="/projects/create"
            className="mt-4 inline-flex items-center text-brand-600 hover:text-brand-700"
          >
            Post your first project →
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {project.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          project.status === 'active' ? 'bg-green-100 text-green-800' :
          project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-brand-100 text-brand-800'
        }`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.skills.map((skill, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <img
            src={project.client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.client.name)}`}
            alt={project.client.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {project.client.name}
            </p>
            <p className="text-xs text-gray-500">
              Posted {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-brand-600">
            ${project.budget}
          </p>
          <p className="text-xs text-gray-500">
            {project.type}
          </p>
        </div>
      </div>

      <Link
        to={`/project/${project._id}`}
        className="mt-4 block w-full text-center px-4 py-2 border border-brand-600 rounded-md text-brand-600 hover:bg-brand-50 transition-colors"
      >
        View Details
      </Link>
    </motion.div>
  );
}