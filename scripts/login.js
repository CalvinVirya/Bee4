document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function signIn() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var inputEmail = document.getElementById("Email");
    var inputPassword = document.getElementById("Password");
    var loginAlert = document.getElementById("Alert");

    // Validasi email harus @binus.ac.id
    const emailRegex = /^[a-zA-Z0-9._%+-]+@binus\.ac\.id$/;
    if (!emailRegex.test(email)) {
      inputEmail.classList.toggle('is-invalid');
      return;
    }

    // Cek apakah password mengandung spasi
    if (password.includes(" ")) {
      inputPassword.classList.toggle('is-invalid');
      return;
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
      // alert(`User UID: ${data.user.id}`);
      window.location.href = "pages/homepage.html";
    }
  }

  // async function getUId() {
  //   const { data, error } = await supabase.auth.getSession();

  //   if (error) {
  //     console.error("Error getting user:", error.message);
  //     return;
  //   } else {
  //     alert("User UID:", data.user.id);
  //   }

  //   if (!data || !data.user) {
  //     console.log("User belum login!");
  //     return;
  //   }
  // }


  document.getElementById("loginBtn").addEventListener("click", signIn);
  // document.getElementById("loginBtn").addEventListener("click", getUId);
});
