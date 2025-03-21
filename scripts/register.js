document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function userAuth() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var confirmPassword = document.getElementById("Confirm-Password").value;
    var inputEmail = document.getElementById("Email");
    var inputPassword = document.getElementById("Password");
    var inputConfirmPassword = document.getElementById("Confirm-Password");

    // Validasi email harus domain @binus.ac.id
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

    // Cek apakah kedua password sama
    if (password !== confirmPassword) {
      inputConfirmPassword.classList.toggle('is-invalid');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error);
      console.error("Login Error:", error.message);
      return;
    } else {
      sessionStorage.setItem("emailActive", email);
      sessionStorage.setItem("passwordActive", password);
      window.location.href = "../pages/inputdetail.html";
    }
  }

  document.getElementById("registerBtn").addEventListener("click", userAuth);
});
