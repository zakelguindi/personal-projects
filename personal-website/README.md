# Modern Portfolio Website

A modern, responsive personal portfolio website built with Next.js 14, Tailwind CSS, and Supabase. Features a clean UI, dark mode support, and an admin panel for content management.

## Features

- 🎨 Modern and responsive design
- 🌓 Dark mode support
- 🔐 Admin authentication via Supabase
- 📝 Dynamic project management
- 🎯 SEO optimized
- 📱 Mobile-friendly
- ♿ Accessible UI components via Shadcn UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database/Auth**: Supabase
- **Deployment**: Vercel (recommended)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd personal-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the `.env.local` file with your Supabase credentials:
   - Create a Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # App router pages
├── components/          # Reusable components
├── lib/                 # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## Database Schema

The Supabase database includes the following tables:

### Projects
- id: uuid (primary key)
- title: text
- description: text
- technologies: text[]
- image_urls: text[]
- github_url: text
- live_url: text
- created_at: timestamp
- updated_at: timestamp

## Deployment

1. Create a Vercel account at https://vercel.com
2. Connect your repository
3. Add your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project as a template for your own portfolio! 