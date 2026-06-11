// src/pages/ai/AIAssistantPage.jsx
import { useDispatch, useSelector } from 'react-redux'
import { useParams }                from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BoltIcon,
  BugAntIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'

// Components
import AIChat              from '../../components/ai/AIChat'
import AIDescriptionGen    from '../../components/ai/AIDescriptionGen'
import AIPriorityAdvisor   from '../../components/ai/AIPriorityAdvisor'
import AIBugAnalyzer       from '../../components/ai/AIBugAnalyzer'
import AIEstimator         from '../../components/ai/AIEstimator'
import AISubTaskGenerator  from '../../components/ai/AISubTaskGenerator'
import AISprintGoalGen     from '../../components/ai/AISprintGoalGen'
import AIProjectSummary    from '../../components/ai/AIProjectSummary'

// Redux
import {
  setActiveFeature,
  selectActiveFeature,
} from '../../features/ai/aiSlice'

const AI_FEATURES = [
  {
    key:     'chat',
    label:   'AI Chat',
    icon:    ChatBubbleLeftRightIcon,
    desc:    'Chat with your AI assistant',
    color:   'indigo',
    gradient:'from-indigo-500 to-purple-600',
  },
  {
    key:     'description',
    label:   'Description Generator',
    icon:    DocumentTextIcon,
    desc:    'Auto-generate task descriptions',
    color:   'blue',
    gradient:'from-blue-500 to-cyan-600',
  },
  {
    key:     'priority',
    label:   'Priority Advisor',
    icon:    BoltIcon,
    desc:    'Get AI priority suggestions',
    color:   'yellow',
    gradient:'from-yellow-500 to-orange-600',
  },
  {
    key:     'bug',
    label:   'Bug Analyzer',
    icon:    BugAntIcon,
    desc:    'Analyze and fix bugs with AI',
    color:   'red',
    gradient:'from-red-500 to-pink-600',
  },
  {
    key:     'estimate',
    label:   'Story Point Estimator',
    icon:    ChartBarIcon,
    desc:    'AI-powered effort estimation',
    color:   'green',
    gradient:'from-green-500 to-emerald-600',
  },
  {
    key:     'subtasks',
    label:   'SubTask Generator',
    icon:    PuzzlePieceIcon,
    desc:    'Break tasks into sub-tasks',
    color:   'purple',
    gradient:'from-purple-500 to-violet-600',
  },
  {
    key:     'sprint-goal',
    label:   'Sprint Goal Generator',
    icon:    RocketLaunchIcon,
    desc:    'Generate compelling sprint goals',
    color:   'teal',
    gradient:'from-teal-500 to-cyan-600',
  },
  {
    key:     'summary',
    label:   'Project Summary',
    icon:    SparklesIcon,
    desc:    'AI project status summary',
    color:   'orange',
    gradient:'from-orange-500 to-red-600',
  },
]

const COLOR_CLASSES = {
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  blue:   'bg-blue-50   border-blue-200   text-blue-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  red:    'bg-red-50    border-red-200    text-red-700',
  green:  'bg-green-50  border-green-200  text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  teal:   'bg-teal-50   border-teal-200   text-teal-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
}

export default function AIAssistantPage() {
  const dispatch        = useDispatch()
  const { projectId }   = useParams()
  const activeFeature   = useSelector(selectActiveFeature)

  const renderActiveFeature = () => {
    const props = { projectId }
    switch (activeFeature) {
      case 'chat':        return <AIChat {...props} />
      case 'description': return <AIDescriptionGen {...props} />
      case 'priority':    return <AIPriorityAdvisor {...props} />
      case 'bug':         return <AIBugAnalyzer {...props} />
      case 'estimate':    return <AIEstimator {...props} />
      case 'subtasks':    return <AISubTaskGenerator {...props} />
      case 'sprint-goal': return <AISprintGoalGen {...props} />
      case 'summary':     return <AIProjectSummary {...props} />
      default:            return <AIChat {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ======================== */}
      {/*         Header           */}
      {/* ======================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y:  0  }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-gradient-to-br
                           from-indigo-600 to-purple-600
                           rounded-2xl flex items-center
                           justify-center shadow-lg">
            <SparklesIcon
              className="w-6 h-6 text-white"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black
                            text-gray-900">
              AI Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Powered by GPT — Your smart project companion
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1
                       lg:grid-cols-4 gap-6">

        {/* ======================== */}
        {/*     Feature Sidebar      */}
        {/* ======================== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border
                           border-gray-100 shadow-sm
                           overflow-hidden sticky top-20">
            <div className="px-4 py-4 border-b
                             border-gray-100 bg-gray-50/50">
              <p className="text-xs font-bold
                             text-gray-500 uppercase
                             tracking-wider">
                AI Features
              </p>
            </div>

            <div className="p-2 space-y-1">
              {AI_FEATURES.map((feature, index) => (
                <motion.button
                  key={feature.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x:  0  }}
                  transition={{
                    duration: 0.3,
                    delay:    index * 0.05,
                  }}
                  onClick={() =>
                    dispatch(setActiveFeature(feature.key))
                  }
                  className={`
                    w-full flex items-center gap-3
                    px-3 py-3 rounded-xl text-left
                    transition-all duration-200
                    ${activeFeature === feature.key
                      ? `${COLOR_CLASSES[feature.color]} ` +
                        'border font-semibold'
                      : 'hover:bg-gray-50 text-gray-600'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center
                    justify-center flex-shrink-0
                    bg-gradient-to-br ${feature.gradient}
                  `}>
                    <feature.icon
                      className="w-4 h-4 text-white"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium
                                   truncate">
                      {feature.label}
                    </p>
                    <p className="text-[10px] text-gray-400
                                   truncate hidden
                                   lg:block">
                      {feature.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================== */}
        {/*     Active Feature       */}
        {/* ======================== */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y:  0  }}
              exit={{ opacity: 0, y: -12    }}
              transition={{ duration: 0.25  }}
            >
              {renderActiveFeature()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
