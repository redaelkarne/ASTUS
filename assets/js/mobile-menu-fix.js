/**
 * Script de réparation du menu mobile
 * Ce script ajoute le comportement nécessaire pour que le menu mobile
 * fonctionne correctement, quelle que soit la structure HTML.
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  console.log("Mobile menu fix script loaded");

  // Sélection des éléments DOM
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');
  const header = document.querySelector('#header');
  
  // Vérifier que tous les éléments sont présents
  if (!mobileNavToggle || !navbar || !header) {
    console.error("Éléments manquants pour la navigation mobile");
    return;
  }
  
  console.log("Mobile menu elements found:", { 
    toggle: mobileNavToggle, 
    navbar: navbar, 
    header: header 
  });
  
  // Fonction pour ouvrir le menu mobile
  function openMobileMenu() {
    console.log("Opening mobile menu");
    navbar.classList.add('navbar-mobile');
    header.classList.add('mobile-menu-active');
    document.body.style.overflow = 'hidden'; // Empêcher le défilement
    
    mobileNavToggle.classList.remove('bi-list');
    mobileNavToggle.classList.add('bi-x');
  }
  
  // Fonction pour fermer le menu mobile
  function closeMobileMenu() {
    console.log("Closing mobile menu");
    navbar.classList.remove('navbar-mobile');
    header.classList.remove('mobile-menu-active');
    document.body.style.overflow = 'auto'; // Réactiver le défilement
    
    mobileNavToggle.classList.remove('bi-x');
    mobileNavToggle.classList.add('bi-list');
  }
  
  // Ajouter les styles CSS nécessaires s'ils n'existent pas
  function addRequiredStyles() {
    // Vérifier si les styles sont déjà appliqués
    const styleId = 'mobile-menu-fix-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media (max-width: 991px) {
        .navbar-mobile {
          position: fixed !important;
          overflow-y: auto !important;
          top: 0 !important;
          right: 0 !important;
          left: 0 !important;
          bottom: 0 !important;
          background: rgba(40, 58, 90, 0.9) !important;
          transition: 0.3s !important;
          z-index: 999 !important;
          padding-top: 70px !important;
        }
        
        .navbar-mobile ul {
          display: block !important;
          position: absolute !important;
          top: 55px !important;
          right: 15px !important;
          bottom: 15px !important;
          left: 15px !important;
          padding: 10px 0 !important;
          border-radius: 10px !important;
          background-color: #fff !important;
          overflow-y: auto !important;
          transition: 0.3s !important;
        }
        
        .mobile-nav-toggle {
          display: block !important;
          cursor: pointer !important;
          z-index: 9999 !important;
        }
        
        .mobile-menu-active:before {
          content: '' !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0,0,0,0.5) !important;
          z-index: 996 !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log("Added required styles");
  }
  
  // Ajouter les styles requis
  addRequiredStyles();
  
  // Supprimer les écouteurs d'événements existants (si possible)
  const oldToggle = mobileNavToggle.cloneNode(true);
  mobileNavToggle.parentNode.replaceChild(oldToggle, mobileNavToggle);
  
  // Réassigner la référence après le clonage
  const newMobileNavToggle = document.querySelector('.mobile-nav-toggle');
  
  // Gestion du clic sur le bouton du menu mobile
  newMobileNavToggle.addEventListener('click', function(e) {
    console.log("Mobile toggle clicked");
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
        !newMobileNavToggle.contains(target)) {
      closeMobileMenu();
    }
  });
  
  // Initialisation de l'état
  if (window.innerWidth <= 991) {
    // S'assurer que le menu est bien fermé au démarrage sur mobile
    closeMobileMenu();
  }
  
  console.log("Mobile menu initialization complete");
});
