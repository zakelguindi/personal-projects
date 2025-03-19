'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import Modal from "@/components/Modal"
import ProjectForm from "@/components/ProjectForm"

interface Project {
  id: string
  name: string
  description: string
  languages: string[]
  project_media: string
  github_link: string
  deployment_link: string
}

export default function AdminPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (!session) {
          router.push('/login')
        } else {
          fetchProjects()
        }
      } catch (error) {
        console.error('Auth error:', error)
        setError(error instanceof Error ? error.message : 'Authentication error')
        router.push('/login')
      }
    }
    checkUser()
  }, [router])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(projects.filter(project => project.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete project')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    fetchProjects()
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Portfolio Admin</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                View Site
              </Link>
              <Link
                href="/admin"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
          <button
            onClick={handleCreate}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create Project
          </button>
        </div>

        {loading ? (
          <div className="mt-8 text-center text-muted-foreground">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating your first project
            </p>
            <button
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={handleCreate}
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-lg border bg-card p-6 hover:bg-accent/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.languages.map((lang) => (
                        <span
                          key={lang}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                        >
                          {lang.trim()}
                        </span>
                      ))}
                    </div>

                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="rounded-md p-1 hover:bg-accent hover:text-accent-foreground"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-md p-1 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    GitHub →
                  </a>
                  <a
                    href={project.deployment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Live Demo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Project Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingProject ? 'Edit Project' : 'Create Project'}
      >
        <ProjectForm
          initialData={editingProject as Project || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
} 