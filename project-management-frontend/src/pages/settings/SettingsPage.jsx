// src/pages/settings/SettingsPage.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
import { useAuth }     from '../../hooks/useAuth'
import { useTheme }    from '../../hooks/useTheme'
import { updateUser }  from '../../features/auth/authSlice'
import { useForm }     from 'react-hook-form'
import Input   from '../../components/common/Input/Input'
import Button  from '../../components/common/Button/Button'
import toast   from 'react-hot-toast'

function SettingsPage() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const onSubmit = async (data) => {
    dispatch(updateUser(data))
    toast.success('Settings saved')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name"  {...register('name')}  />
          <Input label="Email" type="email" {...register('email')} />
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>Save</Button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Theme</p>
            <p className="text-xs text-gray-400 mt-0.5">Currently: {theme}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 font-medium"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
