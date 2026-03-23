
const ADMIN_CREDENTIALS = {
  email: "admin",
  password: "admin"
}

export const authenticateAdmin = (email, password) => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const session = {
      isAuthenticated: true,
      timestamp: new Date().getTime()
    }
    localStorage.setItem("adminSession", JSON.stringify(session))
    return true
  }
  return false
}

export const checkAdminSession = () => {
  const session = localStorage.getItem("adminSession")
  if (!session) return false

  const parsedSession = JSON.parse(session)
  const now = new Date().getTime()
  const sessionAge = now - parsedSession.timestamp

  // Session expires after 2 hours
  if (sessionAge > 7200000) {
    localStorage.removeItem("adminSession")
    return false
  }

  return parsedSession.isAuthenticated
}

export const logoutAdmin = () => {
  localStorage.removeItem("adminSession")
}
