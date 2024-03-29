+++
title = "Tmux et MSYS2"
date = "2019-03-02"
categories = ["GNU/Linux"]
tags = ["planet"] 
+++

Toujours condamné aux logiciels de l'éditeur de Redmond dans le milieu professionnel, je suis un fidèle utilisateur de [MSYS2](https://www.msys2.org/), un Cygwin auquel on a greffé Pacman... pas le mentos jaune mais le gestionnaire de paquet de ArchLinux. Mais pourquoi faire un truc pareil me direz-vous ? Et bien pas seulement pour le plaisir de la ligne de commande ! L'interface d'installation et mise à jour des paquets Cygwin ressemble à ça : 

![Sélection paquets Cygwin](/images/2019/cygwin-selectpackage.jpg)

Alors si je peux avoir la même chose avec une commande, vérifier la liste des dépendances que je vais installer au préalable, je dis banco : 

    pacman -S gcc-g++

MSYS2 a simplifié quelques trucs ; par exemple, les partitions Ms Windows sont directement sous la racine : /C, /D 

Ma principale utilisation de MSYS consiste à accéder de multiples serveurs distants par SSH et faire du copier-coller entre sessions mais aussi avec le presse-papier système, joliment surnommé *clipboard Windows*. Et c'est là qu'intervient mon outil console préféré : [tmux](https://tmux.github.io).

Tmux est supporté par MSYS2 dans sa version 2.8. J'avais un peu délaissé l'outil depuis la version 2.4, ce fut l'occasion de dépoussiérer ma configuration et d'obtenir des réglages qui fonctionnent aussi bien sur GNU/Linux que sur MSYS 2/Ms Windows.

Sous Cygwin le presse-papier est un device */dev/clipboard* et le copier de Ms Windows vers MSYS2 est géré de base : un SHIFT-INS colle dans MSYS2. Dans l'autre sens, il faut ajouter le nécessaire dans la configuration de TMUX. Je préfère le mode VIM plutôt que le mode EMACS donc ma configuration est en fonction :

    # copy to Ms Windows clipboard
    if -b '[ -c /dev/clipboard ]' 'bind-key -T copy-mode-vi y send-keys -X 
    copy-pipe-and-cancel "tmux save-buffer - > /dev/clipboard"'

La configuration complète est accessible sous Gitoube : https://github.com/kianby/dotfiles/blob/master/tmux/__tmux.conf

Et comme on est au 21ème siècle, j'ai réalisé une petite vidéo pour montrer le copier-coller en image avec ~~youteubé~~ [asciinema](https://asciinema.org). Désolé pour le sur-place dans la séquence entre 2 minutes et 2'50, j'ai fait une pause tisane ;-)

<script id="asciicast-231177" src="https://asciinema.org/a/231177.js" async></script>

Comme à la fin de toute vidéo, il y a un bonus ! Je cherchais aussi un outil pour réaliser une interface console de connexion aux serveurs SSH et, encore mieux, j'ai découvert le projet [sshto](https://github.com/vaniacer/sshto) qui exploite directement le fichier **~.ssh/config** pour construire automatiquement une telle interface.

![sshto](/images/2019/sshto.png)

Le mode console a encore de beaux jours devant lui !
