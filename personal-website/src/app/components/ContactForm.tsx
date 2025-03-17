'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `mailto:zakelguindi@gmail.com?subject=Contact from ${formData.name}&body=${formData.message}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-primary">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-2 border-primary/50 bg-background p-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Your name"
        />        
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-primary">
          Message
        </label>
        <textarea   
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-2 border-primary/50 bg-background p-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Your message here..."
        />
      </div>

      <button
        type="submit"
        className="neon-glow w-full rounded-md bg-primary/90 px-6 py-3 text-background font-medium transition-all duration-500 hover:bg-primary"
      >
        Send Message
      </button>
    </form>
  );
} 