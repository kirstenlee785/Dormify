import { supabase } from './supabaseClient.js';
/*export function getCurrentUser() {
    return supabase.auth.username(); // returns the logged-in user
}
export async function getUsername(userId) {
    const { data, error } = await supabase
        .from('table3')
        .select('username')
        .eq('id', userId)  // Match with the user's ID (from supabase.auth.user())
        .single();  // Get a single record

    if (error) {
        console.error('Error fetching username:', error);
        return null;
    }

    return data.username;
}

 */

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
    loginBtn?.addEventListener("click",async()=> {
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
signupBtn?.addEventListener('click',async()=> {
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
    const { error: insertError } = await supabase.from('table3').insert([
        {
            id: userId,  // Ensuring auth.uid() is linked properly
            user_name: username,
            email: email,
            date: date,
            preference: pref,
        }
    ]);

    if (insertError) {
        document.getElementById("error-msg").textContent = insertError.message;
    } else {
        console.log("User data inserted successfully");
        window.location.href ='homePage.html'
    }


/*
    //const { error: signupError, data } = await supabase.auth.signUp({ email, password });
    const {error: signupError, user} = await supabase.auth.signUp({email, password});
    console.log(user);
    if (signupError) {
        document.getElementById("error-msg").textContent = signupError.message;
    } else {

        const {error: insertError} = await supabase.from('table3').insert([{
            id: user.id, first_name: firstName, last_name: lastName, city: city, email: email, date: date,
            preference: pref,
            region: region
        }]);


        if (insertError) {
            document.getElementById("error-msg").textContent = insertError.message;
        } else {
            console.log(user);
            window.location.href = 'index.html';
        }
    } */


});

//adjust updatebtn
const updateBtn = document.getElementById("update-btn");
updateBtn?.addEventListener("click",async()=>{
    const username = document.getElementById("username").value;

    let updated = {user_name: username}; //collects the data to update the different variables
    const sessions = await supabase.auth.getSession(); // still need to get the session and collect user profile data
    const userProfile = await getUserProfile(sessions);
    const { error: updateError } =  await supabase
        .from('table3')
        .update(updated) //what rows are we updating, and with what?
        .eq('id', userProfile[userProfile.length-1].id) //this is what will change the info connected to the user's profile itself
    if(updateError) {
        document.getElementById("error-msg").textContent = updateError.message;
    } else {
        window.location.href = 'homePage.html'; //will take me back to the display so I can see updated information
    }
})



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
})

const signOutBtn = document.getElementById("out-btn");

signOutBtn?.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error.message);
        alert("Sign out failed!");
    } else {
        console.log("User signed out successfully");
        window.location.href = "login.html"; // Or wherever your login screen is
    }
});

