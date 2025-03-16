"use client"

import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-grid-primary/10 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto py-20 px-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="bg-accent/50 rounded-2xl p-8 mb-8">
            <h1 className="text-6xl font-bold text-foreground">
              Hey, I'm <span className="text-primary">Vinay Sagar</span>
            </h1>
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              A <span className="font-semibold text-foreground">full-stack developer</span> with expertise in
              <span className="font-semibold text-foreground"> web development</span>,
              <span className="font-semibold text-foreground"> backend engineering</span>, and
              <span className="font-semibold text-foreground"> AI-powered solutions</span>.
            </p>
          </div>
        </motion.section>

        {/* What I Do & Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div className="group p-8 border border-border rounded-xl bg-card backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">What I Do</h2>
            <p className="text-muted-foreground leading-relaxed">
              I develop <span className="text-foreground font-medium">fast, scalable, and modern web applications</span> with a strong focus on
              <span className="text-foreground font-medium"> performance & user experience</span>.
            </p>
          </div>
          <div className="group p-8 border border-border rounded-xl bg-card backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">My Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To create <span className="text-foreground font-medium">powerful, reliable, and efficient software solutions</span> that solve real-world problems.
            </p>
          </div>
        </motion.section>

        {/* Technologies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-foreground">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {["React.js", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "TailwindCSS"].map((tech) => (
              <span key={tech}
                className="px-6 py-3 border border-border bg-card backdrop-blur-sm rounded-full text-card-foreground font-medium transition-all duration-300 hover:scale-105 hover:bg-accent">
                {tech}
              </span>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center py-16 bg-accent/50 backdrop-blur-sm"
      >
        <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto mb-8">
          I'm open to <span className="text-foreground font-medium">collaborations, freelance work, and new opportunities</span>.
          Feel free to reach out! 🚀
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/TheVinaySagar"
            target="_blank"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/thevinaysagar"
            target="_blank"
            className="px-8 py-3 rounded-full bg-[#0077B5] text-white hover:opacity-90 transition-all duration-300"
          >
            LinkedIn
          </a>
          <a
            href="mailto:vinaysagar4445@gmail.com"
            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground hover:opacity-90 transition-all duration-300"
          >
            Email Me
          </a>
        </div>
      </motion.section>
    </div>
  )
}
