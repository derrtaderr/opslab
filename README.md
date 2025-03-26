# AI Ops Lab

AI Ops Lab is a platform designed to help organizations identify and implement AI automation opportunities in their operations. The application combines collaborative whiteboarding through Miro integration with AI-powered guidance and ROI calculation.

## Features

- **Miro Integration**: Collaborate on process mapping, pain point identification, and solution planning using Miro's whiteboarding capabilities.
- **AI Assistant**: Get guidance through the AI automation discovery and planning process with a conversational AI interface.
- **ROI Calculator**: Estimate the potential return on investment for AI automation opportunities with a comprehensive calculator.
- **Template Library**: Access pre-designed templates for common operational mapping and AI planning activities.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk Auth
- **APIs**: Miro API for whiteboarding, OpenAI API for AI assistance
- **State Management**: React hooks and context

## Getting Started

### Prerequisites

- Node.js 18 or newer
- Miro Developer Account
- Clerk Account
- OpenAI API Key (for production)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-ops-lab.git
   cd ai-ops-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the required environment variables:
   ```
   # Clerk Auth Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Miro API Configuration
   NEXT_PUBLIC_MIRO_APP_ID=your_miro_app_id
   MIRO_CLIENT_SECRET=your_miro_client_secret
   MIRO_TEMPLATE_BOARD_ID=your_template_board_id

   # API URLs
   NEXT_PUBLIC_MIRO_API_URL=https://api.miro.com

   # OpenAI Configuration (for production)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Phase 1 Implementation

The current implementation includes:

1. **Authentication**: User login/signup with Clerk
2. **Miro Board Integration**: Display and interaction with Miro boards
3. **AI Chat Interface**: Simple AI guidance for the ops improvement process
4. **ROI Calculator**: Tool to calculate potential savings from AI implementation

## License

[MIT](LICENSE)
