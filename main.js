/*import { getCurrentUser, getUsername } from './auth.js';

async function loadHomepage() {
    // Get the current logged-in user
    const user = getCurrentUser();

    if (user) {
        const username = await getUsername(user.id); // Get the username from Supabase
        document.getElementById('welcome-msg').textContent = `Welcome, ${username}!`;  // Display username
    } else {
        document.getElementById('welcome-msg').textContent = 'Welcome, Guest!';  // Fallback if no user is logged in
    }
}

loadHomepage();

 */