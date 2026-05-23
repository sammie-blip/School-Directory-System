import { supabase } from './supabaseClient'

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  username,
}) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const user = authData.user
  if (!user) throw new Error('Signup failed – no user returned')

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    username,
    email,
  })
  if (profileError) {
    await supabase.auth.admin.deleteUser(user.id)
    throw new Error(profileError.message)
  }

  return user
}

export async function signIn({ username, password }) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    throw new Error('No account found with that username')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  })
  if (error) throw error

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}