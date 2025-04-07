document.addEventListener("DOMContentLoaded", () => {
  // Student cards hover effect
  const studentCards = document.querySelectorAll(".student-card")

  studentCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const avatar = this.querySelector(".student-avatar")
      if (avatar) {
        avatar.style.transform = "scale(1.1)"
        avatar.style.transition = "transform 0.3s"
      }
    })

    card.addEventListener("mouseleave", function () {
      const avatar = this.querySelector(".student-avatar")
      if (avatar) {
        avatar.style.transform = "scale(1)"
      }
    })
  })

  // Subject cards click event
  const subjectCards = document.querySelectorAll(".subject-card")

  subjectCards.forEach((card) => {
    card.addEventListener("click", function () {
      const subjectName = this.querySelector("h3").textContent
      const teacher = this.querySelector(".subject-details p:first-child").textContent.replace("Lærer:", "").trim()
      const time = this.querySelector(".subject-time").textContent.trim()

      alert(`Fag: ${subjectName}\nLærer: ${teacher}\nTid: ${time}`)
    })
  })
})

