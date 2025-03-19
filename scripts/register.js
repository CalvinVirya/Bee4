// Ensure Supabase is available
document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function userAuth() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert("Email already exsists");
      console.error("Login Error:", error.message);
    } else {
      sessionStorage.setItem("emailActive", email);
      window.location.href = "pages/inputdetail.html";
    }
  }

  async function userDetails() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    // var username = document.getElementById("Username").value;

    const { data, error } = await supabase
      .from("users")
      .insert({ email: email, password: password, username: "username" });
  }

  // document.getElementById("registerBtn").addEventListener("click", userAuth);
  // document.getElementById("registerBtn").addEventListener("click", userDetails);
});
