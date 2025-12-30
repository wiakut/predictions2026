# Predictions for 2026

A beautiful, production-ready Next.js application that generates personalized predictions for the year 2026. Optimized for Instagram Stories and mobile-first experiences.

## Features

- 🎲 **Random Prediction Generation** - Get a unique prediction each time
- 🔗 **Permanent Links** - Shareable URLs with prediction IDs (`?p=<id>`)
- 📱 **Mobile-First Design** - Optimized for Instagram Stories traffic
- 🎨 **Modern UI** - Minimalist design with soft gradients and smooth animations
- 📋 **Copy to Clipboard** - Easy sharing functionality
- 🔗 **Web Share API** - Native sharing on supported devices
- 🛡️ **Type-Safe** - Full TypeScript support
- 📦 **Flexible Data Format** - Supports both string arrays and object arrays

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## Project Structure

```
predictions2026/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main page component
├── components/
│   └── PredictionCard.tsx   # Prediction display card component
├── src/
│   ├── data/
│   │   └── predictions.json  # Predictions data file
│   └── lib/
│       └── predictions.ts   # Prediction utilities and normalization
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd predictions2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Data Format

The application supports two JSON formats for predictions:

### Format 1: Array of Strings
```json
["Prediction 1", "Prediction 2", "Prediction 3"]
```

### Format 2: Array of Objects
```json
[
  { "text": "Prediction 1" },
  { "text": "Prediction 2", "id": 2 }
]
```

### Format 3: Object with Predictions Array
```json
{
  "predictions": ["Prediction 1", "Prediction 2"]
}
```

The current `src/data/predictions.json` uses Format 3 with objects containing `id` and `text` fields.

## Vercel Deployment

Deploying to Vercel is quick and easy! Here are two methods:

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in (or create an account)
   - Click **"Add New Project"**
   - Import your Git repository
   - Vercel will auto-detect Next.js - no configuration needed!
   - Click **"Deploy"**

3. **Wait for deployment** (usually takes 1-2 minutes)

4. **Access your site:**
   - Vercel will provide a URL like: `https://predictions2026.vercel.app`
   - Every push to your main branch will automatically trigger a new deployment

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts to log in
   - Confirm project settings (Vercel auto-detects Next.js)
   - Deploy!

3. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Configuration (Usually Not Needed)

Vercel automatically detects Next.js projects. If you need to configure manually:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Node.js Version**: 18.x or higher (auto-detected)

### Automatic Deployments

Once connected to a Git repository:
- ✅ Every push to `main` branch = Production deployment
- ✅ Every push to other branches = Preview deployment
- ✅ Pull requests = Preview deployment with unique URL

### Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Troubleshooting

- **Build fails?** Check that all dependencies are in `package.json`
- **Environment variables?** Add them in Project Settings → Environment Variables
- **Need to rebuild?** Go to Deployments → Click "Redeploy"

## Adding Link to Instagram Story

### Method 1: Using Instagram's Link Sticker

1. **Create your Story:**
   - Open Instagram app
   - Swipe right or tap the camera icon
   - Take a photo/video or select from gallery

2. **Add Link Sticker:**
   - Tap the sticker icon (square smiley face)
   - Select "Link" sticker
   - Enter your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
   - Position and resize the sticker as desired
   - Tap "Done" and share your story

### Method 2: Using Text with URL

1. **Create your Story** (same as above)

2. **Add Text:**
   - Tap the "Aa" icon to add text
   - Type something like "Get your 2026 prediction 👆"
   - Position it near the top where users can tap

3. **Add Link Sticker:**
   - Add a Link sticker below the text
   - Enter your Vercel URL
   - The sticker will be clickable for viewers

### Method 3: Direct Link in Bio

1. Add your Vercel URL to your Instagram bio
2. In your story, mention "Link in bio" with an arrow pointing down
3. Users can tap your profile to access the link

### Best Practices

- **Use a short, memorable URL** - Consider using a custom domain
- **Test the link** - Make sure it works on mobile devices
- **Add visual cues** - Use arrows or "Swipe up" text to guide users
- **Keep it simple** - One clear call-to-action per story

## Customization

### Changing Predictions

Edit `src/data/predictions.json` with your own predictions. The app will automatically handle the format.

### Styling

Modify `app/globals.css` and component files to customize colors, fonts, and animations.

### Metadata

Update `app/layout.tsx` to change the page title and description.

## License

This project is open source and available for personal and commercial use.

