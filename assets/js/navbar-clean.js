/**
 * Basic navigation functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Sélectionner les éléments du menu
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');
  const header = document.querySelector('#header');
  
  // Vérifier que tous les éléments sont présents
  if (!mobileNavToggle || !navbar || !header) {
    return;
  }

  // Toggle du menu mobile - fonction simplifiée
  mobileNavToggle.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Toggle des classes pour le menu
    navbar.classList.toggle('navbar-mobile');
    header.classList.toggle('mobile-menu-active');
    
    // Toggle de l'icône hamburger/close
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });
  
  // Fermer le menu quand on clique sur un lien
  const navLinks = document.querySelectorAll('#navbar a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        header.classList.remove('mobile-menu-active');
        mobileNavToggle.classList.add('bi-list');
        mobileNavToggle.classList.remove('bi-x');
      }
    });
  });
  
  // Fermer le menu quand on clique en dehors
  document.addEventListener('click', function(e) {
    if (navbar.classList.contains('navbar-mobile') && 
        !navbar.contains(e.target) && 
        !mobileNavToggle.contains(e.target)) {
      navbar.classList.remove('navbar-mobile');
      header.classList.remove('mobile-menu-active');
      mobileNavToggle.classList.add('bi-list');
      mobileNavToggle.classList.remove('bi-x');
    }
  });
  
  // Gestion du scroll - header fixe
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
  
  // Gestion de la page active
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === '' || currentPage === '/' || currentPage === 'index.html') {
    document.querySelector('#navbar a[href="index.html"]')?.classList.add('active');
  } else {
    document.querySelector('#navbar a[href="' + currentPage + '"]')?.classList.add('active');
  }
});

