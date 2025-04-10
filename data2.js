

document.addEventListener("DOMContentLoaded", async () => {
    const profileDataDiv = document.getElementById("profile-data");

    if (!profileDataDiv) {
        console.error("❌ Error: Element with id 'profile-data' not found.");
        return;
    }



    async function getUserProfile() {
        const {data: {user}, error} = await supabase.auth.getUser();
        if (error || !user) {
            console.error("Error fetching session or user not logged in.");
            return null;
        }

        // Get profile from the database
        const {data: userProfile, error: profileError} = await supabase
            .from('table3')
            .select('*')
            .eq('id', user.id);

        if (profileError) {
            console.log('Error fetching user data:', profileError);
            return null;
        }

        return userProfile;
    }


    async function fetchProfile() {
        const sessions = await supabase.auth.getSession();
        const userProfile = await getUserProfile(sessions);
        if (userProfile) {
            console.log('User Profile:', userProfile);
            profileDataDiv.innerHTML = `<p><strong>First Name:</strong> ${userProfile[0].first_name}</p>` +
                `<p><strong>Last Name:</strong> ${userProfile[0].last_name}</p>` +
                `<p><strong>City:</strong> ${userProfile[0].city}</p>` +
                `<p><strong>Email:</strong> ${userProfile[0].email}</p>`;
        } //will store the user's information as such
    }

    fetchProfile().catch((error) => {
        console.log('Error:', error);
    });
});