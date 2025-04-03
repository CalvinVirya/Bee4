// done checked

document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const noData = document.getElementById("NoForum");
  const noDataLast = document.getElementById("NoForumLastest");

  async function showForum() {
    const { data, error } = await supabase
      .from("forum")
      .select("title, content, users(username), course, file_path, id")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      window.location.href = "../pages/homepage.html";
      return;
    }

    const forumContent = document.getElementById("forumList");
    forumContent.innerHTML = "";

    if (!data || data.length === 0) {
      noData.style.display = "block";
      noDataLast.style.display = "none";
      return;
    } else {
      noData.style.display = "none";

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
              <button class="outline-primary">${post.course}</button>
          </div>
          </div>
        `;

        forumContent.appendChild(postDiv);
        document.getElementById("loading-animation").classList.add("d-none");
      });
    }
  }

  async function insert2() {
    var title = document.getElementById("Title").value;
    var content = document.getElementById("Content").value;
    var course = document.getElementById("Course").value;
    var fileInput = document.getElementById("File");
    var file = fileInput.files[0];
    var inputTitle = document.getElementById("Title");
    var inputContent = document.getElementById("Content");
    var user_id = sessionStorage.getItem("activeUser");

    if (!title.trim()) {
      inputTitle.classList.add("is-invalid");
      return;
    } else {
      inputTitle.classList.remove("is-invalid");
    }

    if (!content.trim()) {
      inputContent.classList.add("is-invalid");
      return;
    } else {
      inputContent.classList.remove("is-invalid");
    }

    if (!course.trim()) {
      course = "General";
    }

    if (file) {
      const filePath = `forum-images/${user_id}/${file.name}`;

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
      } else {
        const { data, error } = await supabase.from("forum").insert({
          title: title,
          content: content,
          course: course,
          user_id: user_id,
          file_path: filePath,
        });

        if (error) {
          alert("Error insert forum: " + error.message);
          console.log(error);
          return;
        }
      }

      console.log("File uploaded successfully:", fileData);
      window.location.href = "../pages/homepage.html";
    } else {
      const { data, error } = await supabase.from("forum").insert({
        title: title,
        content: content,
        course: course,
        user_id: user_id,
      });

      if (error) {
        alert("You must Login First");
        console.log(error);
        window.location.href = "../index.html";
        return;
      }

      window.location.href = "../pages/homepage.html";
    }
  }

  async function latestForum() {
    var userMajor = sessionStorage.getItem("activeMajor");
    const { data, error } = await supabase
      .from("forum")
      .select(
        "title, content, users!inner(username, major), course, file_path, id"
      )
      .eq("users.major", userMajor)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
      window.location.href = "../pages/homepage.html";
      return;
    }

    const forumContent = document.getElementById("forumList");
    forumContent.innerHTML = "";

    if (!data || data.length === 0) {
      noDataLast.style.display = "block";
      noData.style.display = "none";
      return;
    } else {
      noDataLast.style.display = "none";

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
            <button class="outline-primary">${post.course}</button>
          </div>
          </div>
        `;

        forumContent.appendChild(postDiv);
      });
    }
  }

  const forYouCheck = document.getElementById("ForYou");
  const latestCheck = document.getElementById("Latest");

  if (forYouCheck.checked) {
    showForum();
  }

  forYouCheck.addEventListener("change", function () {
    if (forYouCheck.checked) {
      noDataLast.style.display = "none";
      showForum();
    }
  });

  latestCheck.addEventListener("change", function () {
    if (latestCheck.checked) {
      noData.style.display = "none";
      latestForum();
      // alert(sessionStorage.getItem("activeMajor"));
    }
  });

  document.getElementById("submitBtn").addEventListener("click", async () => {
    await insert2();
  });
});
