const express = require('express');
const path = require('path');
const app = express();
const port = 3500;
const favicon = require('serve-favicon');
const admin = require('./firebase'); 

// Middleware to parse JSON bodies
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/submit', async (req, res) => {
    const { username, password, cmpname, vat, email, isAccounting, isPayroll, isSales, startDate, endDate } = req.body;

    try {
        const userRef = admin.db.ref('users');

        
        const existingUserSnapshot = await userRef.orderByChild('username').equalTo(username).once('value');
        if (existingUserSnapshot.exists()) {
            return res.status(400).send('Username already exists.');
        }

        
        const existingVatSnapshot = await userRef.orderByChild('vat').equalTo(vat).once('value');
        if (existingVatSnapshot.exists()) {
            return res.status(400).send('VAT is already in use.');
        }

       
        await userRef.child(username).set({
            email,
            isPayroll: String(isPayroll),
            password,
            cmpname,
            vat,
            isAccounting: String(isAccounting),
            isSales: String(isSales),
            startDate,
            endDate
        });
        res.send('User successfully registered.');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error saving user data.');
    }
});


app.post('/updateEndDate', async (req, res) => {
    const { username, password, endDate } = req.body;

    try {
        const userRef = admin.db.ref('users');
        const snapshot = await userRef.orderByChild('username').equalTo(username).once('value');

        let userFound = false;

        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (userData.password === password) {
                userFound = true;
                childSnapshot.ref.update({ endDate });
                return res.send('End date updated successfully.');
            }
        });

        if (!userFound) {
            res.status(404).send('Incorrect username or password.');
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error updating end date.');
    }
});


app.get('/getEndDate', async (req, res) => {
    const { username } = req.query;

    try {
        const userRef = admin.db.ref('users');
        const snapshot = await userRef.orderByChild('username').equalTo(username).once('value');

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                return res.json({ endDate: userData.endDate });
            });
        } else {
            res.status(404).json({ message: 'End date not found.' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Error retrieving end date.' });
    }
});


app.get('/users', async (req, res) => {
    try {
        const userRef = admin.db.ref('users');
        const snapshot = await userRef.once('value');

        if (snapshot.exists()) {
            const users = [];
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                users.push({ username: childSnapshot.key, ...userData });
            });
            return res.json(users);
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});


app.patch('/users/:username/clearNotifications', async (req, res) => {
    const { username } = req.params;

    try {
        const userRef = admin.db.ref('users').child(username);
        const snapshot = await userRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'User not found' });
        }
        await userRef.update({ readNotifications: null });
        res.status(200).json({ message: 'Notifications cleared successfully' });
    } catch (err) {
        console.error('Error clearing notifications:', err);
        res.status(500).json({ message: 'Error clearing notifications' });
    }
});


app.delete('/users/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userRef = admin.db.ref('users').child(username);
        await userRef.remove();
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
