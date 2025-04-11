// Simplified animations.js with minimal animations
document.addEventListener("DOMContentLoaded", () => {
  // Keep only essential functionality
  // Remove all animation-related code that was previously here

  // Keep loading screen functionality if needed
  const loadingScreen = document.getElementById("loading-screen")
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 300)
    }, 800)
  }
})
