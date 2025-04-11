document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section")
  const registerSection = document.getElementById("register-section")
  const showRegisterLink = document.getElementById("show-register")
  const showLoginLink = document.getElementById("show-login")
  const authTitle = document.getElementById("auth-title")
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  // Switch to Register form
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault()

    // Update title
    authTitle.textContent = "Registrering"

    // Animate transition
    loginSection.classList.remove("active")
    loginSection.classList.add("slide-out")

    setTimeout(() => {
      registerSection.classList.add("active")
      registerSection.classList.add("slide-in")

      setTimeout(() => {
        loginSection.classList.remove("slide-out")
        registerSection.classList.remove("slide-in")
      }, 500)
    }, 50)
  })

  // Switch to Login form
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault()

    // Update title
    authTitle.textContent = "Logg Inn"

    // Animate transition
    registerSection.classList.remove("active")
    registerSection.classList.add("slide-out")

    setTimeout(() => {
      loginSection.classList.add("active")
      loginSection.classList.add("slide-in")

      setTimeout(() => {
        registerSection.classList.remove("slide-out")
        loginSection.classList.remove("slide-in")
      }, 500)
    }, 50)
  })

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("login-username").value
    const password = document.getElementById("login-password").value

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to profile page on successful login
        window.location.href = "profile.html"
      } else {
        alert(data.message || "Feil brukernavn eller passord")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("En feil oppstod under innlogging. Prøv igjen senere.")
    }
  })

  // Handle register form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("register-username").value
    const password = document.getElementById("register-password").value
    const confirmPassword = document.getElementById("register-confirm-password").value

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passordene samsvarer ikke")
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Registrering vellykket! Du kan nå logge inn.")
        // Switch to login form
        showLoginLink.click()
      } else {
        alert(data.message || "Registrering mislyktes")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("En feil oppstod under registrering. Prøv igjen senere.")
    }
  })
})
