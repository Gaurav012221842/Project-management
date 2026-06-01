// src/components/layout/MainLayout/MainLayout.jsx
import { useState, useEffect }      from 'react'
import { Outlet, useParams }        from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import Sidebar       from '../Sidebar/Sidebar'
import Navbar        from '../Navbar/Navbar'
import ChatPanel     from '../../chat/ChatPanel'
import {
  selectUser
} from '../../../features/auth/authSlice'
import {
  fetchProjectById,
  selectSelectedProject,
} from '../../../features/project/projectSlice'
import {
  fetchSprints,
} from '../../../features/sprint/sprintSlice'
import {
  fetchUnreadCount,
} from '../../../features/notification/notificationSlice'
import {
  selectIsSidebarOpen,
  selectIsChatOpen,
  toggleSidebar,
  toggleChat,
  setIsMobile,
  selectIsMobile,
} from '../../../features/ui/uiSlice'

export default function MainLayout() {
  const dispatch       = useDispatch()
  const { projectId }  = useParams()

  const user            = useSelector(selectUser)
  const isSidebarOpen   = useSelector(selectIsSidebarOpen)
  const isChatOpen      = useSelector(selectIsChatOpen)
  const isMobile        = useSelector(selectIsMobile)
  const selectedProject = useSelector(selectSelectedProject)

  // ============================
  // Detect Mobile
  // ============================
  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () =>
      window.removeEventListener('resize', checkMobile)
  }, [dispatch])

  // ============================
  // Fetch Project Data
  // ============================
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(Number(projectId)))
      dispatch(fetchSprints(Number(projectId)))
    }
  }, [projectId, dispatch])

  // ============================
  // Fetch Notifications Count
  // ============================
  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount())
    }
  }, [user, dispatch])

  return (
    <div className="flex h-screen bg-gray-50
                     overflow-hidden">

      {/* ======================== */}
      {/*   Sidebar Overlay Mobile */}
      {/* ======================== */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0   }}
            onClick={() => dispatch(toggleSidebar())}
            className="fixed inset-0 bg-black/50
                        backdrop-blur-sm z-40
                        lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ======================== */}
      {/*        Sidebar           */}
      {/* ======================== */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile
              ? { x: -280 }
              : false
            }
            animate={{ x: 0 }}
            exit={isMobile
              ? { x: -280 }
              : {}
            }
            transition={{
              type:      'spring',
              damping:   25,
              stiffness: 200,
            }}
            className={`
              flex-shrink-0
              ${isMobile
                ? 'fixed left-0 top-0 h-full z-50'
                : 'relative'
              }
            `}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================== */}
      {/*     Main Content Area    */}
      {/* ======================== */}
      <div className="flex-1 flex flex-col
                       min-w-0 overflow-hidden">

        {/* Navbar */}
        <Navbar
          project={selectedProject}
          onToggleSidebar={() =>
            dispatch(toggleSidebar())
          }
          onToggleChat={() =>
            dispatch(toggleChat())
          }
          isChatOpen={isChatOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto
                          overflow-x-hidden
                          relative">
          <Outlet />
        </main>
      </div>

      {/* ======================== */}
      {/*      Chat Panel          */}
      {/* ======================== */}
      <AnimatePresence>
        {isChatOpen && projectId && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => dispatch(toggleChat())}
          />
        )}
      </AnimatePresence>
    </div>
  )
}