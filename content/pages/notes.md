Title: Mes notes techniques
Slug: notes

Par catégorie : [MySQL](mysql.html)

Et le reste en vrac <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Réinstaller le fichier de configuration d'origine d'un paquet Debian

Exemple avec le fichier */etc/rkhunter.conf* du paquet **rkhunter** :

~~~~{.lang-bash}
  apt-get -o Dpkg::Options::="--force-confmiss" install --reinstall rkhunter
~~~~
