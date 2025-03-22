document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function showForum() {
    const { data, error } = await supabase
      .from("forum")
      .select("title, content, users(username),course")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      alert("Failed to load posts.");
      return;
    }

    const forumContent = document.getElementById("forumList");
    forumContent.innerHTML = "";

    data.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.innerHTML = `
      <div class="card-parent w-100 mb-5">
        <div class="card mb-3 border-2">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}
            </p>
          </div>
        </div>
        <div class="button-card d-flex justify-content-between align-items-center mt-2">
          <h6 class="card-subtitle text-body-secondary">${post.users.username}'s Forum</h6>
          <div class="info-parent">
            <button class="me-2 card-subtitle text-body-secondary">${post.course}</button>
          </div>
        </div>
      </div>
        `;
      forumContent.appendChild(postDiv);
    });
  }

  async function insert2(event) {
    var title = document.getElementById("Title").value;
    var content = document.getElementById("Content").value;
    var course = document.getElementById("Course").value;
    var fileInput = document.getElementById("File");
    var file = fileInput.files[0];
    var inputTitle = document.getElementById("Title");
    var inputContent = document.getElementById("Content");
    var user_id = sessionStorage.getItem("activeUser");

    if (!title.trim()) {
      inputTitle.classList.toggle("is-invalid");
      return;
    } else {
      inputTitle.classList.remove("is-invalid");
    }

    if (!content.trim()) {
      inputContent.classList.toggle("is-invalid");
      return;
    } else {
      inputContent.classList.remove("is-invalid");
    }

    if (!course.trim()) {
      course = "General";
    }

    // ganti logic nanti, harusnya cek file kosong atau ngga diatas, baru dalemnya yg beda

    const { data, error } = await supabase
      .from("forum")
      .insert({
        title: title,
        content: content,
        course: course,
        user_id: user_id,
      })
      .select("id");

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    } else if (file) {
      const filePath = `uploads/forum_${data[0].id}/${file.name}`;

      const { data: fileData, error: fileError } = await supabase.storage
        .from("forum-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (fileError) {
        alert("File upload failed: " + fileError.message);
        console.error(fileError);
        return;
      }

      console.log("File uploaded successfully:", fileData);
      window.location.href = "../pages/homepage.html";
    } else {
      window.location.href = "../pages/homepage.html";
    }
  }

  showForum();
  document.getElementById("submitBtn").addEventListener("click", async () => {
    await insert2();
  });
});
