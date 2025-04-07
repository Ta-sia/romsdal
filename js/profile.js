document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  checkAuthStatus()

  // Load user profile data
  loadProfileData()

  // Load teacher comments
  loadTeacherComments()
})

// Function to check authentication status
async function checkAuthStatus() {
  try {
    const response = await fetch("/api/auth-status")
    const data = await response.json()

    if (!response.ok || !data.authenticated) {
      // Redirect to login page if not authenticated
      window.location.href = "login.html"
    }
  } catch (error) {
    console.error("Auth check error:", error)
    // Redirect to login page on error
    window.location.href = "login.html"
  }
}

// Function to load profile data
async function loadProfileData() {
  try {
    const response = await fetch("/api/profile")

    if (!response.ok) {
      throw new Error("Failed to load profile data")
    }

    const data = await response.json()

    // Update profile information
    document.getElementById("student-name").textContent = data.name
    document.getElementById("student-class").textContent = data.class
    document.getElementById("student-birthdate").textContent = data.birthdate
    document.getElementById("student-age").textContent = data.age
    document.getElementById("student-email").textContent = data.email
    document.getElementById("student-phone").textContent = data.phone
    document.getElementById("student-about").textContent = data.about || "Ingen informasjon tilgjengelig"

    // Update profile image if available
    if (data.profileImage) {
      document.getElementById("profile-image").src = data.profileImage
    }
  } catch (error) {
    console.error("Error loading profile:", error)
    alert("Kunne ikke laste profilinformasjon. Prøv igjen senere.")
  }
}

// Function to load teacher comments
async function loadTeacherComments() {
  try {
    const response = await fetch("/api/comments")

    if (!response.ok) {
      throw new Error("Failed to load comments")
    }

    const comments = await response.json()
    const commentsContainer = document.getElementById("teacher-comments")

    if (comments.length === 0) {
      commentsContainer.innerHTML = "<p>Ingen kommentarer ennå</p>"
      return
    }

    // Clear existing comments
    commentsContainer.innerHTML = ""

    // Add each comment
    comments.forEach((comment) => {
      const commentElement = document.createElement("div")
      commentElement.className = "comment"

      const commentDate = new Date(comment.date).toLocaleDateString("no-NO")

      commentElement.innerHTML = `
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          <span class="comment-date">${commentDate}</span>
        </div>
        <p class="comment-text">${comment.text}</p>
      `

      commentsContainer.appendChild(commentElement)
    })
  } catch (error) {
    console.error("Error loading comments:", error)
    document.getElementById("teacher-comments").innerHTML = "<p>Kunne ikke laste kommentarer. Prøv igjen senere.</p>"
  }
}

