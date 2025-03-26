document.addEventListener("DOMContentLoaded", () => {
    const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    function signOut() {
        sessionStorage.clear();
        window.location.href = "../index.html";
    }

    async function showProfile() {
        var user_id = sessionStorage.getItem("activeUser");
        var usr_email = sessionStorage.getItem("activeEmail");

        const { data, error } = await supabase
            .from("users")
            .select("username, major, nim, year_of_college, region")
            .eq("id", user_id)
            .single();

        if (error) {
            console.error("Error fetching post:", error.message);
            alert("Failed to load post.");
            return;
        }

        const profileBody = document.getElementById("profileBody");
        profileBody.innerHTML = "";

        const postDiv = document.createElement("div");
        let imgTag = "";

        if (data.file_path) {
            const imgUrl = supabase.storage
                .from("forum-files")
                .getPublicUrl(data.file_path);
            imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
        }

        postDiv.innerHTML = `
            <!-- profile -->
            <div class="text-center p-4">
                <div class="profile-image mb-3">
                    <img src="../assets/pp4.jpg" alt="">
                </div>
                <p class="p-0 m-0 fs-2 fw-bold">${data.username}</p>
                <p class="p-0 m-0 mb-2 fs-5">${usr_email}</p>
                <button class="nim-info fs-6">${data.nim}</button>
            </div>

            <!-- profile button grup -->
            <div class="w-100 text-center mb-3">
                <button type="button" class="btn me-3 btn-profile fw-semibold">Edit Profile</button>
                <button type="button" class="btn btn-profile fw-semibold">About Us</button>
            </div>

            <!-- profile info -->
            <div class="w-100 info-parent mb-3">
                <div class="p-4">
                    <div class="d-flex align-items-center mt-3">
                        <i class="fa-solid fa-book fa-2xl me-3" style="color: #091540;"></i>
                        <div>
                            <p class="fw-bold p-0 m-0">Major</p>
                            <p class="p-0 m-0">${data.major}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-3">
                        <i class="fa-solid fa-calendar fa-2xl me-3" style="color: #091540;"></i>
                        <div>
                            <p class="fw-bold p-0 m-0">Year of College</p>
                            <p class="p-0 m-0">${data.year_of_college}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-3 mb-3">
                        <i class="fa-solid fa-location-dot fa-2xl me-3" style="color: #091540;"></i>
                        <div>
                            <p class="fw-bold p-0 m-0">Region</p>
                            <p class="p-0 m-0">${data.region}</p>
                        </div>
                    </div>
                </div>

            </div>
        `;
        profileBody.appendChild(postDiv);
    }

    document.getElementById("SignoutBtn").addEventListener("click", signOut);
    showProfile()
});