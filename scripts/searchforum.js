document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  var course;

  const selectedTag = document.getElementById("selected-tag");
  const tagResult = document.getElementById("tag-result");

  async function showForumSearch() {
    // alert("kepanggil kok");
    var searchText = document.getElementById("searchText").value;

    document.getElementById("tag-parent").style.display = "none";

    document.getElementById("searchBtn").classList.add("d-none");

    document.getElementById("closeBtn").classList.remove("d-none");

    const { data, error } = await supabase
      .from("forum")
      .select("title, content, users(username), course, file_path, id")
      .or(`course.ilike.%${searchText}%,title.ilike.%${searchText}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      alert("Failed to load posts.");
      return;
    }

    const noData = document.getElementById("NoForum");

    const forumContent = document.getElementById("forumListSearch");
    forumContent.classList.remove("d-none");
    forumContent.classList.add("d-block");
    forumContent.innerHTML = "";
    document.getElementById("forumList").classList.add("d-none");

    if (!data || data.length === 0) {
      noData.style.display = "block";
      //   noDataLast.style.display = "none";
      return;
    } else {
      //   noData.style.display = "none";

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
          <div class="card-parent w-100 mb-5"
          onClick="sessionStorage.setItem('forumActive', '${post.id}'); window.location.href = '../pages/forumdetail.html';">
          <div class="card mb-3 border-2">
            <div class="card-body">
              <div class="img-container text-center">${imgTag}</div>
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content}</p>
            </div>
          </div>
          <div class="button-card d-flex justify-content-between align-items-center mt-2">
            <h6 class="card-subtitle text-body-secondary">${post.users.username}'s Forum</h6>
            <div class="info-parent">
              <button>${post.course}</button>
            </div>
          </div>
          </div>
        `;

        forumContent.appendChild(postDiv);
      });
    }
  }

  async function showForum() {
    const { data, error } = await supabase
      .from("forum")
      .select("title, content, users(username), course, file_path, id")
      .eq("course", course)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      alert("Failed to load posts.");
      return;
    }

    const noData = document.getElementById("NoForum");

    const forumContent = document.getElementById("forumList");
    forumContent.innerHTML = "";

    if (!data || data.length === 0) {
      noData.style.display = "block";
      return;
    } else {
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
          <div class="card-parent w-100 mb-5"
          onClick="sessionStorage.setItem('forumActive', '${post.id}'); window.location.href = '../pages/forumdetail.html';">
          <div class="card mb-3 border-2">
            <div class="card-body">
              <div class="img-container text-center">${imgTag}</div>
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content}</p>
            </div>
          </div>
          <div class="button-card d-flex justify-content-between align-items-center mt-2">
            <h6 class="card-subtitle text-body-secondary">${post.users.username}'s Forum</h6>
            <div class="info-parent">
              <button>${post.course}</button>
            </div>
          </div>
          </div>
        `;

        forumContent.appendChild(postDiv);
      });
    }
  }

  document.querySelectorAll(".tag-btn").forEach((button) => {
    button.addEventListener("click", function () {
      course = this.innerText;
      document.getElementById("tag-parent").style.display = "none";
      selectedTag.innerText = course;
      tagResult.style.display = "flex";
      showForum();
      const forumContent = document.getElementById("forumList");
      forumContent.style.display = "block";
    });
  });

  document
    .getElementById("close-result")
    .addEventListener("click", function () {
      const forumContent = document.getElementById("forumList");
      const noData = document.getElementById("NoForum");
      tagResult.style.display = "none";
      forumContent.style.display = "none";
      noData.style.display = "none";
      document.getElementById("tag-parent").style.display = "block";
      document.getElementById("forumListSearch").classList.add("d-none");
    });

  document
    .getElementById("searchBtn")
    .addEventListener("click", showForumSearch);
});
