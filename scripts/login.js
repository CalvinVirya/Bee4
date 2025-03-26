document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function getMajor() {
    var user_id = sessionStorage.getItem("activeUser");

    const { data, error } = await supabase
      .from("users")
      .select("major")
      .eq("id", user_id)
      .single();

    if (error) {
      alert("Error getting major:", error.message);
    } else {
      sessionStorage.setItem("activeMajor", data.major);
    }
  }

  async function signIn() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var inputEmail = document.getElementById("Email");
    var inputPassword = document.getElementById("Password");
    var loginAlert = document.getElementById("Alert");

    // Validasi email harus @binus.ac.id
    const emailRegex = /^[a-zA-Z0-9._%+-]+@binus\.ac\.id$/;
    if (!emailRegex.test(email)) {
      inputEmail.classList.add('is-invalid');
      return;
    } else {
      inputEmail.classList.remove('is-invalid');
    }

    // Cek apakah password mengandung spasi
    if (password.includes(" ")) {
      inputPassword.classList.add('is-invalid');
      return;
    } else {
      inputPassword.classList.remove('is-invalid');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loginAlert.classList.toggle('display-none');
      console.error("Login Error:", error.message);
    } else {
      sessionStorage.setItem("activeUser", data.user.id);
      sessionStorage.setItem("activeEmail", data.user.email);
      await getMajor();
      window.location.href = "pages/homepage.html";
    }
  }

  document.getElementById("loginBtn").addEventListener("click", signIn);
});
