document.addEventListener("DOMContentLoaded", () => {
    const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function uploadProfile() {
        var fileInput = document.getElementById("profileFile");
        var file = fileInput.files[0];
        var user_id = sessionStorage.getItem('activeUser');

        if (file) {
            const filePath = `profile-pictures/${user_id}/${file.name}`;

            const { data: fileData, error: fileError } = await supabase.storage
                .from("forum-files")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (fileError) {
                alert("Error upload picture: " + error.message);
                console.log(error);
                return;
            } else {
                await deleteOldProfile();

                const { data, error } = await supabase
                    .from("users")
                    .update({
                        file_path: filePath,
                    })
                    .eq("id", user_id);
            }
        } else {
            return;
        }
    }

    async function deleteOldProfile() {
        const { data, error } = await supabase
            .from("users")
            .select("id, file_path")
            .eq("id", sessionStorage.getItem('activeUser'))
            .single();

        if(error){
            console.error('Error deleting old profile:', error);
        }

        if(data.file_path){
            const {data: fileData, error: fileError} = await supabase
            .storage
            .from("forum-files")
            .remove([data.file_path]);

            if(fileError){
                console.error(fileError.message);
            } else{
                console.log("berhasil");
            }
        } else{
            return;
        }
    }

    async function updateProfile() {
        var username = document.getElementById("usernameText").value;
        var user_id = sessionStorage.getItem('activeUser');
        var usernameInput = document.getElementById("usernameText");

        if (username.length > 10 || username === "") {
            usernameInput.classList.add('is-invalid');
            return;
        } else {
            document.getElementById('loading-animation').classList.remove('d-none');
            const { data, error } = await supabase
                .from("users")
                .update({
                    username: username,
                })
                .eq("id", user_id);

            if (error) {
                alert("Error update profile: " + error.message);
                console.log(error);
                return;
            }

            await uploadProfile();
        }

        window.location.href = "../pages/profilepage.html"
    }

    async function showProfilePicture() {
        var user_id = sessionStorage.getItem('activeUser');

        const { data, error } = await supabase
            .from("users")
            .select("id, file_path")
            .eq("id", user_id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
            return;
        }

        const updateBody = document.getElementById("updateBody");
        updateBody.innerHTML = "";

        const postDiv = document.createElement("div");
        let imgTag = "";

        if (data.file_path) {
            const imgUrl = supabase.storage
                .from("forum-files")
                .getPublicUrl(data.file_path);
            imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
        } else {
            imgTag = `<img src="../assets/profile.png" alt="Uploaded Image" class="img-fluid">`;
        }

        postDiv.innerHTML = `<div class="profile-picture text-center">${imgTag}</div>`;

        updateBody.appendChild(postDiv);
    }

    async function fetchUserData() {
        const { data, error } = await supabase
            .from("users")
            .select("id, username, major, nim, year_of_college, region, file_path")
            .eq("id", sessionStorage.getItem('activeUser'))
            .single();

        if (error) {
            console.error('Error fetch user:', error);
        } else {
            document.getElementById('usernameText').value = data.username;
            document.getElementById('userMajor').value = data.major;
            document.getElementById('userNim').value = data.nim;
            document.getElementById('userYearOfCollege').value = data.year_of_college;
            document.getElementById('userRegion').value = data.region;
        }
    }

    showProfilePicture();
    fetchUserData();
    document.getElementById("saveBtn").addEventListener("click", updateProfile);
});