const nav = document.getElementById("nav");
const menuToggle = document.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Highlight the navigation item for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${entry.target.id}`
      );
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => observer.observe(section));

// Portfolio filtering.
const filters = document.querySelectorAll(".filter");
const works = document.querySelectorAll(".work-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    filter.classList.add("active");

    const category = filter.dataset.filter;

    works.forEach(work => {
      const visible = category === "all" || work.dataset.category === category;
      work.style.display = visible ? "" : "none";
    });
  });
});

// Demo contact form. Replace this with your Heroku API endpoint when ready.
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  let submitBtn = null
  const formChildren = form.children
  for (let c = 0; c < formChildren.length; c++) {
    const child = formChildren[c];
    if (child.type === 'submit') {
      submitBtn = child
      submitBtn.disabled = true
      submitBtn.innerText = "SENDING...";
      break
    }
  }
  const response = await fetch(
      `${useHttpsForApiCall ? 'https' : 'http'}://${apiServerUrl}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
        })
      }
  );

  const data = await response.json();
  const messageSent = data.success

  Swal.fire({
    title: messageSent ? "Message sent!" : "Sorry, message not sent :(",
    text: messageSent ? "Thanks, I will contact you back as soon as possible :)" : "Please, try again later",
    footer: !messageSent ? data.error || "Unknown error" : null,
    icon:  messageSent ? "success" : "error",
  })
  submitBtn.disabled = false
  submitBtn.innerText = "SEND MESSAGE";

  status.textContent = "Thanks for the message, I will contact you back as soon as possible :)";
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear().toString();

// Simple CV placeholder.
document.getElementById("downloadCv").addEventListener("click", (event) => {
  event.preventDefault();
  Swal.fire({
    title: "Missing CV",
    html: `
        Sorry, I still didn't upload my updated CV here
        <br/>
        For now, take a look at my <b><a target='_blank' href='https://linkedin.com/in/renan-niemietz-cardoso'>LinkedIn profile</a></b>
    `,
    icon:  "info",
  })
});

const apiServerUrl = 'niemietz-portfolio-59cf2e872675.herokuapp.com';
const useHttpsForApiCall = true;

document.getElementById("contactForm").addEventListener("submit", async (event) => {
  event.preventDefault();


});
