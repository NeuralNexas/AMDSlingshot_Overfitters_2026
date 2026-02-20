import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"
import DevOpsDashboard from "@/components/dashboard/devops-dashboard"

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <DevOpsDashboard />
}