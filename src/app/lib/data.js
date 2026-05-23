import { supabase } from './supabaseClient'

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, username, email')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function fetchStudents() {
  const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addStudent({ student_id, full_name, year_level, email }) {
  const { data, error } = await supabase.from('students').insert([{ student_id, full_name, year_level, email }]).select().single()
  if (error) throw error
  return data
}

export async function updateStudent(id, updates) {
  const { data, error } = await supabase.from('students').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteStudent(id) {
  const { error } = await supabase.from('students').delete().eq('id', id)
  if (error) throw error
}

export async function fetchTeachers() {
  const { data, error } = await supabase.from('teachers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addTeacher({ teacher_id, full_name, subject, email }) {
  const { data, error } = await supabase.from('teachers').insert([{ teacher_id, full_name, subject, email }]).select().single()
  if (error) throw error
  return data
}

export async function updateTeacher(id, updates) {
  const { data, error } = await supabase.from('teachers').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteTeacher(id) {
  const { error } = await supabase.from('teachers').delete().eq('id', id)
  if (error) throw error
}

export async function fetchStaffs() {
  const { data, error } = await supabase.from('staffs').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addStaff({ staff_id, full_name, position, email }) {
  const { data, error } = await supabase.from('staffs').insert([{ staff_id, full_name, position, email }]).select().single()
  if (error) throw error
  return data
}

export async function updateStaff(id, updates) {
  const { data, error } = await supabase.from('staffs').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteStaff(id) {
  const { error } = await supabase.from('staffs').delete().eq('id', id)
  if (error) throw error
}