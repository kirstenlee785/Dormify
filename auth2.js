import { supabase } from './supabaseClient.js';

// ======== Session Check on Page Load =========
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("Initial session check on page load:", session);

    if (error) {
        console.error("Error getting session:", error);
    }

    supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state change:", event, session);
    });
});

// ======== Login =========
const loginBtn = document.getElementById("loginBtn");
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (loginError) {
        console.error("Login error:", loginError.message);
        document.getElementById("error-msg").textContent = loginError.message;
        return;
    }

    console.log("✅ User logged in:", loginData.user);

    // Important: Now we get user info immediately
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("❌ Error fetching user after login:", userError);
        document.getElementById("error-msg").textContent = "Could not fetch user info.";
        return;
    }

    console.log("✅ Authenticated user:", user);

    // Fetch preference from table3
    const { data: prefData, error: prefError } = await supabase
        .from('table3')
        .select('preference')
        .eq('id', user.id)
        .single();

    if (prefError || !prefData) {
        console.error("❌ Error fetching preference:", prefError);
        document.getElementById("error-msg").textContent = "Could not fetch user preference.";
        window.location.href = 'homePage.html'; // fallback
        return;
    }

    const preference = prefData.preference;
    console.log("✅ Fetched preference:", preference);

    // Store preference in localStorage
    localStorage.setItem('userPreference', preference);

    // Redirect user based on preference
    redirectBasedOnPreference(preference);
});


// ======== Signup =========
const signupBtn = document.getElementById("signup-btn");
signupBtn?.addEventListener('click', async () => {
    console.log("Signup button clicked!");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    const date = document.getElementById("weekChoice").value;
    const pref = document.getElementById("decor").value;

    // Sign up the user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signupError || !signupData.user) {
        document.getElementById("error-msg").textContent = signupError?.message || "Signup failed.";
        return;
    }

    const userId = signupData.user.id; // Get the authenticated user ID
    console.log("✅ New User ID:", userId);
    console.log("✅ Selected preference at signup:", pref);

    // Insert user info into your table3
    const { error: insertError } = await supabase.from('table3').insert([{
        id: userId,
        user_name: username,
        email: email,
        date: date,
        preference: pref,
    }]);

    if (insertError) {
        document.getElementById("error-msg").textContent = insertError.message;
        return;
    }

    console.log("✅ User data inserted successfully into table3.");

    // Very Important: Store preference in localStorage immediately
    localStorage.setItem('userPreference', pref);

    // Now just take them to the homepage
    window.location.href = 'homePage.html';
});


// ======== Update Profile =========
const updateBtn = document.getElementById("update-btn");
updateBtn?.addEventListener("click", async () => {
    const username = document.getElementById("username").value;

    let updated = { user_name: username };
    const { data: { user } } = await supabase.auth.getUser();
    const { error: updateError } = await supabase
        .from('table3')
        .update(updated)
        .eq('id', user.id);

    if (updateError) {
        document.getElementById("error-msg").textContent = updateError.message;
    } else {
        window.location.href = 'homePage.html';
    }
});

// ======== Redirect Based on Preference =========
function redirectBasedOnPreference(pref) {
    const trimmedPref = pref?.trim();
    if (trimmedPref === 'Masculine') {
        window.location.href = 'Masculine.html';
    } else if (trimmedPref === 'Feminine') {
        window.location.href = 'Feminine.html';
    } else {
        window.location.href = 'homePage.html'; // fallback
    }
}

// ======== Preference Button =========
const travelBtn = document.getElementById("pref-btn");
travelBtn?.addEventListener('click', async () => {
    const preference = localStorage.getItem('userPreference');

    if (!preference) {
        alert('Preference not found. Please login again.');
        window.location.href = 'login.html'; // force re-login if broken
        return;
    }

    console.log('Redirecting based on preference (localStorage):', preference);

    redirectBasedOnPreference(preference);
});


// ======== Sign Out =========
const signOutBtn = document.getElementById("out-btn");
signOutBtn?.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error.message);
        alert("Sign out failed!");
    } else {
        console.log("✅ User signed out successfully");
        window.location.href = "login.html";
    }
});

