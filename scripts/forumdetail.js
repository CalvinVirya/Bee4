document.addEventListener("DOMContentLoaded", () => {
    const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
    const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function forumDetail() {
        const { data, error } = await supabase
            .from("forum")
            .select("title, content, course, file_path, users(username, major)")
            .eq("id", sessionStorage.getItem("forumActive"))
            .single();

        if (error) {
            console.error("Error fetching posts:", error.message);
            alert("Failed to load posts.");
            return;
        }

        const forumBody = document.getElementById("forumBody");
        forumBody.innerHTML = "";

        const postDiv = document.createElement("div");
        let imgTag = "";

        if (data.file_path) {
            const imgUrl = supabase.storage
                .from("forum-files")
                .getPublicUrl(data.file_path);
            imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
        }

        postDiv.innerHTML = `
            <div class="d-flex d-flex justify-content-between align-items-center p-4">
                <i class="fa-solid fa-arrow-left fa-lg" style="color: #091540;"
                    onclick="window.history.back()"></i>
                <span class="fs-5">Forum details</span>
                <div></div>
            </div>

            <div class="border-bottom bb"></div>

            <div class="p-4">
                <div class="d-flex align-items-center mb-4">
                    <div class="profile-container">
                        <img src="../assets/pp4.jpg" alt="Uploaded Image" class="img-fluid">
                    </div>
                    <div class="ms-3">
                        <p class="fs-5 m-0">${data.users.username}</p>
                        <div class="form-text">${data.users.major}</div>
                    </div>
                </div>
                <div class="img-container text-center">${imgTag}</div>
                <h5 class="card-title mb-2">${data.title}</h5>
                <p class="card-text">${data.content}</p>

                <div class="info-parent">
                    <button>${data.course}</button>
                </div>
            </div>
            <div class="border-bottom bb"></div>
        `;
        forumBody.appendChild(postDiv);
    }

    async function insertReply() {
        var content = document.getElementById("ReplyText").value;
        var fileInput = document.getElementById("ReplyFile");
        var file = fileInput.files[0];
        var user_id = sessionStorage.getItem("activeUser");
        var forum_id = sessionStorage.getItem("forumActive");

        if (file) {
            const filePath = `reply-images/${user_id}/${file.name}`;

            const { data: fileData, error: fileError } = await supabase.storage
                .from("forum-files")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (fileError) {
                alert("Failed to upload file " + fileError.message);
                return;
            } else {
                const { data, error } = await supabase.from("forumReply")
                    .insert({
                        content: content,
                        user_id: user_id,
                        forum_id: forum_id,
                        file_path: filePath,
                    });

                if (error) {
                    alert("Failed to insert reply " + error.message);
                    return;
                }
            }

            console.log("File uploaded successfully:", fileData);
            window.location.href = "../pages/forumdetail.html";
        } else {
            const { data, error } = await supabase.from("forumReply")
                .insert({
                    content: content,
                    user_id: user_id,
                    forum_id: forum_id,
                });

            if (error) {
                alert("Failed to insert reply " + error.message);
                return;
            }
            window.location.href = "../pages/forumdetail.html";
        }
    }

    async function showReply() {
        var forumId = sessionStorage.getItem("forumActive");
        const { data, error } = await supabase
            .from("forumReply")
            .select("content, users(username), file_path, forum(id)")
            .eq("forum_id", forumId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error.message);
            alert("Failed to load posts.");
            return;
        }

        const forumReply = document.getElementById("forumComment");
        forumReply.innerHTML = "";

        data.forEach((post) => {
            const postDiv = document.createElement("div");
            let imgTag = "";

            if (post.file_path) {
                const imgUrl = supabase.storage
                    .from("forum-files")
                    .getPublicUrl(post.file_path);
                imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
            }

            postDiv.innerHTML = `
                <div class="card border-2 mb-4">
                    <div class="card-body">
                        <div class="profile-reply-container d-flex align-items-center mb-3">
                            <img src="../assets/pp4.jpg" alt="Uploaded Image" class="img-fluid">
                            <p class="ms-3 mt-3">${post.users.username}</p>
                        </div>
                        <div class="img-container text-center">${imgTag}</div>
                        <p class="card-text">${post.content}
                        </p>
                    </div>
                </div>
            `;
            forumReply.appendChild(postDiv);
        });
    }

    const reply = document.getElementById("ReplyFile");

    reply.addEventListener('change', function(){
        const file = this.files[0];
        const fileName = document.getElementById("FileName");

        if(file){
            fileName.textContent = `File: ${file.name}`;
        } else{
            fileName.textContent = `File: No file chosen`;
        }
    });

    document.getElementById("replyBtn").addEventListener("click", async () => {
        await insertReply();
    });
    showReply();
    forumDetail();

});