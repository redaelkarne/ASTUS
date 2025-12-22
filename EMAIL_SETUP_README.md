# Configuration du système d'envoi d'emails avec EmailJS

Ce site utilise désormais **EmailJS** pour envoyer des emails directement depuis le navigateur, sans avoir besoin d'un serveur backend (PHP, Node.js, etc.).

## Configuration requise

Pour que le formulaire de contact fonctionne, vous devez créer un compte sur [EmailJS](https://www.emailjs.com/) et configurer les identifiants dans le fichier `contact.html`.

### Étapes de configuration

1.  **Créer un compte EmailJS**
    *   Allez sur [https://www.emailjs.com/](https://www.emailjs.com/) et inscrivez-vous gratuitement.

2.  **Créer un Service Email**
    *   Dans le tableau de bord EmailJS, allez dans l'onglet "Email Services".
    *   Cliquez sur "Add New Service".
    *   Choisissez votre fournisseur d'email (Gmail, Outlook, etc.) ou SMTP personnalisé.
    *   Notez l'ID du service (ex: `service_xyz123`).

3.  **Créer un Modèle d'Email (Template)**
    *   Allez dans l'onglet "Email Templates".
    *   Cliquez sur "Create New Template".
    *   Configurez le sujet et le contenu de l'email.
    *   Utilisez les variables correspondant aux champs de votre formulaire :
        *   `{{name}}` : Nom de l'expéditeur
        *   `{{email}}` : Email de l'expéditeur
        *   `{{subject}}` : Sujet du message
        *   `{{message}}` : Contenu du message
        *   `{{contact-person}}` : Service contacté (optionnel)
    *   Sauvegardez et notez l'ID du modèle (ex: `template_abc456`).

4.  **Récupérer votre Clé Publique**
    *   Allez dans l'onglet "Account" (ou cliquez sur votre nom en haut à droite).
    *   Copiez votre "Public Key".

5.  **Mettre à jour le code**
    *   Ouvrez le fichier `contact.html`.
    *   Allez tout en bas du fichier, avant la fermeture de la balise `</body>`.
    *   Remplacez les valeurs suivantes dans le script :

    ```javascript
    emailjs.init("5tp05hrVMWzkOjGmx"); 
    
    // ...
    
    emailjs.sendForm('service_rl9c9sw', 'template_2zg2tlq', this)
    ```

## Fonctionnement

Le script intercepte l'envoi du formulaire, empêche le rechargement de la page, et envoie les données directement aux serveurs d'EmailJS, qui se chargent ensuite de vous envoyer l'email.

## Dépannage

*   Si l'email ne part pas, ouvrez la console du navigateur (F12 > Console) pour voir les erreurs.
*   Vérifiez que les identifiants sont corrects :
    *   Service ID : `service_rl9c9sw`
    *   Template ID : `template_2zg2tlq`
    *   Public Key : `5tp05hrVMWzkOjGmx`
*   Vérifiez que les noms des variables dans votre Template EmailJS correspondent aux attributs `name` de vos champs HTML (`name`, `email`, `subject`, `message`).
