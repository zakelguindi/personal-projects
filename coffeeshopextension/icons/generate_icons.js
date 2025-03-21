const fs = require('fs');
const { createCanvas } = require('canvas');

// Create icons directory if it doesn't exist
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// Generate icons of different sizes
[16, 48, 128].forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(0, 0, size, size);

    // Draw coffee cup
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
    ctx.fill();

    // Draw handle
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size/8;
    ctx.beginPath();
    ctx.arc(size/2 + size/4, size/2, size/4, -Math.PI/2, Math.PI/2);
    ctx.stroke();

    // Save the icon
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icons/icon${size}.png`, buffer);
}); 