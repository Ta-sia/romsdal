document.addEventListener("DOMContentLoaded", () => {
    // Program buttons click event
    const programButtons = document.querySelectorAll(".program-button")
  
    programButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const programName = this.parentElement.querySelector("h3").textContent
        alert(`Du har valgt programmet: ${programName}. Mer informasjon kommer snart!`)
      })
    })
  
    // Hero button click event
    const heroButton = document.querySelector(".hero-button")
  
    if (heroButton) {
      heroButton.addEventListener("click", () => {
        // Scroll to features section
        const featuresSection = document.querySelector(".features-section")
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: "smooth" })
        }
      })
    }
  
    // Feature cards hover effect
    const featureCards = document.querySelectorAll(".feature-card")
  
    featureCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        const icon = this.querySelector(".feature-icon")
        if (icon) {
          icon.style.transform = "scale(1.1)"
          icon.style.transition = "transform 0.3s"
        }
      })
  
      card.addEventListener("mouseleave", function () {
        const icon = this.querySelector(".feature-icon")
        if (icon) {
          icon.style.transform = "scale(1)"
        }
      })
    })
  })
  
  