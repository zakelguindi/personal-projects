'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: string
  project_id: string
  name: string
  description: string
  languages: string[]
  github_link: string
  deployment_link: string
  created_at: string
}

export default function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('p1_projects_data')
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

    fetchProjects()
  }, [])

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const getLanguageTagColor = (index: number) => {
    const colors = [
      'bg-primary/10 text-primary',
      'bg-secondary/10 text-secondary',
      'bg-accent/10 text-accent',
      'bg-destructive/10 text-destructive',
      'bg-muted/10 text-muted-foreground'
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-destructive">Error: {error}</div>
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Work</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent/5"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
              <div className="relative">
                <p className={`text-muted-foreground mb-2 transition-all duration-300 ${
                  expandedDescriptions.has(project.id) ? '' : 'line-clamp-2'
                }`}>
                  {project.description}
                </p>
                {project.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(project.id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors -mt-1 mb-4"
                  >
                    {expandedDescriptions.has(project.id) ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.languages.map((lang, index) => (
                  <span
                    key={lang}
                    className={`rounded-full px-2 py-1 text-xs ${getLanguageTagColor(index)}`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  GitHub Repository →
                </Link>
                <Link
                  href={project.deployment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Project Link →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 