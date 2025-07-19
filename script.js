// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  }),
)

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.background = "#ffffff"
    header.style.backdropFilter = "none"
  }
})

// Appointment form handling
const appointmentForm = document.getElementById("appointmentForm")

appointmentForm.addEventListener("submit", function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const appointmentData = {
    name: formData.get("name") || document.getElementById("name").value,
    email: formData.get("email") || document.getElementById("email").value,
    phone: formData.get("phone") || document.getElementById("phone").value,
    department: formData.get("department") || document.getElementById("department").value,
    date: formData.get("date") || document.getElementById("date").value,
    message: formData.get("message") || document.getElementById("message").value,
  }

  // Basic validation
  if (
    !appointmentData.name ||
    !appointmentData.email ||
    !appointmentData.phone ||
    !appointmentData.department ||
    !appointmentData.date
  ) {
    showMessage("Please fill in all required fields.", "error")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(appointmentData.email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  // Phone validation (basic)
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(appointmentData.phone.replace(/\s/g, ""))) {
    showMessage("Please enter a valid phone number.", "error")
    return
  }

  // Date validation (not in the past)
  const selectedDate = new Date(appointmentData.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    showMessage("Please select a future date for your appointment.", "error")
    return
  }

  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Booking..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false

    // Show success message
    showMessage("Appointment booked successfully! We will contact you soon to confirm.", "success")

    // Reset form
    this.reset()

    // Log appointment data (in real app, this would be sent to server)
    console.log("Appointment Data:", appointmentData)
  }, 2000)
})

// Show message function
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".success-message, .error-message")
  existingMessages.forEach((msg) => msg.remove())

  // Create new message
  const messageDiv = document.createElement("div")
  messageDiv.className = type === "success" ? "success-message" : "error-message"
  messageDiv.textContent = message

  // Add message after the form
  const form = document.getElementById("appointmentForm")
  form.parentNode.insertBefore(messageDiv, form.nextSibling)

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 5000)
}

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up")
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".service-card, .doctor-card, .stat, .contact-item")
  animateElements.forEach((el) => observer.observe(el))
})

// Set minimum date for appointment booking (today)
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date")
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0]
    dateInput.setAttribute("min", today)
  }
})

// Doctor profile view (placeholder functionality)
document.querySelectorAll(".doctor-card .btn-outline").forEach((btn) => {
  btn.addEventListener("click", function () {
    const doctorCard = this.closest(".doctor-card")
    const doctorName = doctorCard.querySelector("h3").textContent
    const specialty = doctorCard.querySelector(".specialty").textContent

    alert(
      `Doctor Profile:\n\nName: ${doctorName}\nSpecialty: ${specialty}\n\nFull profile functionality would be implemented here.`,
    )
  })
})

// Service card hover effects
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
  })
})

// Statistics counter animation
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target + (element.textContent.includes("+") ? "+" : "")
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start) + (element.textContent.includes("+") ? "+" : "")
    }
  }, 16)
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat h3")
        statNumbers.forEach((stat) => {
          const text = stat.textContent
          const number = Number.parseInt(text.replace(/\D/g, ""))
          const hasPlus = text.includes("+")
          const hasSlash = text.includes("/")

          if (!hasSlash) {
            // Don't animate "24/7"
            stat.textContent = "0" + (hasPlus ? "+" : "")
            animateCounter(stat, number)
          }
        })
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

document.addEventListener("DOMContentLoaded", () => {
  const heroStats = document.querySelector(".hero-stats")
  if (heroStats) {
    statsObserver.observe(heroStats)
  }
})

// Emergency contact functionality
function showEmergencyContact() {
  alert(
    "Emergency Contact:\n\nPhone: +1 (555) 911-0000\nAddress: 123 Healthcare Avenue\n\nFor life-threatening emergencies, call 911 immediately.",
  )
}

// Add emergency button functionality if needed
document.addEventListener("DOMContentLoaded", () => {
  // You can add an emergency button to the header if needed
  // This is just a placeholder for emergency contact functionality
})

// Form field validation feedback
document
  .querySelectorAll("#appointmentForm input, #appointmentForm select, #appointmentForm textarea")
  .forEach((field) => {
    field.addEventListener("blur", function () {
      validateField(this)
    })

    field.addEventListener("input", function () {
      // Remove error styling when user starts typing
      this.style.borderColor = ""
    })
  })

function validateField(field) {
  let isValid = true
  const value = field.value.trim()

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    isValid = false
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
    }
  }

  // Phone validation
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(value.replace(/\s/g, ""))) {
      isValid = false
    }
  }

  // Date validation
  if (field.type === "date" && value) {
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      isValid = false
    }
  }

  // Apply styling based on validation
  if (!isValid) {
    field.style.borderColor = "#ef4444"
  } else {
    field.style.borderColor = "#10b981"
  }

  return isValid
}

// Lazy loading for images (if needed)
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
})

console.log("MediCare Plus website loaded successfully!")

 document.getElementById("chatbotBtn").onclick = function() {
    var modal = document.getElementById("chatbotModal");
    modal.style.display = (modal.style.display === "none") ? "block" : "none";
  }
