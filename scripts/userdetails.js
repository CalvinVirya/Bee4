// done checked

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
    var inputUsername = document.getElementById("Username");
    var inputMajor = document.getElementById("Major");
    var inputYearOfCollege = document.getElementById("Year-Of-College");
    var inputRegion = document.getElementById("Region");
    var inputNIM = document.getElementById("NIM");

    if (!username.trim()) {
      inputUsername.classList.add('is-invalid');
      return;
    } else {
      inputUsername.classList.remove('is-invalid');
    }

    if (username.length > 10) {
      inputUsername.classList.add('is-invalid');
      return;
    } else {
      inputUsername.classList.remove('is-invalid');
    }

    if (username.includes(" ")) {
      inputUsername.classList.add('is-invalid');
      return;
    } else {
      inputUsername.classList.remove('is-invalid');
    }

    if (nim.length !== 10) {
      inputNIM.classList.add('is-invalid');
      return;
    } else {
      inputNIM.classList.remove('is-invalid');
    }

    if (major === "") {
      inputMajor.classList.add('is-invalid');
      return;
    } else {
      inputMajor.classList.remove('is-invalid');
    }

    if (yearOfCollege.length !== 4) {
      inputYearOfCollege.classList.add('is-invalid');
      return;
    } else {
      inputYearOfCollege.classList.remove('is-invalid');
    }

    if (region === "") {
      inputRegion.classList.add('is-invalid');
      return;
    } else {
      inputRegion.classList.remove('is-invalid');
    }

    const { data, error } = await supabase.from("users").insert({
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
      window.location.href = "../index.html";
    }
  }
  document.getElementById("submitBtn").addEventListener("click", userDetails);
});
