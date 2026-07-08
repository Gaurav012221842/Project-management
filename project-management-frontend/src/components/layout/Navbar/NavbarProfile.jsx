// src/components/layout/Navbar/NavbarProfile.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, logout } from '../../../features/auth/authSlice'
import Avatar from '../../common/Avatar/Avatar'
import Dropdown from '../../common/Dropdown/Dropdown'
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

function NavbarProfile() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const user      = useSelector(selectUser)

  const items = [
    { label: 'Profile',  icon: <UserCircleIcon className="w-4 h-4" />,              onClick: () => navigate('/profile')  },
    { label: 'Settings', icon: <Cog6ToothIcon  className="w-4 h-4" />,              onClick: () => navigate('/settings') },
    { divider: true },
    { label: 'Log out',  icon: <ArrowRightOnRectangleIcon className="w-4 h-4" />,  onClick: () => dispatch(logout()), danger: true },
  ]

  return (
    <Dropdown
      align="right"
      trigger={
        <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar
            name={user?.name || user?.username || 'U'}
            src={user?.avatarUrl || user?.profilePic}
            size="sm"
          />
        </button>
      }
      items={items}
    />
  )
}

export default NavbarProfile
