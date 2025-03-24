# AI Ops Lab

AI Ops Lab is a collaborative platform for operations teams to discover high-impact AI opportunities and estimate ROI. The platform integrates with Miro boards to provide real-time collaboration for teams working through the AI discovery process.

## Key Features

- 🤝 **Team Collaboration**: Create teams and invite members to work together on shared Miro boards
- 🎯 **Process Mapping**: Visualize your current operations and identify bottlenecks
- 💡 **AI Opportunity Discovery**: Identify where AI can make the most impact
- 💰 **ROI Calculator**: Estimate potential savings and business impact
- 🤖 **AI Assistant**: Get contextual help and guidance throughout the process
- 📊 **PDF Export**: Generate comprehensive summary reports with implementation plans

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **State Management**: Zustand, React Query
- **Authentication**: NextAuth.js
- **Database**: Supabase
- **Integrations**: Miro REST API, OpenAI API
- **Caching**: Redis

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Miro developer account
- A Supabase account
- An OpenAI API key (for AI assistant feature)

## Getting Started

### Setup Miro Integration

1. Create a new Miro app at https://miro.com/app/settings/user-profile/apps
2. Set the following:
   - App URL: http://localhost:3000
   - Redirect URI: http://localhost:3000/api/auth/callback/miro
   - Request permissions: boards:read, boards:write, boards:share
3. Note your Client ID and Client Secret
4. Create a board to serve as your template
5. Copy the board ID from the URL: https://miro.com/app/board/[BOARD_ID]/

### Setup Supabase

1. Create a new Supabase project
2. Note your Supabase URL, anon key, and service role key
3. Use the provided SQL migrations in the `supabase/migrations` folder

### Local Setup

1. Clone the repository
```bash
git clone https://github.com/derrtaderr/opslab.git
cd opslab
```

2. Install dependencies
```bash
npm install
```

3. Copy the example environment file
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:
```
NEXT_PUBLIC_MIRO_APP_ID=your_miro_client_id
MIRO_CLIENT_SECRET=your_miro_client_secret
NEXT_PUBLIC_MIRO_BOARD_ID=your_template_board_id

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

5. Run database setup
```bash
node supabase/setup.js
```

6. Start the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Team Collaboration Features

- **Team Creation**: Create a new team workspace with its own Miro board (duplicated from template)
- **Invite System**: Generate and share unique invite codes for team members
- **Shared Workspace**: All team members collaborate on the same Miro board
- **Role Management**: Set roles for team members (owner, member)

## Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/               # Authentication endpoints
│   ├── boards/             # Board management endpoints
│   └── teams/              # Team management endpoints
├── components/             # React components
│   ├── InviteModal.tsx     # Modal for sharing invite codes
│   ├── MiroBoard.tsx       # Miro board embedding component
│   └── TeamModal.tsx       # Modal for team creation/joining
├── config/                 # Configuration files
├── lib/                    # Shared utilities
│   ├── services/           # Business logic services
│   ├── utils/              # Helper functions
│   ├── miro.ts             # Miro API utilities
│   └── supabase.ts         # Supabase client
├── providers/              # React context providers
└── types/                  # TypeScript type definitions

cursor-rules/               # Project documentation
supabase/                   # Supabase setup and migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
