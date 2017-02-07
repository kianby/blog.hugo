Title: Notes sur Python
Slug: python

[<i class="fa fa-home fa-2x" aria-hidden="true"></i>](notes.html)

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Packaging express avec Wheel

Création des dépendances au format wheel

~~~{.lang-bash}
pip wheel --wheel-dir=/tmp/dist/ -r requirements.txt
~~~

Réinstallation des dépendances sur une autre machine (globalement ou dans un virtualenv)

~~~{.lang-bash}
pip install --no-index --find-links=/tmp/dist -r requirements.txt
~~~

Réinstallation des dépendances depuis un serveur HTTP :

~~~{.lang-bash}
pip install --no-index --trusted-host [IP] -f http://[IP]/[URL] -r requirements.txt
~~~
