Title: Mes notes techniques
Slug: notes

Par catégorie : [MySQL](mysql.html) / [Java](java.html) / [Python](python.html)

Et le reste en vrac <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Réinstaller le fichier de configuration d'origine d'un paquet Debian

Exemple avec le fichier */etc/rkhunter.conf* du paquet **rkhunter** :

~~~~{.lang-bash}
apt-get -o Dpkg::Options::="--force-confmiss" install --reinstall rkhunter
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Supprimer les verrous d'une arborescence SVN

~~~~{.lang-bash}
find . -path ./.svn -prune -o -print -exec svn propdel svn:needs-lock {} \;
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Chroot

Chrooter :

~~~~{.lang-bash}
mount /dev/sdX /mnt
mount /dev/sdY /mnt/boot
cd /mnt
mount -t proc proc proc/
mount --rbind /sys sys/
mount --rbind /dev dev/
chroot /mnt /bin/bash
~~~~

En sortir :

~~~~{.lang-bash}
exit
umount --recursive /mnt
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Trouver le Master Browser Ms Windows

~~~~{.lang-bash}
nmblookup -S -M -- -.
~~~~