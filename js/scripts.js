// === SHARED MODAL FUNCTIONS ===
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';
}

// === PAGE-SPECIFIC CODE ===
document.addEventListener('DOMContentLoaded', () => {
  // ===== METHODS.HTML CODE =====
  if (document.querySelector('.method-card')) {
    // Modal triggers for methods.html
    document.querySelectorAll('.method-card').forEach(card => {
      card.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        openModal(modalId);
      });
    });
  }

  // ===== INDEX.HTML CODE =====
  const logo = document.querySelector('.logo');
  if (logo) {
    // Logo animation (index.html)
    logo.style.animation = 'float 4s ease-in-out infinite';
    
    // Hover effects (index.html)
    document.querySelectorAll('.btn, .feature, .action-btn, .tool-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-3px)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // === SHARED EVENT LISTENERS ===
  // Close modals when clicking outside (works on both pages)
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      closeModal(event.target.id);
    }
  });
});