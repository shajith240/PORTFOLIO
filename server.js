import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Increase the limit for JSON and URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Serve static files from the dist directory
app.use(express.static('dist', {
    maxAge: '1h',
    etag: true
}));

// Debug endpoint to check file details
app.get('/check-resume', (req, res) => {
    const filePath = join(__dirname, 'resume', 'Lecture 3_Arrays.pdf');
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                error: 'File not found',
                checkedPath: filePath
            });
        }

        const stats = fs.statSync(filePath);
        const firstFewBytes = fs.readFileSync(filePath, { encoding: null, length: 5 });
        
        res.json({
            exists: true,
            size: stats.size,
            fullPath: filePath,
            fileStart: firstFewBytes.toString('hex'),
            directory: fs.readdirSync(dirname(filePath)),
            stats: {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isFile: stats.isFile(),
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack,
            fullPath: filePath
        });
    }
});

// Updated download endpoint with proper error handling and streaming
app.get('/download/resume', (req, res) => {
    const filePath = join(__dirname, 'resume', 'Lecture 3_Arrays.pdf');
    
    try {
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            return res.status(404).send('File not found');
        }

        const stats = fs.statSync(filePath);
        console.log('Starting download. File size:', stats.size, 'bytes');

        // Verify it's actually a PDF by checking magic numbers
        const buffer = Buffer.alloc(5);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 5, 0);
        fs.closeSync(fd);
        
        if (buffer.toString('ascii') !== '%PDF-') {
            console.error('Invalid PDF file');
            return res.status(400).send('Invalid PDF file');
        }

        // Set proper headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `attachment; filename="Lecture 3_Arrays.pdf"`);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Accept-Ranges', 'bytes');

        // Create read stream with proper error handling
        const fileStream = fs.createReadStream(filePath, {
            highWaterMark: 64 * 1024 // 64KB chunks
        });

        // Handle stream errors
        fileStream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).send('Error streaming file');
            }
            fileStream.destroy();
        });

        // Log when streaming starts and ends
        fileStream.on('open', () => console.log('Stream opened'));
        fileStream.on('end', () => console.log('Stream ended'));

        // Pipe the file to response with error handling
        fileStream.pipe(res).on('error', (error) => {
            console.error('Pipe error:', error);
            fileStream.destroy();
        });

    } catch (error) {
        console.error('Error handling download:', error);
        res.status(500).send('Server error');
    }
});

// Alternative download method using sendFile
app.get('/download/resume-alt', (req, res) => {
    const filePath = join(__dirname, 'resume', 'Lecture 3_Arrays.pdf');
    
    res.sendFile(filePath, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Lecture 3_Arrays.pdf"`,
            'Cache-Control': 'no-cache'
        }
    }, (err) => {
        if (err) {
            console.error('SendFile error:', err);
            if (!res.headersSent) {
                res.status(500).send('Error sending file');
            }
        } else {
            console.log('File sent successfully');
        }
    });
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Using EMAIL_PASS as seen in your .env
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    console.log('Received contact form submission:', { name, email, subject });

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    // Email to you (admin)
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    // Confirmation email to sender
    const senderMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank You for Reaching Out',
        text: `
Dear ${name},

Thank you for reaching out through my portfolio website. I truly appreciate your interest and will carefully review your message.

Here are the details of your submission:
Subject: ${subject}
Message: ${message}

I will get back to you as soon as possible. If your request is urgent, please feel free to reply to this email or reach out to me through my LinkedIn profile.

Looking forward to connecting with you.

Best regards,
Shajith Bathina`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <p>Dear ${name},</p>
                
                <p>Thank you for reaching out through my portfolio website. I truly appreciate your interest and will carefully review your message.</p>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                    <p><strong>Here are the details of your submission:</strong></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
                </div>
                
                <p>I will get back to you as soon as possible. If your request is urgent, please feel free to reply to this email or reach out to me through my LinkedIn profile.</p>
                
                <p>Looking forward to connecting with you.</p>
                
                <p>Best regards,<br>Shajith Bathina</p>
            </div>
        `
    };

    try {
        console.log('Attempting to send emails...');
        
        // Send email to admin
        await transporter.sendMail(adminMailOptions);
        console.log('Admin email sent successfully');
        
        // Send confirmation email to sender
        await transporter.sendMail(senderMailOptions);
        console.log('Confirmation email sent to sender');
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully' 
        });
    } catch (error) {
        console.error('Detailed email error:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command
        });
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message: ' + error.message 
        });
    }
});

const PORT = process.env.PORT || 3001; // Changed from 3000 to 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Images directory: ${join(__dirname, 'public', 'images')}`);
});
