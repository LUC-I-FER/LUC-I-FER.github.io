// ================= THEME TOGGLE =================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme or prefer-color-scheme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

// Set initial theme
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Toggle theme
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', newTheme);
});

// ================= MOBILE NAV TOGGLE =================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.innerHTML = navMenu.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// ================= TYPING EFFECT =================
const typingText = document.getElementById('typingText');
const roles = [
  'Electronics & Telecommunication Engineer',
  'Full-Stack Developer',
  'AI & EDA Enthusiast',
  'Embedded Systems Researcher'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function type() {
  if (isPaused) return;
  
  const currentRole = roles[roleIndex];
  
  if (!isDeleting) {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    
    if (charIndex === currentRole.length) {
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, 500);
      }, 2000);
      return;
    }
  } else {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  
  setTimeout(type, isDeleting ? 50 : 100);
}

// Start typing effect
setTimeout(type, 1000);

// ================= SKILLS =================
fetch("data/skills.json")
  .then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then((data) => {
    const container = document.getElementById("skills-container");
    
    // Clear loading state
    container.innerHTML = '';
    
    data.skills.forEach((skill) => {
      const card = document.createElement("div");
      card.className = "card skill-card";
      
      const title = document.createElement("h3");
      title.innerHTML = `<i class="fas fa-${getSkillIcon(skill.title)}"></i>${skill.title}`;
      
      const ul = document.createElement("ul");
      skill.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      
      card.appendChild(title);
      card.appendChild(ul);
      container.appendChild(card);
    });
    
    // Initialize horizontal scroll
    initHorizontalScroll();
  })
  .catch((err) => {
    console.error("Error loading skills:", err);
    document.getElementById("skills-container").innerHTML = 
      '<p class="error">Failed to load skills. Please try again later.</p>';
  });

function getSkillIcon(title) {
  const icons = {
    'Frontend': 'paint-brush',
    'Backend': 'server',
    'AI/ML': 'robot',
    'Electronics & EDA': 'microchip',
    'Embedded Systems': 'microchip',
    'Tools': 'tools'
  };
  
  return icons[title] || 'code';
}

