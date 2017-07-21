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

L'architecture ressemble à cela :

![Architecture Stacosys cache](/images/2017/diag-sanic-cache.png)

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


Voici l'architecture finale :

![Architecture Golang HTTP/Cache](/images/2017/diag-go-cache.png)

Et pour finir un aperçu du code :

{{< highlight go "linenos=inline" >}}
    package main

    import (
      "encoding/json"
      "flag"
      "fmt"
      "github.com/patrickmn/go-cache"
      "io/ioutil"
      "net/http"
      "os"
      "time"
    )

    // ConfigType represents config info
    type ConfigType struct {
      HostPort   string
      Stacosys   string
      CorsOrigin string
    }

    var config ConfigType
    var countCache = cache.New(5*time.Minute, 10*time.Minute)

    func die(format string, v ...interface{}) {
      fmt.Fprintln(os.Stderr, fmt.Sprintf(format, v...))
      os.Exit(1)
    }

    func commentsCount(w http.ResponseWriter, r *http.Request) {

      // only GET method is supported
      if r.Method != "GET" {
        http.NotFound(w, r)
        return
      }

      // set header
      w.Header().Add("Content-Type", "application/json")
      w.Header().Add("Access-Control-Allow-Origin", config.CorsOrigin)

      // get cached value
      cachedBody, found := countCache.Get(r.URL.String())
      if found {
        //fmt.Printf("return cached value")
        w.Write([]byte(cachedBody.(string)))
        return
      }

      // relay request to stacosys
      response, err := http.Get(config.Stacosys + r.URL.String())
      if err != nil {
        http.NotFound(w, r)
        return
      }
      defer response.Body.Close()
      body, err := ioutil.ReadAll(response.Body)
      if err != nil {
        http.NotFound(w, r)
        return
      }

      // cache body and return response
      countCache.Set(r.URL.String(), string(body), cache.DefaultExpiration)
      w.Write(body)
    }

    func main() {
      pathname := flag.String("config", "", "config pathname")
      flag.Parse()
      if *pathname == "" {
        die("%s --config <pathname>", os.Args[0])
      }
      // read config File
      file, e := ioutil.ReadFile(*pathname)
      if e != nil {
        die("File error: %v", e)
      }
      json.Unmarshal(file, &config)
      fmt.Printf("config: %s\n", string(file))

      http.HandleFunc("/comments/count", commentsCount)
      http.ListenAndServe(config.HostPort, nil)
    }
{{< /highlight >}}
