## Choix techniques

- Arborescence du projet : 
    -- un dossier components, qui regroupe les 3 composants demandés : UserListComponent, UserDetailsComponent et UserFormComponent

    -- un dossier interface, dans lequel sont définit les models de données User et Post, afin de typer les données quand nécessaire

    -- un dossier services, qui englobe le UserService, où toutes les méthodes CRUD nécessaires sont définies : 
        --- GET https://jsonplaceholder.typicode.com/users
        --- GET https://jsonplaceholder.typicode.com/users/:id
        --- GET https://jsonplaceholder.typicode.com/users/:id/posts
        --- PUT https://jsonplaceholder.typicode.com/users/:id
        --- POST https://jsonplaceholder.typicode.com/users

    -- un dossier state, afin de gérer l'état à l'aide de la librairie Akita

- State :
    -- l'API n'étant pas modulable, il faut gérer les users ajoutés manuellement. Il y a donc une logique dans le UserService (updateUser()) pour modifier les user provenant de l'API (PUT) et ceux qui ont été créés (update du store).

- Routing :
    -- à l'entrée du projet, on arrive directement sur la liste des users

    -- uniquement au clic sur un user, le component UserDetailsComponent est chargé avec ses données, grâce au lazy loading et l'utilisation de loadComponent()

    -- l'affectation de l'id du user dans l'url se fait grâce au paramètre dynamique :id

- Styles : 
    -- interface responsive grâce au media queries

    -- utilisation de composants Bootstrap (icones)



## Axes d'amélioration
- Possibilité d'ajouter des posts pour un user donné
- Blocage des boutons lorsque les services sont en PROCESSING
- Ajout des tests avec JEST
- Ajout de message toast pour indiquer le succès ou les erreurs lors des appels métier
- Utilisation de Validateurs personnalisés et regroupés dans un dossier helpers afin de pouvoir les réutiliser facilement en cas de multiplication du formulaire, ce qui allègerait le code et le rendrait plus lisible
- Utilisation du 'control flow syntax'