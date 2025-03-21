const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Files to process
const files = ['popup.js', 'background.js'];

// Environment variables to inject
const envVars = {
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
};

// Process each file
files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace environment variables
    Object.entries(envVars).forEach(([key, value]) => {
        const regex = new RegExp(`const ${key} = '.*?';`, 'g');
        content = content.replace(regex, `const ${key} = '${value}';`);
    });

    // Write the processed file
    fs.writeFileSync(filePath, content);
    console.log(`Processed ${file}`);
}); 