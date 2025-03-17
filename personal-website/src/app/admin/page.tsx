import * as React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your portfolio content",
}

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="mt-4">
          {/* Project management interface will go here */}
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    </div>
  )
} 