+++
title = "Golang à la rescousse"
date = "2017-07-24"
categories = ["Développement", "Hébergement", "Blog"]
tags = ["planet"]
draft = true
+++

Dans l'[article précédent](/2017/performance-python-web) j'ai optimisé le
[système de gestion des commentaires
Stacosys](https://github.com/kianby/stacosys) en :

- remplaçant le serveur HTTP [Flask](http://flask.pocoo.org) par [Sanic](http://sanic.readthedocs.io)
- ajoutant un cache mémoire pour le nombre de commentaires par article

J'ai terminé sur une performance bien améliorée :

- plus de 11000 requêtes traitées en 1 minute
- un temps de requête moyen de 1,3 seconde
- une répartition du temps de traitement entre 81 ms et 18 secondes (assez élevé)
- 171 requêtes avec un temps de traitement > 10 secondes

Le mieux n'étant pas toujours l'ennemi du bien, j'ai effectué un test HTTP hors
contexte de Golang qui m'a convaincu que je pourrais m'en servir.
[Golang](https://golang.org) a la particularité d'être un langage compilé, typé,
multi-plateforme qui fournit  en standard des fonctionalités plutôt de haut
niveau comme HTTP (client et serveur), de la crypto et de la compression, le
support du JSON. [Le débat reste
ouvert](http://spf13.com/post/is-go-object-oriented) sur le fait que Golang soit
un langage orienté objet. En tout cas, il propose un paradigme de programmation
intéressant et une richesse de librairies qui le rendent très intéressant pour
du développement généraliste où la performance compte.

       

|       Serveur       | Workers |  Temps de réponse  | Requêtes | Erreurs |
| ------------------- |:-------:|:------------------:| --------:| -------:|
| Flask HTTPS         |    1    | 104 > 4194 > 32000 |     4043 |     326 |
| Sanic HTTPS + cache |    4    | 81 > 1152 > 12408  |    13558 |     210 |
| Sanic HTTPS + cache |    1    | 81 > 1367 > 18869  |    11589 |     171 |
| Golang HTTPS        |    ?    |  80 > 341 > 6745   |    14663 |     175 |

On arrive à des performances similaires en nombre de requêtes traitées mais avec
un temps de réponse divisé par 4. La démonstration ne tend à
