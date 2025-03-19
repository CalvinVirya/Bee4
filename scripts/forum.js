document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function showForum() {
    const { data, error } = await supabase.from("forum").select("title, content, username");

    if (error) {
      console.error("Error fetching posts:", error.message);
      alert("Failed to load posts.");
    } else {
      document.getElementById("forumContent").textContent = JSON.stringify(
        data,
        null,
        2
      );
    }
  }

  async function insertForum() {
    var email = sessionStorage.getItem("emailActive");
    var title = document.getElementById("Title").value;
    var content = document.getElementById("Content").value;

    // alert(title);

    const { data, error } = await supabase.from("forum").insert({
      title: title,
      content: content,
      username: "tes",
    });

    if (error) {
      console.log(error);
    } else {
      alert("forum posted");
    }
  }
  document.getElementById("submitBtn").addEventListener("click", insertForum);
  showForum();
});
