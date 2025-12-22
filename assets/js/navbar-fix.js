/**
 * Correction pour le menu mobile
 */
window.addEventListener('load', function() {
  console.log("Initialisation du menu mobile");
  
  // Sélectionner les éléments concernés
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');
  const header = document.querySelector('#header');
  
  // Vérifier si les éléments existent
  if (!navbar || !mobileNavToggle || !header) return;
  
  // Ajouter un gestionnaire d'événements pour le bouton du menu
  mobileNavToggle.addEventListener('click', function(e) {
    console.log("Clic sur le bouton mobile - fix");
    e.preventDefault();
    e.stopPropagation();
    
    // Basculer les classes pour ouvrir/fermer le menu
    navbar.classList.toggle('navbar-mobile');
    header.classList.toggle('mobile-menu-active');
    
    // Basculer l'icône
    const icon = mobileNavToggle.querySelector('i');
    if (icon) {
      if (navbar.classList.contains('navbar-mobile')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
      } else {
        icon.classList.add('bi-list');
        icon.classList.remove('bi-x');
      }
    }
  });
});
