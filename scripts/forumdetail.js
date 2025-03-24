document.addEventListener("DOMContentLoaded", () => {
    const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
    const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function forumDetail(){
        const {data, error} = await supabase
        .from("forum")
        .select("title, content, course, file_path, users(username)")
        .eq("id", sessionStorage.getItem("forumActive"));

        if (error){
            console.error("Error fetching posts:", error.message);
            alert("Failed to load posts.");
            return;
        }

        const forumBody = document.getElementById("forumBody");
        forumBody.innerHTML = "";

        const postDiv = document.createElement("div");
        let imgTag = "";

        if(data[0].file_path){
            const imgUrl = supabase.storage
            .from("forum-files")
            .getPublicUrl(data[0].file_path);
            imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
        }

        postDiv.innerHTML = `
            <div class="d-flex d-flex justify-content-between align-items-center p-4">
                    <i class="fa-solid fa-arrow-left fa-lg" style="color: #091540;"
                        onclick="window.location.href='../pages/homepage.html'"></i>
                    <span class="fs-5">Forum details</span>
                    <div></div>
                </div>

                <div class="border-bottom bb"></div>

                <div class="p-4">
                    <div class="img-container text-center">${imgTag}</div>
                    <h5 class="card-title mb-3">${data[0].title}</h5>
                    <p class="card-text mb-3">${data[0].content}</p>

                    <div class="info-parent">
                        <button>${data[0].course}</button>
                    </div>
                </div>
                <div class="border-bottom bb"></div>
        `;
        forumBody.appendChild(postDiv);
    }

    forumDetail()

});