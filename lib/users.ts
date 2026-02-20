import bcrypt from "bcrypt"

type User = {
  id: string
  email: string
  name?: string
  passwordHash?: string
  provider: "credentials" | "google"
}

const users = new Map<string, User>() // key = email

function genId() {
  return Math.random().toString(36).slice(2)
}

export async function createUser(
  email: string,
  password?: string,
  name?: string,
  provider: "credentials" | "google" = "credentials"
) {
  if (users.has(email)) throw new Error("User already exists")

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined

  const user: User = {
    id: genId(),
    email,
    name,
    passwordHash,
    provider,
  }

  users.set(email, user)
  return user
}

export async function verifyUser(email: string, password: string) {
  const user = users.get(email)
  if (!user || !user.passwordHash) return null

  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok ? user : null
}

export function upsertGoogleUser(email: string, name?: string) {
  if (users.has(email)) return users.get(email)
  const user: User = {
    id: genId(),
    email,
    name,
    provider: "google",
  }
  users.set(email, user)
  return user
}