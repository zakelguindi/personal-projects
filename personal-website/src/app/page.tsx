import * as React from "react"
import ContactForm from "./components/ContactForm"
import { metadata } from "./metadata"
import DeskAnimation from './components/DeskAnimation'
import Link from 'next/link'
import FeaturedWork from '@/components/FeaturedWork'

export { metadata }

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section - Full screen with dynamic elements */}
      <section className="relative flex min-h-screen items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/_0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--secondary)/_0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="text-shimmer mb-6 text-6xl font-bold tracking-tighter leading-[1.15] pb-1 sm:text-8xl sm:leading-[1.15] sm:pb-2">
            Zak Elguindi
          </h1>
          <p className="text-xl font-light text-muted-foreground sm:text-2xl">
            <span className="neon-text text-primary">Developer</span>
            <span className="mx-3 text-muted-foreground">×</span>
            <span className="neon-text text-secondary">Designer</span>
            <span className="mx-3 text-muted-foreground">×</span>
            <span className="neon-text text-accent">Creator</span>
          </p>
          
          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <a href="#about" className="neon-glow group relative w-40 rounded-lg bg-primary/10 px-6 py-3">
              <span className="neon-text relative z-10 text-primary transition-all duration-500 group-hover:text-primary-foreground">
                About Me
              </span>
            </a>
            <a href="#work" className="neon-glow group relative w-40 rounded-lg bg-primary/10 px-6 py-3">
              <span className="neon-text relative z-10 text-primary transition-all duration-500 group-hover:text-primary-foreground">
                View Work
              </span>
            </a>
            <a href="#contact" className="neon-glow group relative w-40 rounded-lg bg-secondary/10 px-6 py-3">
              <span className="neon-text relative z-10 text-secondary transition-all duration-500 group-hover:text-secondary-foreground">
                Contact
              </span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32">
        <div className="container mx-auto px-4">
          <div className="glass-card grid gap-12 p-8 md:grid-cols-2 md:gap-16">
            <div className="space-y-6">
              <h2 className="neon-text-intense text-3xl font-bold text-primary">About Me</h2>
              <p className="text-lg text-muted-foreground">
                I am a passionate developer focused on creating cutting-edge digital experiences.
                With expertise in modern web technologies, I bring ideas to life through clean code
                and innovative design solutions.
                As a graduating student, I am always looking for new challenges and opportunities to grow. My current 
                focus is growing my skills in modern web development, building real-life solutions using LLMs and 
                creating engaging user experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                
                <span className="neon-border rounded-full bg-secondary/5 px-4 py-1 text-sm text-secondary">Python</span>
                <span className="neon-border rounded-full bg-primary/5 px-4 py-1 text-sm text-primary">JavaScript</span>
                <span className="neon-border rounded-full bg-primary/5 px-4 py-1 text-sm text-primary">React</span>
                <span className="neon-border rounded-full bg-secondary/5 px-4 py-1 text-sm text-secondary">C++</span>
                <span className="neon-border rounded-full bg-accent/5 px-4 py-1 text-sm text-accent">Django</span>
                <span className="neon-border rounded-full bg-secondary/5 px-4 py-1 text-sm text-secondary">Java</span>
                <span className="neon-border rounded-full bg-primary/5 px-4 py-1 text-sm text-primary">TypeScript</span>
                <span className="neon-border rounded-full bg-primary/5 px-4 py-1 text-sm text-primary">Next.js</span>
                <span className="neon-border rounded-full bg-accent/5 px-4 py-1 text-sm text-accent">Supabase</span>
                <span className="neon-border rounded-full bg-secondary/5 px-4 py-1 text-sm text-secondary">C#</span>
                <span className="neon-border rounded-full bg-primary/5 px-4 py-1 text-sm text-primary">HTML/CSS</span>
                <span className="neon-border rounded-full bg-secondary/5 px-4 py-1 text-sm text-secondary">Cobol</span>
                <span className="neon-border rounded-full bg-accent/5 px-4 py-1 text-sm text-accent">MySQL</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-lg" />
              <div className="glass-card relative aspect-square animate-[float_4s_ease-in-out_infinite]">
                <DeskAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {/* Featured Work Section */}
      <section id="work" className="relative py-32">
        <FeaturedWork />
      </section>
      

      {/* Contact Section */}
      <section id="contact" className="relative py-32">
        <div className="container mx-auto px-4">
          <h2 className="neon-text-intense mb-16 text-center text-4xl font-bold text-primary">Get In Touch</h2>
          <div className="flex justify-center gap-8 mb-12">
            <a
              href="https://github.com/zakelguindi"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-2 px-6 py-3 text-primary hover:text-background hover:bg-primary/90 transition-all duration-500 rounded-md neon-glow"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/zakaryelguindi"
              target="_blank"
              rel="noopener noreferrer" 
              className="glass-card flex items-center gap-2 px-6 py-3 text-primary hover:text-background hover:bg-primary/90 transition-all duration-500 rounded-md neon-glow"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
          <div className="mx-auto max-w-2xl">
            <ContactForm />
          </div>
        </div>
      </section>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="fixed top-0 left-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <Link
            href="/login"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-2 text-2xl font-semibold">
              Zak Login{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              For Zak Only
            </p>
          </Link>
        </div>
      </div>

      
    </main>
  );
} 