// ================= HORIZONTAL SCROLL =================
function initHorizontalScroll() {
  const scrollContainers = document.querySelectorAll('.horizontal-scroll');
  const leftArrows = document.querySelectorAll('.scroll-indicator.left');
  const rightArrows = document.querySelectorAll('.scroll-indicator.right');
  
  scrollContainers.forEach((container, index) => {
    // Mouse wheel scroll
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY * 0.5;
    }, { passive: false });
    
    // Arrow navigation
    if (leftArrows[index]) {
      leftArrows[index].addEventListener('click', () => {
        container.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
    
    if (rightArrows[index]) {
      rightArrows[index].addEventListener('click', () => {
        container.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
}

// ================= EXPERIENCE =================
let currentExperienceFilter = 'all';
let experiencesData = [];

fetch("data/experience.json")
  .then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then((data) => {
    experiencesData = data.experiences;
    
    // Sort experiences by start date (newest first)
    experiencesData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    // Initialize timeline
    initExperienceTimeline();
    
    // Initialize filters
    initExperienceFilters();
    
    // Render experience cards
    renderExperienceCards();
  })
  .catch((err) => {
    console.error("Error loading experience:", err);
    document.getElementById("experience-container").innerHTML = 
      '<p class="error">Failed to load experience data. Please try again later.</p>';
  });

function initExperienceTimeline() {
  const timelineTrack = document.getElementById("experience-track");
  
  // Clear loading state
  timelineTrack.innerHTML = '';
  
  // Get unique years from experiences
  const years = [...new Set(experiencesData.map(exp => {
    const date = new Date(exp.startDate);
    return date.getFullYear();
  }))].sort((a, b) => b - a);
  
  // Create timeline items
  years.forEach(year => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.dataset.year = year;
    
    const experiencesForYear = experiencesData.filter(exp => {
      const expYear = new Date(exp.startDate).getFullYear();
      return expYear === year;
    });
    
    timelineItem.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-date">${year}</div>
      <div class="timeline-company">${experiencesForYear[0]?.company || ''}</div>
    `;
    
    timelineItem.addEventListener('click', () => {
      // Scroll to experiences from this year
      const yearCards = document.querySelectorAll(`[data-year="${year}"]`);
      if (yearCards.length > 0) {
        yearCards[0].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      // Update active timeline item
      document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('active');
      });
      timelineItem.classList.add('active');
    });
    
    timelineTrack.appendChild(timelineItem);
  });
  
  // Set first item as active
  const firstItem = timelineTrack.querySelector('.timeline-item');
  if (firstItem) {
    firstItem.classList.add('active');
  }
}

function initExperienceFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update current filter
      currentExperienceFilter = button.dataset.filter;
      
      // Re-render cards
      renderExperienceCards();
    });
  });
}

function renderExperienceCards() {
  const container = document.getElementById("experience-container");
  
  // Clear container
  container.innerHTML = '';
  
  // Filter experiences based on current filter
  let filteredExperiences = experiencesData;
  if (currentExperienceFilter !== 'all') {
    filteredExperiences = experiencesData.filter(exp => exp.type === currentExperienceFilter);
  }
  
  // Create cards for filtered experiences
  filteredExperiences.forEach(experience => {
    const year = new Date(experience.startDate).getFullYear();
    
    const card = document.createElement("div");
    card.className = "experience-card";
    card.dataset.year = year;
    card.dataset.type = experience.type;
    
    const hasCertificate = experience.certificate || experience.certificateUrl;
    
    card.innerHTML = `
      <div class="experience-header">
        <img src="${experience.image}" 
             alt="${experience.title}" 
             class="experience-image"
             onerror="this.src='https://via.placeholder.com/600x400/0f172a/38bdf8?text=${encodeURIComponent(experience.company)}'">
        <span class="experience-type ${experience.type}">
          ${experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
        </span>
      </div>
      <div class="experience-content">
        <h3 class="experience-title">${experience.title}</h3>
        <div class="experience-company">
          <i class="fas fa-building"></i>
          ${experience.company}
        </div>
        <div class="experience-duration">
          <i class="far fa-calendar-alt"></i>
          ${experience.duration}
        </div>
        <p class="experience-description">${experience.description}</p>
        <div class="experience-tech">
          ${experience.technologies.slice(0, 3).map(tech => `<span>${tech}</span>`).join('')}
          ${experience.technologies.length > 3 ? '<span>+' + (experience.technologies.length - 3) + ' more</span>' : ''}
        </div>
        <div class="experience-actions">
          <button class="experience-btn details" data-id="${experience.id}">
            <i class="fas fa-eye"></i> View Details
          </button>
          ${hasCertificate ? `
            <a href="${experience.certificate || experience.certificateUrl}" 
               class="experience-btn certificate" 
               ${experience.certificateUrl ? 'target="_blank"' : 'download'}
               data-id="${experience.id}">
              <i class="fas fa-certificate"></i> Certificate
            </a>
          ` : `
            <span class="experience-btn certificate disabled">
              <i class="fas fa-certificate"></i> No Certificate
            </span>
          `}
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // Add click handlers for detail buttons
  document.querySelectorAll('.experience-btn.details').forEach(button => {
    button.addEventListener('click', (e) => {
      const experienceId = parseInt(e.currentTarget.dataset.id);
      showExperienceModal(experienceId);
    });
  });
}

function showExperienceModal(experienceId) {
  const experience = experiencesData.find(exp => exp.id === experienceId);
  if (!experience) return;
  
  const modal = document.getElementById('experienceModal');
  const modalBody = document.getElementById('modalBody');
  
  const hasCertificate = experience.certificate || experience.certificateUrl;
  
  modalBody.innerHTML = `
    <div class="modal-header">
      <span class="modal-type ${experience.type}">
        ${experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
      </span>
      <h1 class="modal-title">${experience.title}</h1>
      <h2 class="modal-subtitle">
        <i class="fas fa-building"></i>
        ${experience.company}
      </h2>
      <div class="modal-duration">
        <i class="far fa-calendar-alt"></i>
        ${experience.duration} • ${experience.location}
      </div>
    </div>
    
    <div class="modal-image">
      <img src="${experience.image}" 
           alt="${experience.title}"
           onerror="this.src='https://via.placeholder.com/900x400/0f172a/38bdf8?text=${encodeURIComponent(experience.company)}'">
    </div>
    
    <div class="modal-content-grid">
      <div class="modal-description">
        <h3>About This Experience</h3>
        ${experience.fullDescription.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
        
        <h3>Key Highlights</h3>
        <div class="modal-highlights">
          <ul>
            ${experience.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="modal-sidebar">
        <div class="modal-tech">
          <h4><i class="fas fa-code"></i> Technologies Used</h4>
          <div class="modal-tech-items">
            ${experience.technologies.map(tech => `<span class="modal-tech-item">${tech}</span>`).join('')}
          </div>
        </div>
        
        <div class="modal-skills">
          <h4><i class="fas fa-star"></i> Skills Gained</h4>
          <div class="modal-tech-items">
            ${experience.skillsGained.map(skill => `<span class="modal-tech-item">${skill}</span>`).join('')}
          </div>
        </div>
        
        ${hasCertificate ? `
          <div class="modal-certificate">
            <h4><i class="fas fa-certificate"></i> Certificate</h4>
            <a href="${experience.certificate || experience.certificateUrl}" 
               class="btn primary"
               ${experience.certificateUrl ? 'target="_blank"' : 'download'}>
              <i class="fas fa-download"></i> Download Certificate
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal functionality
const modal = document.getElementById('experienceModal');
const modalClose = document.getElementById('modalClose');

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
  document.body.style.overflow = '';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ================= PROJECTS =================
let currentProject = 0;

fetch("data/projects.json")
  .then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then((data) => {
    const track = document.getElementById("projects-track");
    const dotsContainer = document.getElementById("projectsDots");
    
    // Clear loading state
    track.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    data.projects.forEach((project, index) => {
      // Create project card
      const card = document.createElement("div");
      card.className = "project-card";
      card.dataset.index = index;
      
      card.innerHTML = `
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/600x400/0f172a/38bdf8?text=${encodeURIComponent(project.title)}'">
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <div class="project-tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <p>${project.description}</p>
          <div class="project-links">
            ${project.source ? `<a href="${project.source}" target="_blank" class="btn primary"><i class="fab fa-github"></i> View Code</a>` : ''}
            ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn secondary"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
          </div>
        </div>
      `;
      track.appendChild(card);
      
      // Create dot indicator
      const dot = document.createElement("div");
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.dataset.index = index;
      dot.addEventListener('click', () => {
        goToProject(index);
      });
      dotsContainer.appendChild(dot);
    });
    
    // Initialize project slider
    initProjectSlider();
  })
  .catch((err) => {
    console.error("Error loading projects:", err);
    document.getElementById("projects-track").innerHTML = 
      '<p class="error">Failed to load projects. Please try again later.</p>';
  });

function initProjectSlider() {
  const projectsScroll = document.getElementById("projects-scroll");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  const dots = document.querySelectorAll(".dot");
  const projectCards = document.querySelectorAll(".project-card");
  
  function updateActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentProject = index;
  }
  
  function goToProject(index) {
    const card = projectCards[index];
    if (card) {
      projectsScroll.scrollTo({
        left: card.offsetLeft - projectsScroll.offsetLeft,
        behavior: 'smooth'
      });
      updateActiveDot(index);
    }
  }
  
  // Previous button
  prevBtn.addEventListener("click", () => {
    const newIndex = (currentProject - 1 + projectCards.length) % projectCards.length;
    goToProject(newIndex);
  });
  
  // Next button
  nextBtn.addEventListener("click", () => {
    const newIndex = (currentProject + 1) % projectCards.length;
    goToProject(newIndex);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newIndex = (currentProject - 1 + projectCards.length) % projectCards.length;
      goToProject(newIndex);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const newIndex = (currentProject + 1) % projectCards.length;
      goToProject(newIndex);
    }
  });
  
  // Auto-scroll detection
  projectsScroll.addEventListener('scroll', () => {
    const scrollLeft = projectsScroll.scrollLeft;
    const cardWidth = projectCards[0]?.offsetWidth || 0;
    const gap = 30;
    
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    if (newIndex >= 0 && newIndex < projectCards.length) {
      updateActiveDot(newIndex);
    }
  });
  
  // Touch/swipe support
  let startX = 0;
  let scrollLeft = 0;
  
  projectsScroll.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - projectsScroll.offsetLeft;
    scrollLeft = projectsScroll.scrollLeft;
  });
  
  projectsScroll.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const x = e.touches[0].pageX - projectsScroll.offsetLeft;
    const walk = (x - startX) * 2;
    projectsScroll.scrollLeft = scrollLeft - walk;
  });
}

// ================= RESEARCH PAPERS =================
fetch("data/research.json")
  .then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then((data) => {
    const container = document.getElementById("research-container");
    
    // Clear loading state
    container.innerHTML = '';
    
    data.research.forEach((paper) => {
      const card = document.createElement("div");
      card.className = "research-card";
      
      const statusClass = paper.status.toLowerCase().replace(/\s+/g, '-');
      
      card.innerHTML = `
        <div class="research-meta">
          <span class="status ${statusClass}">${paper.status}</span>
          <span class="year">${paper.year}</span>
        </div>
        <h3>${paper.title}</h3>
        <p class="research-abstract">${paper.abstract}</p>
        <div class="research-tags">
          ${paper.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="research-links">
          ${paper.links.map((link) => 
            `<a href="${link.url}" target="_blank">
              <i class="fas fa-${getLinkIcon(link.label)}"></i> ${link.label}
            </a>`
          ).join("")}
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Error loading research papers:", err);
    document.getElementById("research-container").innerHTML = 
      '<p class="error">Failed to load research papers. Please try again later.</p>';
  });

function getLinkIcon(label) {
  const icons = {
    'PDF': 'file-pdf',
    'DOI': 'link',
    'Code': 'code',
    'Preprint': 'file-alt',
    'GitHub': 'github',
    'Paper': 'file-alt'
  };
  
  return icons[label] || 'external-link-alt';
}

// ================= CONTACT FORM =================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    submitBtn.style.background = 'var(--success)';
    
    // Reset form
    contactForm.reset();
    
    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  });
}

// ================= BACK TO TOP =================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================= SMOOTH SCROLL FOR ANCHOR LINKS =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ================= LOADING STATE =================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Initialize particles
  if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', 'js/particles-config.json', function() {
      console.log('Particles.js loaded');
    });
  }
});

// ================= ERROR HANDLING =================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// ================= PLACEHOLDER IMAGES =================
function handleImageError(img) {
  img.src = 'https://via.placeholder.com/600x400/0f172a/38bdf8?text=Project+Image';
  img.alt = 'Placeholder image';
}