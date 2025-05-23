document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer and navigation
  const currentYear = new Date().getFullYear()
  const yearElements = document.querySelectorAll("#current-year, #footer-year")
  yearElements.forEach((el) => {
    if (el) el.textContent = currentYear
  })

  // Navigation functionality
  const menuButton = document.getElementById("menu-button")
  const closeNavButton = document.getElementById("close-nav")
  const navBackdrop = document.getElementById("nav-backdrop")
  const navigation = document.getElementById("navigation")

  // Open navigation
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      navigation.classList.add("active")
      navBackdrop.classList.add("active")
    })
  }

  // Close navigation
  function closeNav() {
    navigation.classList.remove("active")
    navBackdrop.classList.remove("active")
  }

  if (closeNavButton) {
    closeNavButton.addEventListener("click", closeNav)
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNav)
  }

  // Hide loading screen if it exists
  const loadingScreen = document.getElementById("loading-screen")
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1500)
  }
})
