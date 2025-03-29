document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const noForum = document.getElementById("NoForum");
  const noReply = document.getElementById("NoReply");

  function signOut() {
    sessionStorage.clear();
    window.location.href = "../index.html";
  }

  async function showProfile() {
    var user_id = sessionStorage.getItem("activeUser");
    var usr_email = sessionStorage.getItem("activeEmail");

    const { data, error } = await supabase
      .from("users")
      .select("username, major, nim, year_of_college, region, file_path")
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
    } else {
      imgTag = `<img src="../assets/profile.png" alt="Uploaded Image" class="img-fluid">`;
    }

    postDiv.innerHTML = `
            <!-- profile -->
            <div class="text-center mb-3">
                <div class="profile-image mb-3">
                    ${imgTag}
                </div>
                <p class="p-0 m-0 fs-2 fw-bold">${data.username}</p>
                <p class="p-0 m-0 mb-2 fs-5">${usr_email}</p>
                <button class="nim-info fs-6">${data.nim}</button>
            </div>

            <!-- profile button grup -->
            <div class="w-100 text-center mb-4">
                <button type="button" class="btn me-3 btn-profile fw-semibold" onclick="window.location.href='../pages/editprofilepage.html'">Edit Profile</button>
                <button type="button" class="btn btn-profile fw-semibold" onclick="window.location.href='../pages/aboutus.html'">About Us</button>
            </div>

            <!-- profile info -->
            <div class="w-100 info-parent mb-3">
                <div class="p-4">
                    <div class="d-flex align-items-center mt-3">
                        <i class="fa-solid fa-book fa-2xl me-3" style="color: #091540;"></i>
                        <div>
                            <p class="fw-bold p-0 m-0 text-primary-color">Major</p>
                            <p class="p-0 m-0">${data.major}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-3">
                        <i class="fa-solid fa-calendar fa-2xl me-3" style="color: #091540;"></i>
                        <div>
                            <p class="fw-bold p-0 m-0 text-primary-color">Year of College</p>
                            <p class="p-0 m-0">${data.year_of_college}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-3 mb-3">
                        <i class="fa-solid fa-location-dot fa-2xl me-3" style="color: #091540;"></i>
                        <div>
                            <p class="fw-bold p-0 m-0 text-primary-color">Region</p>
                            <p class="p-0 m-0">${data.region}</p>
                        </div>
                    </div>
                </div>

            </div>
        `;
    profileBody.appendChild(postDiv);
    document.getElementById("loading-animation").classList.add("d-none");
  }

  async function showProfileForum() {
    const { data, error } = await supabase
      .from("forum")
      .select(
        "title, content, users!inner(username, id), course, file_path, id"
      )
      .eq("users.id", sessionStorage.getItem("activeUser"))
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      alert("Failed to load posts.");
      return;
    }

    const profileForum = document.getElementById("ForumAndReply");
    profileForum.innerHTML = "";

    if (!data || data.length === 0) {
      noForum.style.display = "block";
      noReply.style.display = "none";
      return;
    } else {
      noForum.style.display = "none";
      noReply.style.display = "none";
      data.forEach((post) => {
        const postDiv = document.createElement("div");
        let imgTag = ""; // Default empty image tag

        if (post.file_path) {
          const imgUrl = supabase.storage
            .from("forum-files")
            .getPublicUrl(post.file_path);
          imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
        }
        postDiv.innerHTML = `
                    <div class="card-parent w-100 mb-5">
                    <div class="card mb-3 border-2">
                        <div class="card-body" onClick="sessionStorage.setItem('forumActive', '${post.id}'); window.location.href = '../pages/forumdetail.html';">
                        <div class="img-container text-center">${imgTag}</div>
                        <h5 class="card-title mt-3">${post.title}</h5>
                        <p class="card-text">${post.content}</p>
                        </div>
                    </div>
                    <div class="button-card mt-2">
                            <div class="d-flex justify-content-between">
                            <h6 class="card-subtitle text-body-secondary">${post.users.username}'s Forum</h6>
                            <span data-bs-toggle="modal" data-bs-target="#exampleModal" onClick="sessionStorage.setItem('deleteActive', '${post.id}'); sessionStorage.setItem('pathActive', '${post.file_path}');"><i class="fa-solid fa-trash fa-lg"
                                    style="color: #091540;"></i></span>
                            </div>
                            <div class="course-info mt-2">
                                <button>${post.course}</button>
                            </div>
                        </div>
                    </div>
                    `;

        profileForum.appendChild(postDiv);
      });
    }
  }

  async function showReplyForum() {
    const { data, error } = await supabase
      .from("forumReply") // ganti reply
      .select("content, users!inner(username, id), file_path, id, forum(title)")
      .eq("users.id", sessionStorage.getItem("activeUser"))
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      alert("Failed to load posts.");
      return;
    }

    const profileReply = document.getElementById("ForumAndReply");
    profileReply.innerHTML = "";

    if (!data || data.length === 0) {
      noForum.style.display = "none";
      noReply.style.display = "block";
      return;
    } else {
      noReply.style.display = "none";
      noForum.style.display = "none";
      data.forEach((post) => {
        const postDiv = document.createElement("div");
        let imgTag = ""; // Default empty image tag

        if (post.file_path) {
          const imgUrl = supabase.storage
            .from("forum-files")
            .getPublicUrl(post.file_path);
          imgTag = `<img src="${imgUrl.data.publicUrl}" alt="Uploaded Image" class="img-fluid">`;
        }
        postDiv.innerHTML = `
                    <div class="card-parent w-100 mb-5">
                    <div class="card mb-3 border-2">
                        <div class="card-body" onClick="sessionStorage.setItem('forumActive', '${post.id}'); window.location.href = '../pages/forumdetail.html';">
                        <div class="img-container text-center">${imgTag}</div>
                        <p class="card-text">${post.content}</p>
                        </div>
                    </div>
                    <div class="button-card mt-2">
                            <div class="d-flex justify-content-between">
                            <h6 class="card-subtitle text-body-secondary">${post.users.username}'s Reply on ${post.forum.title}</h6>
                            <span data-bs-toggle="modal" data-bs-target="#exampleModal" onClick="sessionStorage.setItem('deleteActive', '${post.id}'); sessionStorage.setItem('pathActive', '${post.file_path}');"><i class="fa-solid fa-trash fa-lg"
                                    style="color: #091540;"></i></span>
                            </div>
                        </div>
                    </div>
                    `;

        profileReply.appendChild(postDiv);
      });
    }
  }

  async function deleteForum() {
    const { data, error } = await supabase
      .from("forum")
      .delete()
      .eq("id", sessionStorage.getItem("deleteActive"));

    if (error) {
      console.error("Error deleting forum:", error.message);
      alert("Failed to delete forum.");
    }

    if (!sessionStorage.getItem("pathActive")) {
      window.location.href = "../pages/profilepage.html";
      return;
    } else {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("forum-files")
        .remove([sessionStorage.getItem("pathActive")]);

      if (fileError) {
        console.error(fileError.message);
      } else {
        console.log("berhasil");
      }
    }

    window.location.href = "../pages/profilepage.html";
  }

  async function deleteReply() {
    const { data, error } = await supabase
      .from("forumReply")
      .delete()
      .eq("id", sessionStorage.getItem("deleteActive"));

    if (error) {
      console.error("Error deleting forum:", error.message);
      alert("Failed to delete forum.");
    }

    if (!sessionStorage.getItem("pathActive")) {
      window.location.href = "../pages/profilepage.html";
      return;
    } else {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("forum-files")
        .remove([sessionStorage.getItem("pathActive")]);

      if (fileError) {
        console.error(fileError.message);
      } else {
        console.log("berhasil");
      }
    }

    window.location.href = "../pages/profilepage.html";
  }

  const YourForumCheck = document.getElementById("YourForum");
  const YourRepliesCheck = document.getElementById("YourReplies");

  if (YourForumCheck.checked) {
    showProfileForum();
  }

  YourForumCheck.addEventListener("change", function () {
    if (YourForumCheck.checked) {
      showProfileForum();
    }
  });

  YourRepliesCheck.addEventListener("change", function () {
    if (YourRepliesCheck.checked) {
      showReplyForum();
    }
  });

  document.getElementById("SignoutBtn").addEventListener("click", signOut);
  document.getElementById("deleteBtn").addEventListener("click", deleteForum);
  document.getElementById("deleteBtn").addEventListener("click", deleteReply);
  showProfile();
});
