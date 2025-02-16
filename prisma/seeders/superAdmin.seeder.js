const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const { createCanvas } = require('canvas');
const readline = require('readline');
const prisma = new PrismaClient();

// Helper function to ask for user input
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer.toLowerCase());
        });
    });
}

async function seedSuperAdmin() {
    const email = 'shopifytesting786@gmail.com';
    const password = 'Password!23';
    const name = 'Shopify Testing';

    const hashedPassword = await bcrypt.hash(password, 10);

    const firstLetter = name.charAt(0).toUpperCase();
    const imageName = `${firstLetter}.png`;
    const imageDir = path.join(__dirname, 'backend','src','public', 'profileNameImage');
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }
    const imagePath = path.join(imageDir, imageName);
    if (!fs.existsSync(imagePath)) {
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');

        // Fill the background with blue
        ctx.fillStyle = '#00AEEF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the first letter in white
        ctx.fillStyle = '#FF6B6B';
        ctx.font = '100px sans-serif'; // Font size and style
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

        // Save the image to the file system
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(imagePath, buffer);
    }

    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            console.log('Super Admin already exists!');
            const answer = await askQuestion('Do you want to update the existing Super Admin? (y/n): ');

            if (answer === 'y') {
                await prisma.user.update({
                    where: { email },
                    data: {
                        password: hashedPassword,
                        name,
                        role: 'ADMIN',
                        status: 'ACTIVE',
                        profile: `/public/profileNameImage/${imageName}`,
                        emailVerifiedAt: new Date(),
                    },
                });
                console.log('Super Admin updated successfully!');
            } else {
                console.log('No changes were made.');
            }
        } else {
            // Create a new Super Admin
                await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        role: 'ADMIN',
                        status: 'ACTIVE',
                        profile: `/public/profileNameImage/${imageName}`,
                    },
                });
                console.info('Super Admin created successfully!');
        
        }
    } catch (error) {
        console.error('Error seeding Super Admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = seedSuperAdmin;
