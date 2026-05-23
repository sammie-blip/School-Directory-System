'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/app/lib/auth'
import {
  fetchStudents, addStudent, updateStudent, deleteStudent,
  fetchTeachers, addTeacher, updateTeacher, deleteTeacher,
  fetchStaffs, addStaff, updateStaff, deleteStaff,
  fetchProfile
} from '@/app/lib/data'
import { Users, GraduationCap, Briefcase, Plus, Pencil, Trash2, LogOut, X, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('students')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pageReady, setPageReady] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [addClosing, setAddClosing] = useState(false)
  const [addForm, setAddForm] = useState({ id: '', fullName: '', email: '', extra: '' })
  const [addError, setAddError] = useState('')

  const [showEditModal, setShowEditModal] = useState(false)
  const [editClosing, setEditClosing] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [editForm, setEditForm] = useState({ id: '', fullName: '', email: '', extra: '' })
  const [editError, setEditError] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteClosing, setDeleteClosing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutClosing, setLogoutClosing] = useState(false)

  const extraFieldName = activeTab === 'students' ? 'Year Level' : activeTab === 'teachers' ? 'Subject' : 'Position'
  const idFieldName = activeTab === 'students' ? 'Student ID' : activeTab === 'teachers' ? 'Teacher ID' : 'Staff ID'
  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) { router.push('/'); return }
        setUser(currentUser)
        const prof = await fetchProfile(currentUser.id)
        setProfile(prof)
        setPageReady(true)
      } catch (e) {
        router.push('/')
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) loadItems()
  }, [activeTab, user])

  const loadItems = async () => {
    setLoading(true)
    try {
      if (activeTab === 'students') setItems(await fetchStudents())
      else if (activeTab === 'teachers') setItems(await fetchTeachers())
      else setItems(await fetchStaffs())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetAddForm = () => {
    setAddForm({ id: '', fullName: '', email: '', extra: '' })
    setAddError('')
  }

  const closeAddModal = () => {
    setAddClosing(true)
    setTimeout(() => {
      setShowAddModal(false)
      setAddClosing(false)
      resetAddForm()
    }, 300)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    try {
      if (activeTab === 'students') {
        await addStudent({ student_id: addForm.id, full_name: addForm.fullName, year_level: addForm.extra, email: addForm.email })
      } else if (activeTab === 'teachers') {
        await addTeacher({ teacher_id: addForm.id, full_name: addForm.fullName, subject: addForm.extra, email: addForm.email })
      } else {
        await addStaff({ staff_id: addForm.id, full_name: addForm.fullName, position: addForm.extra, email: addForm.email })
      }
      closeAddModal()
      loadItems()
    } catch (err: any) {
      setAddError(err.message)
    }
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    const idValue = item.student_id || item.teacher_id || item.staff_id || ''
    const extraValue = item.year_level || item.subject || item.position || ''
    setEditForm({ id: idValue, fullName: item.full_name, email: item.email, extra: extraValue })
    setEditError('')
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setEditClosing(true)
    setTimeout(() => {
      setShowEditModal(false)
      setEditClosing(false)
      setEditItem(null)
    }, 300)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError('')
    try {
      const updates: any = {
        full_name: editForm.fullName,
        email: editForm.email
      }
      if (activeTab === 'students') {
        updates.student_id = editForm.id
        updates.year_level = editForm.extra
        await updateStudent(editItem.id, updates)
      } else if (activeTab === 'teachers') {
        updates.teacher_id = editForm.id
        updates.subject = editForm.extra
        await updateTeacher(editItem.id, updates)
      } else {
        updates.staff_id = editForm.id
        updates.position = editForm.extra
        await updateStaff(editItem.id, updates)
      }
      closeEditModal()
      loadItems()
    } catch (err: any) {
      setEditError(err.message)
    }
  }

  const confirmDelete = (item: any) => {
    setDeleteTarget(item)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setDeleteClosing(true)
    setTimeout(() => {
      setShowDeleteModal(false)
      setDeleteClosing(false)
      setDeleteTarget(null)
    }, 300)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      if (activeTab === 'students') await deleteStudent(deleteTarget.id)
      else if (activeTab === 'teachers') await deleteTeacher(deleteTarget.id)
      else await deleteStaff(deleteTarget.id)
      closeDeleteModal()
      loadItems()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const closeLogoutModal = () => {
    setLogoutClosing(true)
    setTimeout(() => {
      setShowLogoutModal(false)
      setLogoutClosing(false)
    }, 300)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const columns = () => {
    if (activeTab === 'students') return ['Student ID', 'Full Name', 'Year Level', 'Email']
    if (activeTab === 'teachers') return ['Teacher ID', 'Full Name', 'Subject', 'Email']
    return ['Staff ID', 'Full Name', 'Position', 'Email']
  }

  const renderRow = (item: any) => {
    if (activeTab === 'students') return [item.student_id, item.full_name, item.year_level, item.email]
    if (activeTab === 'teachers') return [item.teacher_id, item.full_name, item.subject, item.email]
    return [item.staff_id, item.full_name, item.position, item.email]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`bg-white shadow-sm border-b transition-all duration-500 ${
        pageReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            School Directory System
          </h1>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-sm font-medium text-gray-700 truncate max-w-[150px] sm:max-w-none">
              {profile ? `${profile.first_name} ${profile.last_name}` : (user?.email || '')}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-gray-500 hover:text-red-500 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-4 py-6 sm:py-8 transition-all duration-500 delay-200 ${
        pageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
          {['students', 'teachers', 'staffs'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetAddForm(); setShowAddModal(false); setShowEditModal(false); setShowDeleteModal(false); }}
              className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'students' && <Users className="w-4 h-4 sm:w-5 sm:h-5" />}
              {tab === 'teachers' && <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />}
              {tab === 'staffs' && <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div key={activeTab} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            <button
              onClick={() => { resetAddForm(); setShowAddModal(true); }}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-semibold text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" /> Add {activeTab.slice(0, -1)}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left min-w-[600px] sm:min-w-0">
                <thead>
                  <tr className="border-b">
                    {columns().map(col => (
                      <th key={col} className="py-3 px-4 text-sm font-semibold text-gray-600 whitespace-nowrap">{col}</th>
                    ))}
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                      {renderRow(item).map((val, i) => (
                        <td key={i} className="py-3 px-4 text-gray-700 text-sm whitespace-nowrap">{val}</td>
                      ))}
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(item)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={columns().length + 1} className="py-4 text-center text-gray-400">No {activeTab} yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${addClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl ${addClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add {activeTab.slice(0, -1)}</h3>
              <button onClick={closeAddModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                placeholder={idFieldName}
                value={addForm.id}
                onChange={(e) => setAddForm({ ...addForm, id: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
              />
              <input
                placeholder="Full Name"
                value={addForm.fullName}
                onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
              />
              {activeTab === 'students' ? (
                <select
                  value={addForm.extra}
                  onChange={(e) => setAddForm({ ...addForm, extra: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition bg-white"
                >
                  <option value="">Select Year Level</option>
                  {yearLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              ) : (
                <input
                  placeholder={extraFieldName}
                  value={addForm.extra}
                  onChange={(e) => setAddForm({ ...addForm, extra: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
              />
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editItem && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${editClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl ${editClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit {activeTab.slice(0, -1)}</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                placeholder={idFieldName}
                value={editForm.id}
                onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
              />
              <input
                placeholder="Full Name"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
              />
              {activeTab === 'students' ? (
                <select
                  value={editForm.extra}
                  onChange={(e) => setEditForm({ ...editForm, extra: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition bg-white"
                >
                  <option value="">Select Year Level</option>
                  {yearLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              ) : (
                <input
                  placeholder={extraFieldName}
                  value={editForm.extra}
                  onChange={(e) => setEditForm({ ...editForm, extra: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-indigo-400 transition"
              />
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deleteTarget && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${deleteClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center ${deleteClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete {activeTab.slice(0, -1)}?</h3>
            <p className="text-gray-500 mb-4 text-sm">
              Are you sure you want to delete <strong>{deleteTarget.full_name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${logoutClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center ${logoutClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <LogOut className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Log out</h3>
            <p className="text-gray-500 mb-4 text-sm">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={closeLogoutModal}
                className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-semibold"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}