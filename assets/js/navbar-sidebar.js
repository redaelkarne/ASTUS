/**
 * Navbar functionality - optimisé pour sidebar mobile
 * Version simplifiée avec focus sur la fonctionnalité d'ouverture/fermeture
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Sélection des éléments DOM
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');
  const header = document.querySelector('#header');
  
  // Vérifier que tous les éléments sont présents
  if (!mobileNavToggle || !navbar || !header) {
    console.error("Éléments manquants pour la navigation mobile");
    return;
  }
  
  // Fonction pour ouvrir le menu mobile
  function openMobileMenu() {
    navbar.classList.add('navbar-mobile');
    header.classList.add('mobile-menu-active');
    
    mobileNavToggle.classList.remove('bi-list');
    mobileNavToggle.classList.add('bi-x');
  }
  
  // Fonction pour fermer le menu mobile
  function closeMobileMenu() {
    navbar.classList.remove('navbar-mobile');
    header.classList.remove('mobile-menu-active');
    
    mobileNavToggle.classList.remove('bi-x');
    mobileNavToggle.classList.add('bi-list');
  }
  
  // Gestion du clic sur le bouton du menu mobile
  mobileNavToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Simple toggle entre les deux états
    if (navbar.classList.contains('navbar-mobile')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  
  // Fermer le menu quand on clique sur un lien dans le menu
  const navLinks = document.querySelectorAll('.navbar .nav-link, .navbar .btn-client, .navbar .btn-quote');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (navbar.classList.contains('navbar-mobile')) {
        closeMobileMenu();
      }
    });
  });
  
  // Ajouter un écouteur d'événement sur le document pour fermer le menu
  // quand on clique en dehors
  document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Si on clique en dehors du menu et du bouton toggle, on ferme le menu
    if (navbar.classList.contains('navbar-mobile') && 
        !navbar.contains(target) && 
        !mobileNavToggle.contains(target)) {
      closeMobileMenu();
    }
  });
  
  // Gérer le scroll de la page
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
  
  // Initialisation de l'état
  if (window.innerWidth <= 991) {
    // S'assurer que le menu est bien fermé au démarrage sur mobile
    closeMobileMenu();
  }
});
