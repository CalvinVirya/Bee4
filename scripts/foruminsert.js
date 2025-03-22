document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function showForum() {
    const { data, error } = await supabase
      .from("forum")
      .select("title, content, user_id(username), course");

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
          <h6 class="card-subtitle text-body-secondary">${post.user_id(username)}'s Forum</h6>
          <div class="info-parent">
            <button class="me-2 card-subtitle text-body-secondary">${post.course}</button>
          </div>
        </div>
      </div>
        `;
      forumContent.appendChild(postDiv);
    });
  }

  async function insert2() {
    var title = document.getElementById("Title").value;
    var content = document.getElementById("Content").value;
    var course = document.getElementById("Course").value;
    // var username = sessionStorage.getItem("usernameActive");
    var inputTitle = document.getElementById("Title");
    var inputContent = document.getElementById("Content");
    var user_id = sessionStorage.getItem("activeUser");

    alert(user_id);

    if (!title.trim()) {
      inputTitle.classList.toggle('is-invalid');
      return;
    } else {
      inputTitle.classList.remove('is-invalid');
    }

    if (!content.trim()) {
      inputContent.classList.toggle('is-invalid');
      return;
    } else {
      inputContent.classList.remove('is-invalid');
    }

    if (!course.trim()) {
      course = "General";
    }

    const { data, error } = await supabase.from("forum").insert({
      title: title,
      content: content,
      course: course,
      user_id: user_id,
    });

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      window.location.href = "../pages/homepage.html";
    }
  }

  // async function getEmailUsername() {
  //   var email = sessionStorage.getItem("emailActive");

  //   const { data, error } = await supabase
  //     .from("users")
  //     .select("user_id")
  //     .eq("email", email);

  //   if (error) {
  //     alert("Failed to load posts.");
  //     console.error("Error fetching posts:", error.message);
  //   } else if (data.length > 0) {
  //     sessionStorage.setItem("activeUser", data[0].user_id);
  //   } else {
  //     window.location.href = "../index.html";
  //   }
  // }

  showForum();
  // getEmailUsername();
  document.getElementById("submitBtn").addEventListener("click", async () => {
    await insert2();
  });
});
