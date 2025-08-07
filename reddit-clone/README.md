# Reddit Clone

A modern Reddit clone built with Next.js 14, Supabase, and Shadcn UI. Features include user authentication, post creation, voting, commenting, and real-time updates.

## 🚀 Features

- **Authentication**: Sign up, sign in, and user management with Supabase Auth
- **Post Management**: Create, view, and vote on posts with text content or external links
- **Comments System**: Nested comments with voting functionality
- **Real-time Voting**: Upvote and downvote posts and comments
- **Modern UI**: Beautiful, responsive design with Shadcn UI components
- **Subreddit Support**: Organize posts by subreddit categories
- **User Profiles**: User avatars and profile information

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Supabase (Database, Auth, Real-time)
- **Deployment**: Vercel
- **Database**: PostgreSQL (via Supabase)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Vercel account for deployment ([vercel.com](https://vercel.com))

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd reddit-clone
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. In the SQL Editor, run the schema from `supabase-schema.sql`:

```sql
-- Copy and paste the entire content of supabase-schema.sql
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update the values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── create/            # Create post page
│   ├── posts/[id]/        # Post detail page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── comments/          # Comment system components
│   ├── layout/            # Layout components (navbar, etc.)
│   ├── posts/             # Post-related components
│   └── ui/                # Shadcn UI components
└── lib/                   # Utility functions and configurations
    ├── auth-context.tsx   # Authentication context
    ├── supabase.ts        # Supabase client configuration
    └── utils.ts           # Utility functions
```

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **posts**: Post content, metadata, and vote counts
- **comments**: Nested comments with voting
- **votes**: User votes on posts and comments

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Configure environment variables in Vercel:
   - Go to your project settings
   - Add the same environment variables from your `.env.local`

4. Deploy:
   ```bash
   npm run build  # Test build locally first
   ```

The application will be automatically deployed and available at your Vercel URL.

### Environment Variables for Production

Make sure to set these environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Components**: Add to appropriate directory in `src/components/`
2. **New Pages**: Add to `src/app/` following App Router conventions
3. **Database Changes**: Update `supabase-schema.sql` and run migrations
4. **Styling**: Use Tailwind CSS classes and Shadcn UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **Authentication not working**: Check your Supabase URL and keys
2. **Database errors**: Ensure you've run the SQL schema in Supabase
3. **Build failures**: Check for TypeScript errors and missing dependencies

### Getting Help

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Read the [Supabase Documentation](https://supabase.com/docs)
- Review [Shadcn UI Documentation](https://ui.shadcn.com)

## 🎯 Roadmap

- [ ] Search functionality
- [ ] User profiles and karma system
- [ ] Subreddit creation and management
- [ ] Image and video upload support
- [ ] Mobile app with React Native
- [ ] Real-time notifications
- [ ] Advanced moderation tools

---

Built with ❤️ using Next.js, Supabase, and Shadcn UI
