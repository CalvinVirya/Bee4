document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function showForum() {
    const { data, error } = await supabase
      .from("forum")
      .select("title, content, username");

    if (error) {
      alert("Failed to load posts.");
      console.error("Error fetching posts:", error.message);
      return;
    }

    const forumContent = document.getElementById("forumList");
    forumContent.innerHTML = "";

    data.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.innerHTML = `
      <div class="card-parent w-100 mb-5">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}
            </p>
          </div>
        </div>
        <div class="button-card d-flex justify-content-between align-items-center mt-2">
          <h6 class="card-subtitle text-body-secondary">${post.username}'s Forum</h6>
          <div class="info-parent">
            <button class="me-2 card-subtitle text-body-secondary">Calculus</button>
            <button class="card-subtitle text-body-secondary">Computer Science</button>
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
    var username = sessionStorage.getItem("usernameActive");

    const { data, error } = await supabase.from("forum").insert({
      title: title,
      username: username,
      content: content,
    });

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      alert("forum posted");
      showForum();
    }
  }

  async function getEmailUsername() {
    var email = sessionStorage.getItem("emailActive");

    const { data, error } = await supabase
      .from("users")
      .select("username, email")
      .eq("email", email);
    // .where("email LIKE email");

    if (error) {
      alert("Failed to load posts.");
      console.error("Error fetching posts:", error.message);
    } else if (data.length > 0) {
      sessionStorage.setItem("emailActive", data[0].email);
      sessionStorage.setItem("usernameActive", data[0].username);
    } else {
      alert("Email not registered");
    }
  }

  showForum();
  getEmailUsername();
  document.getElementById("submitBtn").addEventListener("click", async () => {
    await insert2();
  });
});
