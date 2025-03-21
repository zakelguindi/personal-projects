# Coffee Shop Finder Chrome Extension

A Chrome extension that helps users discover coffee shops and niche hangout spots in their city. The extension provides location-based search, filtering options, and a quick feedback system.

## Features

- 🔍 Location-based search using Google Places API
- 🎯 10+ filtering options (Wi-Fi, pet-friendly, vegan, etc.)
- 👍 One-click feedback system
- 📱 Clean, responsive UI
- 💾 Local storage for user preferences
- 🔄 Background processing for better performance

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `coffeeshopextension` directory

## Configuration

Before using the extension, you need to set up your API keys:

1. Get a Google Places API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a Supabase project and get your project URL and anon key
3. Update the following files with your API keys:
   - `popup.js`: Update `GOOGLE_PLACES_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`
   - `background.js`: Update the same keys

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter a location or use your current location
3. Use the filters to find coffee shops matching your preferences
4. Click on a result to view more details
5. Give feedback on places you've visited

## Development

### Project Structure

```
coffeeshopextension/
├── manifest.json      # Extension configuration
├── popup.html        # Main UI
├── popup.js         # UI logic and API calls
├── background.js    # Background tasks and caching
├── styles.css       # Styling
└── icons/          # Extension icons
```

### Building for Production

1. Update the version number in `manifest.json`
2. Test the extension thoroughly
3. Package the extension:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `coffeeshopextension` directory
   - Click "Pack Extension"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Future Enhancements

- [ ] Sponsored placements
- [ ] Search engine partnerships
- [ ] Premium features
- [ ] Mobile app version
- [ ] Social features
- [ ] Advanced filtering
- [ ] Offline support 