/*
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("Initial session check on page load:", session);

    if (error) {
        console.error("Error getting session:", error);
    }

    supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state change:", event, session);
    });
});

//Login //listening for login button in the index
const loginBtn = document.getElementById("loginBtn");
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    console.log(email);
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login error:", error.message);
        document.getElementById("error-msg").textContent = error.message;
    } else {
        console.log("User logged in:", data.user);
        window.location.href = 'homePage.html'; // redirect on successful login
    }
});

//Signup
const signupBtn = document.getElementById("signup-btn");
signupBtn?.addEventListener('click', async () => {
    console.log("Signup button clicked!");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email, "Password:", password);
    const username = document.getElementById("username").value;
    const date = document.getElementById("weekChoice").value;
    const pref = document.getElementById("decor").value;

    // Sign up the user
    const { data, error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError || !data.user) {
        document.getElementById("error-msg").textContent = signupError?.message || "Signup failed.";
        return;
    }

    const userId = data.user.id; // Get the authenticated user ID

    console.log("New User ID:", userId); // Debugging - Check if ID is captured
    console.log("Selected preference at signup:", pref);

    // Insert user data into table3
    const { error: insertError } = await supabase.from('table3').insert([{
        id: userId,  // Ensuring auth.uid() is linked properly
        user_name: username,
        email: email,
        date: date,
        preference: pref,
    }]);

    if (insertError) {
        document.getElementById("error-msg").textContent = insertError.message;
    } else {
        console.log("User data inserted successfully");
        window.location.href = 'homePage.html';
        console.log(username);
        console.log(email);
    }
});

// Update profile
const updateBtn = document.getElementById("update-btn");
updateBtn?.addEventListener("click", async () => {
    const username = document.getElementById("username").value;

    let updated = { user_name: username }; //collects the data to update the different variables
    const { data: { user } } = await supabase.auth.getUser(); // Get user profile data
    const { error: updateError } = await supabase
        .from('table3')
        .update(updated) // Update user profile
        .eq('id', user.id); // Use the current user's ID

    if (updateError) {
        document.getElementById("error-msg").textContent = updateError.message;
    } else {
        window.location.href = 'homePage.html'; // Redirect to homePage after successful update
    }
});

/*
// Fetch user profile
async function getUserProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        console.error("Error fetching session or user not logged in.");
        return null;
    }

    // Get profile from the database
    const { data: userProfile, error: profileError } = await supabase
        .from('table3')
        .select('*')
        .eq('id', user.id);

    if (profileError) {
        console.log('Error fetching user data:', profileError);
        return null;
    }

    return userProfile;
}

// Fetch user profile data to display
document.addEventListener("DOMContentLoaded", async () => {
    const profileDataDiv = document.getElementById("profile-data");

    if (!profileDataDiv) {
        console.error("❌ Error: Element with id 'profile-data' not found.");
        return;
    }

    async function fetchProfile() {
        const userProfile = await getUserProfile();
        if (userProfile) {
            console.log('User Profile:', userProfile);
            profileDataDiv.innerHTML = `
                <p><strong>Username:</strong> ${userProfile[0].user_name}</p>
                <p><strong>Email:</strong> ${userProfile[0].email}</p>
                <p><strong>Move-in Date:</strong> ${userProfile[0].date}</p>
                <p><strong>Preference:</strong> ${userProfile[0].preference}</p>
            `;
        }
    }

    fetchProfile().catch((error) => {
        console.log('Error:', error);
    });
});
*/

// Preference-based redirection
/*
const travelBtn = document.getElementById("pref-btn");
travelBtn?.addEventListener('click', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Session check on pref-btn click:", session);
    if (!session) {
        alert('Please log in first.');
        return;
    }

    const user = session.user;
    console.log("User from session:", user);

    const { data, error } = await supabase
        .from('table3')
        .select('preference')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching preference:', error);
        alert('Could not fetch preference.');
        return;
    }

    const preference = data.preference?.trim();
    console.log('Redirecting based on preference:', preference);

    if (preference === 'Masculine') {
        window.location.href = 'Masculine.html';
    } else if (preference === 'Feminine') {
        window.location.href = 'Feminine.html';
    } else {
        alert('Preference not set.');
    }
});

// Sign out button
const signOutBtn = document.getElementById("out-btn");
signOutBtn?.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error.message);
        alert("Sign out failed!");
    } else {
        console.log("User signed out successfully");
        window.location.href = "login.html"; // Redirect to login page after sign out
    }
});
*/