document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://eyivkatlviuwitwjklkq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aXZrYXRsdml1d2l0d2prbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTYxMDMsImV4cCI6MjA1Nzg5MjEwM30.nLQ_vGBgSGWqDMz1LF1vSWAeydpxItyT_ZDvwwc9IQQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function userDetails() {
    var username = document.getElementById("Username").value;
    var major = document.getElementById("Major").value;
    var yearOfCollege = document.getElementById("Year-Of-College").value;
    var region = document.getElementById("Region").value;
    var nim = document.getElementById("NIM").value;
    var email = sessionStorage.getItem("emailActive");
    var password = sessionStorage.getItem("passwordActive");

    const { data, error } = await supabase.from("users").insert({
      email: email,
      password: password,
      username: username,
      nim: nim,
      major: major,
      year_of_college: yearOfCollege,
      region: region,
    });

    if (error) {
      alert(error);
      console.log(error);
    } else {
      sessionStorage.setItem("usernameActive", username);
      window.location.href = "../pages/homepage.html";
    }
  }
  document.getElementById("submitBtn").addEventListener("click", userDetails);
});
