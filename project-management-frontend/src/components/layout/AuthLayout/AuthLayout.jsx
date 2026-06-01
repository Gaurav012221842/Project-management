// src/components/layout/AuthLayout/AuthLayout.jsx
import { Outlet }        from 'react-router-dom'
import { motion }        from 'framer-motion'
import { SparklesIcon }  from '@heroicons/react/24/solid'

const FEATURES = [
  {
    icon:  '🚀',
    title: 'AI-Powered Planning',
    desc:  'Smart task suggestions & auto-priority',
  },
  {
    icon:  '⚡',
    title: 'Real-Time Collaboration',
    desc:  'Live updates & team chat built-in',
  },
  {
    icon:  '📊',
    title: 'Advanced Analytics',
    desc:  'Burndown charts & velocity tracking',
  },
  {
    icon:  '🎯',
    title: 'Sprint Management',
    desc:  'Agile boards with drag & drop',
  },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">

      {/* ======================== */}
      {/*      Left Panel          */}
      {/* ======================== */}
      <div className="hidden lg:flex lg:w-1/2
                       bg-gradient-to-br
                       from-indigo-900
                       via-indigo-800
                       to-purple-900
                       relative overflow-hidden
                       flex-col justify-between
                       p-12">

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(
                circle at 1px 1px,
                rgba(255,255,255,0.07) 1px,
                transparent 0
              )`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glowing Orbs */}
          <div className="absolute -top-40 -right-40
                           w-96 h-96 bg-purple-500
                           rounded-full opacity-20
                           blur-3xl" />
          <div className="absolute -bottom-40 -left-40
                           w-96 h-96 bg-indigo-400
                           rounded-full opacity-20
                           blur-3xl" />
          <div className="absolute top-1/2 left-1/2
                           -translate-x-1/2
                           -translate-y-1/2
                           w-64 h-64 bg-blue-500
                           rounded-full opacity-10
                           blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y:  0  }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-10 h-10 bg-white
                             bg-opacity-20
                             backdrop-blur-sm
                             rounded-xl flex
                             items-center
                             justify-center
                             border border-white
                             border-opacity-30">
              <SparklesIcon
                className="w-6 h-6 text-white"
              />
            </div>
            <span className="text-white font-bold
                              text-xl tracking-wide">
              ProjAI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x:  0  }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold
                            text-white leading-tight
                            mb-4">
              Manage Projects
              <br />
              <span className="text-indigo-300">
                With Intelligence
              </span>
            </h1>
            <p className="text-indigo-200
                           text-lg leading-relaxed
                           max-w-md">
              The AI-powered project management
              tool that helps teams ship faster
              and smarter.
            </p>
          </motion.div>
        </div>

        {/* Features List */}
        <div className="relative z-10 space-y-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:  0  }}
              transition={{
                duration: 0.5,
                delay:    0.4 + index * 0.1
              }}
              className="flex items-center gap-4
                           bg-white bg-opacity-10
                           backdrop-blur-sm
                           rounded-2xl p-4
                           border border-white
                           border-opacity-10
                           hover:bg-opacity-15
                           transition-all duration-300"
            >
              <div className="text-2xl w-10 h-10
                               bg-white bg-opacity-20
                               rounded-xl flex
                               items-center
                               justify-center
                               flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <p className="text-white font-semibold
                               text-sm">
                  {feature.title}
                </p>
                <p className="text-indigo-300 text-xs
                               mt-0.5">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0  }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative z-10 flex
                       items-center gap-8 pt-6
                       border-t border-white
                       border-opacity-10"
        >
          {[
            { value: '10K+',  label: 'Teams'    },
            { value: '500K+', label: 'Tasks'    },
            { value: '99.9%', label: 'Uptime'   },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold
                             text-white">
                {stat.value}
              </p>
              <p className="text-indigo-300 text-xs
                             mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ======================== */}
      {/*      Right Panel         */}
      {/* ======================== */}
      <div className="flex-1 flex items-center
                       justify-center p-6
                       bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center
                           justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-indigo-600
                             rounded-xl flex
                             items-center
                             justify-center">
              <SparklesIcon
                className="w-5 h-5 text-white"
              />
            </div>
            <span className="text-gray-900 font-bold
                              text-xl">
              ProjAI
            </span>
          </div>

          {/* Page Content */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}