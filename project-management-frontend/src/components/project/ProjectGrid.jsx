// src/components/project/ProjectGrid.jsx
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

export default function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1
                     sm:grid-cols-2
                     lg:grid-cols-3 gap-5">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
        />
      ))}
    </div>
  )
}