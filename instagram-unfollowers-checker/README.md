# Instagram Unfollowers Checker

A simple web application that helps you identify which Instagram accounts you follow that don't follow you back. Built with React and TailwindCSS.

## Features

- Upload Instagram followers and following data in JSON format
- Automatically parse and compare the data
- Display a list of users who don't follow you back
- Copy results to clipboard
- Clean, modern UI with TailwindCSS
- Fully client-side processing (no data sent to servers)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd instagram-unfollowers-checker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Request your Instagram data:
   - Go to Instagram's Data Download Page
   - Request your data in JSON format
   - Wait for the email with your data
   - Download and unzip the archive

2. Upload your data:
   - Find the followers and following JSON files in the downloaded archive
   - Upload them using the respective buttons in the app
   - The app will automatically process the data and show you who doesn't follow you back

3. View and copy results:
   - Scroll through the list of users who don't follow you back
   - Use the "Copy to Clipboard" button to copy all usernames

## Development

This project is built with:
- React (with Vite)
- TailwindCSS
- Heroicons

## License

MIT
