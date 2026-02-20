"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[380px] rounded-2xl border border-white/10 bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Self-Healing DevOps Platform
        </h1>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full mb-4 rounded-lg bg-teal-400 py-3 text-black font-semibold hover:bg-teal-300 transition"
        >
          Sign in with Google
        </button>

        <div className="my-4 text-center text-sm text-gray-400">or</div>

        {/* Email + Password */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 rounded-md bg-black/40 border border-white/10 p-2 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 rounded-md bg-black/40 border border-white/10 p-2 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() =>
            signIn("credentials", {
              email,
              password,
              callbackUrl: "/",
            })
          }
          className="w-full rounded-lg bg-white text-black py-2 font-semibold hover:bg-gray-200 transition"
        >
          Sign in with Email
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          New users can sign up directly with Google
        </p>
      </div>
    </div>
  )
}