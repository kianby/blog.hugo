+++
title = "Hugo et les URLs"
date = "2019-02-08"
categories = ["Blog"]
+++

J'ai publié le dernier article avec un accent dans l'URL : https://blogduyax.madyanne.fr/2019/bilan-h%C3%A9bergement-2018/ 

Le moteur de blog Hugo compose lui-même l'URL à partir du titre de l'article. C'est commode mais toujours heureux. Et le temps que je m'en aperçoive, trois commentaires avaient été postés sur l'article. Que fait-on quand un a bug non corrigé par ~~manque de temps~~ **fainéantise** dans [son système de gestion de commentaires](https://github.com/kianby/stacosys) ?

1. on corrige le bug 
2. on modifie l'URL de l'article

La première option est trop dure un vendredi soir donc j'ai opté pour la seconde. 

Modifier une URL avec Hugo, ce n'est pas difficile : il suffit de rajouter un **slug** à l'entête de l'article pour définir soi-même l'URL :

    slug = "bilan-hebergement-2018"

Et paf, l'article est accessible ici : https://blogduyax.madyanne.fr/2019/bilan-hebergement-2018/

Mais quid des agrégateurs de liens comme [le Journal du Hacker](https://www.journalduhacker.net) et des lecteurs qui ont mis l'article en favori ? Ils vont se retrouver avec une belle erreur 404. Alors, dans le temps, j'aurais défini un alias au niveau du serveur HTTP (NginX dans mon cas) pour rediriger l'ancienne URL vers la nouvelle. Et j'aurais eu une belle configuration NginX au bout de quelques années sans vraiment savoir si tout est pertinent. Hugo propose une notion d'alias qui génère directement une page de redirection de l'ancienne URL vers le nouvel emplacement. 

Ca se règle donc au niveau de l'article en ajoutant les propriétés   **slug** et **alias** à l'entête : 

    +++
    title = "Bilan hébergement 2018"
    date = "2019-02-07"
    slug = "bilan-hebergement-2018"
    aliases = ["/2019/bilan-hébergement-2018/"]
    categories = ["Hébergement"]
    tags = ["planet"] 
    +++


Merci Victor ;-)
