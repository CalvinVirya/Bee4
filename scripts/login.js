document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function signIn() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;

    // -----------------------------------------------------------------------------------------------
   
    // Validasi email harus @binus.ac.id
    const emailRegex = /^[a-zA-Z0-9._%+-]+@binus\.ac\.id$/;
    if (!emailRegex.test(email)) {
      alert("Email harus menggunakan domain @binus.ac.id");
      return;
    }

    // Cek apakah password mengandung spasi
    if (password.includes(" ")) {
      alert("Password tidak boleh mengandung spasi");
      return;
    }

     // -----------------------------------------------------------------------------------------------
   

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Wrong email or password");
      console.error("Login Error:", error.message);
    } else {
      // alert("Login Successful!");
      sessionStorage.setItem("emailActive", email);
      window.location.href = "pages/homepage.html";
    }
  }

  // -----------------------------------------------------------------------------------------------
   

  // Cegah spacebar di input password secara langsung
  document.getElementById("Password").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\s/g, "");
  });


  // -----------------------------------------------------------------------------------------------
   
  document.getElementById("loginBtn").addEventListener("click", signIn);
});
