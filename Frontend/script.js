document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    const goToSignup = document.getElementById("go-to-signup");
    const goToLogin = document.getElementById("go-to-login");

    goToSignup.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    });

    goToLogin.addEventListener("click", function (event) {
        event.preventDefault();
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    // Handle Login
    document.getElementById("login").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.status === 200 || response.status === 201) {
            alert("Logged in successfully!");
            window.location.href = "userDetail.html"; // Redirect to user list page
        } else {
            alert(result.message || "Login failed");
        }
    });

    // Handle Signup
    document.getElementById("signup").addEventListener("submit", async function (event) {
        event.preventDefault();

        const full_name = document.getElementById("signup-fullname").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        const response = await fetch("http://localhost:3001/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, password }),
        });

        const result = await response.json();

        if (response.status === 200 || response.status === 201) {
            alert("Account created successfully!");
            window.location.href = "userDetail.html"; // Redirect to user list page
        } else {
            alert(result.message || "Signup failed");
        }
    });

    
});
