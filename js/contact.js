document.addEventListener("DOMContentLoaded", () => {
    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    const formSuccess = document.getElementById("form-success")
    const resetFormButton = document.getElementById("reset-form")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Validate form
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const message = document.getElementById("message").value
  
        if (!name || !email || !message) {
          alert("Vennligst fyll ut alle feltene.")
          return
        }
  
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          alert("Vennligst skriv inn en gyldig e-postadresse.")
          return
        }
  
        // Show loading state
        const submitButton = document.getElementById("submit-button")
        submitButton.disabled = true
        submitButton.innerHTML = `
          <span class="button-loading">
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
          </span>
        `
  
        // Simulate form submission
        setTimeout(() => {
          contactForm.style.display = "none"
          formSuccess.style.display = "block"
        }, 1500)
      })
    }
  
    // Reset form
    if (resetFormButton) {
      resetFormButton.addEventListener("click", () => {
        contactForm.reset()
        contactForm.style.display = "grid"
        formSuccess.style.display = "none"
  
        const submitButton = document.getElementById("submit-button")
        submitButton.disabled = false
        submitButton.innerHTML = `
          <i class="fas fa-paper-plane"></i>
          <span>Send Melding</span>
        `
      })
    }
  
    // Form field animations
    const formFields = document.querySelectorAll(".form-group input, .form-group textarea")
  
    formFields.forEach((field) => {
      field.addEventListener("focus", function () {
        this.parentElement.style.transform = "translateX(5px)"
        this.parentElement.style.transition = "transform 0.3s"
      })
  
      field.addEventListener("blur", function () {
        this.parentElement.style.transform = "translateX(0)"
      })
    })
  })
  
  