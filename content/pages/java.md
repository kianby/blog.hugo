Title: Notes sur Java
Slug: java

[<i class="fa fa-home fa-2x" aria-hidden="true"></i>](notes.html)

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Thread dump

~~~~{.lang-bash}
kill -3 <PID>
jstack -l <PID> >threadump.txt
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>Heap dump

~~~~{.lang-bash}
jmap -dump:format=b,file=jvm.hprof <PID>
~~~~

#### <i class="fa fa-angle-double-right" aria-hidden="true"></i>VisualVM avec JMX

Lancer le process JAVA distant avec les options JMX: 

~~~~{.lang-bash}
-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=2222 
  -Dcom.sun.management.jmxremote.ssl=false  -Dcom.sun.management.jmxremote.authenticate=false
~~~~

S'assurer que l'adresse IP est résolue dans */etc/hosts* et créer une nouvelle connection JMX distante avec VisualVM sur le port 2222
