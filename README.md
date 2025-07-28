# Pulumi UI

A modern web interface for visualizing self-hosted Pulumi state, built with Nuxt 4, Vue 3, and Nitro.

## Getting Started

### Prerequisites

- Node.js 22+ (for latest performance and features)
- pnpm (recommended) or npm
- Pulumi state files (local or cloud storage)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pulumi-ui
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and set your Pulumi state URI:

```env
PULUMI_STATE_URI=file:///path/to/your/pulumi/state
# Cloud storage support coming soon:
# PULUMI_STATE_URI=s3://your-bucket/pulumi-state
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` (or the next available port)

### Building for Production

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/projects` - List all projects and their stacks
- `GET /api/projects/{projectName}/stacks/{stackName}` - Get detailed stack information

## Configuration

### Environment Variables

- `PULUMI_STATE_URI`: URI to your Pulumi state (file://, s3://, gs://, etc.)
- `API_BASE`: Base URL for API endpoints (default: `/api`)

### Nuxt Configuration

The `nuxt.config.ts` file contains:

- SSR configuration
- Module imports (Nuxt UI, Tailwind CSS)
- Runtime configuration
- Nitro server settings

## Deployment

### Node.js Server

```bash
pnpm build
node .output/server/index.mjs
```

### Static Hosting

```bash
pnpm generate
# Deploy the .output/public directory
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
