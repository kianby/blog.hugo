Title: Notes sur MySQL
Slug: mysql

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Désactiver la casse des noms de table

Ajouter le paramètre *lower_case_table_names = 1* dans la section [mysqld] de /etc/my.cnf 

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Afficher les résultats en ligne plutôt qu'en colonne

~~~~{.lang-sql}
SELECT * FROM user \G;
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Créer un utilisateur local

~~~~{.lang-sql}
CREATE USER 'john'@'localhost' IDENTIFIED BY 'secret';
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Modifier le mot de passe d'un utilisateur

~~~~{.lang-sql}
SET PASSWORD FOR 'root'@'%' = PASSWORD('secret');
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Désactiver les contraintes de clefs

~~~~{.lang-sql}
SET foreign_key_checks = 0;
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Tracer les requêtes SQL

Changer *general_log* et les traces partent (par défaut) dans */var/lib/mysql/*

~~~~{.lang-sql}
set global general_log=on;
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Connaître l'espace utilisé par les tables d'un schéma

~~~~{.lang-sql}
SELECT TABLE_NAME, table_rows, data_length, index_length, round(((data_length + index_length) / 1024 / 1024),2) "Taille en Mo" 
FROM information_schema.TABLES 
WHERE table_schema = "nom du schema";
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Tunnel SSH vers MySQL à l'écoute en local

~~~~{.lang-bash}
ssh -L 3305:localhost:3306 user@remoteserver
~~~~
