// Animation utilities
document.addEventListener("DOMContentLoaded", () => {
  // Animate elements when they enter the viewport
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".feature-card, .program-card, .student-card, .subject-card, .stat-card")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 50) {
        element.classList.add("animated")
      }
    })
  }

  // Add animation class to elements
  const addAnimationClass = () => {
    const featureCards = document.querySelectorAll(".feature-card")
    const programCards = document.querySelectorAll(".program-card")
    const studentCards = document.querySelectorAll(".student-card")
    const subjectCards = document.querySelectorAll(".subject-card")
    const statCards = document.querySelectorAll(".stat-card")

    featureCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in-up")
    })

    programCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in-up")
    })

    studentCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.05}s`
      card.classList.add("fade-in-up")
    })

    subjectCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in-right")
    })

    statCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in-up")
    })
  }

  // Call animation function when page loads
  addAnimationClass()

  // Listen for scroll events
  window.addEventListener("scroll", animateOnScroll)
})

