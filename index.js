const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const FLAG = 'flag{Cornell_File_Upload_Pwn}';

// -------------------- LOGIN 1: BAIT LOGIN --------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login1.html'));
});

app.post('/login1', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        res.redirect('/login2');
    } else {
        res.send(`<p>Wrong username or password. Try again!</p><a href="/">Go back</a>`);
    }
});

// -------------------- LOGIN 2: CLIENT-SIDE CODE HACK --------------------
app.get('/login2', (req, res) => {
    const password = process.env.LEVEL2_PASSWORD;

    res.send(`
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actual Login</title>
    </head>

    <body>
        <h1>Welcome to Level 2</h1>
        <p>Congratulations on making it this far! But now, the real fun begins. 😉</p>

        <form action="/login2" method="POST">
            <label>Username: </label><input type="text" name="username" required><br>
            <label>Password: </label><input type="password" name="password" required><br>
            <input type="submit" value="Login">
        </form>

        <p><i>Hint: Real hackers inspect client-side code. Remember, Inspect Element is not the only tool to play around with client-side FUNCTIONS.</i></p>

        <!-- Inline JavaScript that reveals the password using the environment variable -->
        <script>
            function revealPassword() {
                console.log("Hint: The password is: " + "${password}");
            }
        </script>
    </body>

    </html>
    `);
});

app.post('/login2', (req, res) => {
    const { username, password } = req.body;
    const correctPassword = process.env.LEVEL2_PASSWORD;

    if (username === 'admin' && password === correctPassword) {
        res.redirect('/upload');
    } else {
        res.send(`<p>Wrong username or password. Try again!</p><a href="/login2">Go back</a>`);
    }
});

// -------------------- FINAL CHALLENGE: FILE UPLOAD VULNERABILITY --------------------
// -------------------- FINAL CHALLENGE: FAKE FILE UPLOAD WITH PHP CODE VALIDATION --------------------
app.get('/upload', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FLAG</title>
    </head>

    <body>
        <h1>Final Challenge: Craft Your PHP File</h1>
        <p>To get the flag, craft a valid PHP script that echoes the hidden variable.</p>
        <p><strong>Hint:</strong> The PHP code must start and end correctly. It should also have a specific line since there is really just one way to solve this.</p>

        <form action="/upload" method="POST">
            <label for="phpCode">Enter your PHP script:</label><br>
            <textarea id="phpCode" name="phpCode" rows="10" cols="50" required></textarea><br><br>
            <input type="submit" value="Upload">
        </form>
    </body>

    </html>
    `);
});

app.post('/upload', (req, res) => {
    const phpCode = req.body.phpCode.trim();

    // Basic validation: Check if the code starts with <?php and ends with ?>
    if (phpCode.startsWith('<?php') && phpCode.endsWith('?>')) {
        // Check if the code contains "echo $FLAG;"
        if (phpCode.includes('echo $FLAG;')) {
            return res.send(`
                <p>Flag revealed: ${FLAG}</p>
                <p>Congratulations! You successfully crafted the exploit.</p>
            `);
        } else {
            return res.send(`
                <p>Your PHP script is valid, but it didn't echo the flag correctly.</p>
                <a href="/upload">Try again</a>
            `);
        }
    } else {
        return res.send(`
            <p>Invalid PHP script. The script must start with <code>&lt;?php</code> and end with <code>?&gt;</code>.</p>
            <a href="/upload">Go back and try again</a>
        `);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
