import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        return false;
    }
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export const db = {
    getUserByEmail: (email) => {
        const users = readUsers();
        return users.find(u => u.email === email);
    },

    createUser: ({ email, password, name }) => {
        const users = readUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: crypto.randomUUID(),
            email,
            password: hashPassword(password),
            name: name || email.split('@')[0],
            image: '',
            plan: 'free',
            tasksUsedToday: 0,
            tasksResetDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeUsers(users);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    validatePassword: (user, password) => {
        return user.password === hashPassword(password);
    },

    updateUser: (email, updates) => {
        const users = readUsers();
        const index = users.findIndex(u => u.email === email);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            writeUsers(users);
            const { password: _, ...userWithoutPassword } = users[index];
            return userWithoutPassword;
        }
        return null;
    }
};
