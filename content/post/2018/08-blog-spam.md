+++
title = "Spam des commentaires"
date = "2018-08-15"
categories = ["Blog", "Containers"]
tags = ["planet"] 
+++

Pour lutter contre le spam dans les commentaires du blog, j'ai opté pour la simplicité dès le début parce que l'audience est restreinte, que je ne veux pas compliquer la vie des lecteurs avec des systèmes de captchas (de plus en plus illisibles d'ailleurs) et que [je veux préserver l'accès au blog sans JavaScript](/2017/un-blog-plus-respectueux/) pour les durs, les vrais, les tatoués ;-)

Ma naïve défense est basée sur un [pot de miel](https://fr.wikipedia.org/wiki/Honeypot) : un champ caché dans le formulaire de saisie de commentaire, invisible pour l'humain normalement constitué, qui ne peut donc être rempli que par un bot qui analyse les pages HTML. Ces commentaires sont jetés directement par [mon gestionnaire de commentaires Stacosys](https://github.com/kianby/stacosys). Pendant longtemps, ce fut une défense suffisante ; de rares fois un facheux postait un commentaire pour me vanter un site de vente de pilules : je refusais le commentaire et voilà.

Mais depuis quelques temps, je reçois des rafales de spams : soit les robots sont plus efficaces et analysent aussi la CSS de la page, soit quelqu'un a embauché une armée de zombies pour poster manuellement sur tous les sites à moins de 100 visiteurs / jour. J'ai donc mis en place une 2ème ligne de défense. Quand j'étiquète *spam* le commentaire, Stacosys écrit une ligne de log avec l'adresse IP du spammeur, et [fail2ban](https://github.com/fail2ban/fail2ban) ajoute une règle *iptables* pour le bannir. La méthode n'est pas révolutionnaire, ça a demandé quelques lignes de code dans Stacosys ; ce qui est plus intéressant, c'est sa mise en oeuvre dans une architecture Docker avec un reverse proxy.

![Architecture Docker blog](/images/2018/docker-blog.png)

Nginx joue le rôle de *reverse proxy*, il balance les requêtes du blog vers Hugo et le post du formulaire vers Stacosys. Pour ne pas perdre l'adresse IP réelle du visiteur, on la propage jusqu'à Stacosys dans l'attribut HTTP *X-Forwarded-For*.

On a une configuration NginX de ce genre :

    location /newcomment {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://stacosys:8100/newcomment;
    }

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://nginx-blog;
    }

Stacosys est un container Docker donc l'application (PID 1) écrit ses logs dans la sortie standard (STDOUT) ; c'est le comportement par défaut. Mais, afin d'ajouter des règles *iptables*, le container **fail2ban** a besoin de lire ces logs. On va donc exporter les logs de stacosys vers le container **logger** en rajoutant une section **logging** dans le fichier *docker-compose* qui décrit le lancement du service **stacosys** :

    logging:
      driver: syslog
      options:
        syslog-address: "tcp://127.0.0.1:514"
        tag: "stacosys"

et le container **logger**, qui n'est rien d'autre qu'un serveur syslog, écrit ses logs dans un volume Docker :

    logger:
        image: bobrik/syslog-ng
    volumes:
        - syslog:/var/log/syslog-ng
    ports:
        - "514:514"

 Le volume de données **syslog** est partagé avec le container **fail2ban** qui peut ainsi lire les logs de stacosys, appliquer ses règles de filtrage et définir dynamiquement des règles *iptables* pour bannir les vilains.