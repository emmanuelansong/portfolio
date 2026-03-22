function scrollToProjects() {
  document.getElementById('projects').scrollIntoView({
    behavior: 'smooth'
  });
}

function openProject(page) {
  window.location.href = page;
}
