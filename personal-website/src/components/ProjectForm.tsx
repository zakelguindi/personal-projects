'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ProjectFormProps {
  initialData?: {
    id: string
    project_id: string
    name: string
    description: string
    languages: string[]
    github_link: string
    deployment_link: string
  }
  onSuccess: () => void
  onCancel: () => void
}

export default function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    languages: initialData?.languages?.join(', ') || '',
    github_link: initialData?.github_link || '',
    deployment_link: initialData?.deployment_link || '',
    project_id: initialData?.project_id || process.env.NEXT_PUBLIC_PROJECT_ID || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session) throw new Error('No authenticated user')

      

      const projectData = {
        ...formData,
        // Convert comma-separated string to array and clean up whitespace
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(Boolean),
        user_id: session.user.id
      }

      if (initialData) {
        const { error: updateError } = await supabase
          .from('p1_projects_data')
          .update(projectData)
          .eq('id', initialData.id)
          .eq('user_id', session.user.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('p1_projects_data')
          .insert([projectData])

        if (insertError) throw insertError
      }

      onSuccess()
    } catch (error) {
      console.error('Project save error:', error)
      if (error instanceof Error) {
        setError(`Error: ${error.message}`)
      } else {
        setError(`Failed to save project: ${JSON.stringify(error)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="languages" className="block text-sm font-medium text-foreground">
          Languages Used (comma-separated)
        </label>
        <input
          type="text"
          id="languages"
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.languages}
          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="github_link" className="block text-sm font-medium text-foreground">
          GitHub Link
        </label>
        <input
          type="url"
          id="github_link"
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.github_link}
          onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="deployment_link" className="block text-sm font-medium text-foreground">
          Deployment Link
        </label>
        <input
          type="url"
          id="deployment_link"
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.deployment_link}
          onChange={(e) => setFormData({ ...formData, deployment_link: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  )
} 