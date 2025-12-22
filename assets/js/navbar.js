/**
 * Navbar functionality - version simplifiée
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("Initialisation de la navbar simplifiée");
  
  // Éléments principaux
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');
  const header = document.querySelector('#header');

  // Vérification des éléments
  console.log("Bouton mobile trouvé:", !!mobileNavToggle);
  console.log("Navbar trouvée:", !!navbar);
  console.log("Header trouvé:", !!header);
  
  if (!mobileNavToggle || !navbar || !header) {
    console.error("Éléments manquants pour le menu mobile");
    return;
  }

  // S'assurer que le menu est initialement fermé
  navbar.classList.remove('navbar-mobile');
  header.classList.remove('mobile-menu-active');
  
  // Configuration simplifiée de l'événement click
  mobileNavToggle.addEventListener('click', function(e) {
    console.log("Clic sur le bouton mobile détecté");
    e.preventDefault();
    e.stopPropagation();
    
    // Basculer l'état du menu
    const isMenuOpen = navbar.classList.contains('navbar-mobile');
    console.log("État actuel du menu:", isMenuOpen ? "Ouvert" : "Fermé");
    
    if (isMenuOpen) {
      // Fermer le menu
      navbar.classList.remove('navbar-mobile');
      header.classList.remove('mobile-menu-active');
      if (mobileNavToggle.querySelector('i')) {
        mobileNavToggle.querySelector('i').classList.add('bi-list');
        mobileNavToggle.querySelector('i').classList.remove('bi-x');
      }
      document.body.style.overflow = '';
      console.log("Menu fermé");
    } else {
      // Ouvrir le menu
      navbar.classList.add('navbar-mobile');
      header.classList.add('mobile-menu-active');
      if (mobileNavToggle.querySelector('i')) {
        mobileNavToggle.querySelector('i').classList.remove('bi-list');
        mobileNavToggle.querySelector('i').classList.add('bi-x');
      }
      document.body.style.overflow = 'hidden';
      console.log("Menu ouvert");
    }
  });

  // Le reste du code reste inchangé
});

  // Toggle du menu mobile
  if (mobileNavToggle) {
    console.log("Ajout de l'événement click sur le bouton mobile");
    mobileNavToggle.addEventListener('click', function(e) {
      console.log("Clic sur le bouton mobile détecté");
      e.preventDefault();
      e.stopPropagation();
      
      if (navbar.classList.contains('navbar-mobile')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Fermer le menu quand on clique sur un lien
  const navbarLinks = document.querySelectorAll('#navbar .nav-link, #navbar .btn-client, #navbar .btn-quote');
  navbarLinks.forEach(function(navLink) {
    navLink.addEventListener('click', function() {
      if (navbar.classList.contains('navbar-mobile')) {
        closeMobileMenu();
      }
    });
  });

  // Fermer le menu quand on clique en dehors
  document.addEventListener('click', function(e) {
    if (navbar.classList.contains('navbar-mobile') && 
        !navbar.contains(e.target) && 
        !mobileNavToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Gérer le scroll de la page
  window.addEventListener('scroll', function() {
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }
  });

  // Gestion de la page active
  const currentPage = window.location.pathname.split('/').pop();
  const menuItems = document.querySelectorAll('#navbar .nav-link');
  
  if (currentPage === '' || currentPage === '/' || currentPage === 'index.html') {
    const homeLink = document.querySelector('#navbar .nav-link[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
  } else {
    menuItems.forEach(function(menuItem) {
      const menuItemHref = menuItem.getAttribute('href');
      if (currentPage === menuItemHref) {
        menuItem.classList.add('active');
      } else if (currentPage.includes('Permanences-Téléphonique.html') || 
                currentPage.includes('Telealarme.html') || 
                currentPage.includes('Intervention.html')) {
        if (menuItemHref === 'services.html' || menuItemHref === '#services-section') {
          menuItem.classList.add('active');
        }
      }
    });
  }

  // Gestion du modal
  const openFormButton = document.getElementById('openFormButton');
  if (openFormButton) {
    openFormButton.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = document.getElementById('myModal');
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
          closeBtn.onclick = function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          }
        }

        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          }
        }
      }
    });
  }

  // Gestion du deuxième bouton pour le modal
  const openFormButton2 = document.getElementById('openFormButton2');
  if (openFormButton2) {
    openFormButton2.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = document.getElementById('myModal');
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  }
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991) {
      // Si on passe en mode desktop, on remet tout à zéro
      closeMobileMenu();
    }
  });

