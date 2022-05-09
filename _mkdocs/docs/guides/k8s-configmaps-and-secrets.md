This small guide will show how to migrate Kubernetes configmaps or secrets to Monk.

Kubernetes can store normal key/value pairs in its configmaps and secrets, but in some cases depending on Kubernetes deployment configuration some of them might be mounted as files. We will consider both of the cases to make migration a bit easier for end user.  

## Configmaps

### Example configmap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
data:
  game.properties: |
    enemies=aliens
    secret.code.lives=30    
  ui.properties: |
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

Judging by the key names and that the values are multiple lines we can assume that those two will be files.  
In Monk there's a distinguishment for the file and variables so we need to define them in appropriate space.  

Lets consider this Monk Kit our 'base' Kit:

```yaml
namespace: /nginx

server:
  defines: runnable
  containers:
    defines: containers
    nginx:
      image-tag: latest
      image: nginx
      ports:
          - 80:80
```

No we would like those two files be exposed by our webserver. We can achieve that by adding [files section](/monkscript/yaml/runnables/#files) to above Kit, which would resolve in following Kit:

```yaml
namespace: /nginx

server:
  defines: runnable
  containers:
    defines: containers
    nginx:
      image-tag: latest
      image: nginx
      ports:
          - 80:80

  files:
    defines: files
    gameprop:
      container: nginx
      path: /usr/share/nginx/html/game.properties
      mode: 644
      contents: |
        enemies=aliens
        secret.code.lives=30
    uiprop:
      container: nginx
      path: /usr/share/nginx/html/ui.properties
      mode: 644
      contents: |
        allow.textmode=true
        how.nice.to.look=fairlyNice
```

With that definition we will create two files in Nginx document root directory with 644 permissions.  

Now lets see how we can add normal key/value pairs that will be treated as environment variables:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
data:
  runningPort: 10000
  username: anonymous
```

In this case we will use Monks [variables](/monkscript/yaml/groups/#variables) section.

```yaml
namespace: /nginx

server:
  defines: runnable
  containers:
    defines: containers
    nginx:
      image-tag: latest
      image: nginx
      ports:
          - 80:80
      environment:
        - <- `USER=${username}`
        - <- `PORT=${runningPort}`

  files:
    defines: files
    gameprop:
      container: nginx
      path: /usr/share/nginx/html/game.properties
      mode: 644
      contents: |
        enemies=aliens
        secret.code.lives=30
    uiprop:
      container: nginx
      path: /usr/share/nginx/html/ui.properties
      mode: 644
      contents: |
        allow.textmode=true
        how.nice.to.look=fairlyNice

  variables:
    defines: variables
    username:
      type: string
      value: anonymous
    runningPort:
      type: int
      value: 10000
```

By doing that we have exposed our two vars as environment variables `USER` and `PORT`.

## Secrets

Secrets are pretty much the same as configmaps, with one small difference - we need to base64 decode them before we will re-apply them in Monk and then encrypt them.  

Consider this one small Kubernetes secretmap:

### Example secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: superSecret
type: Opaque
data:
  password: YmFyCg==
```

We can see that password is encoded, to decode it we can simply use base64 program:  

```bash
$ echo YmFyCg== | base64 -d
bar
```

Now, we will add it to our main Kit:  
```yaml
namespace: /nginx

server:
  defines: runnable
  containers:
    defines: containers
    nginx:
      image-tag: latest
      image: nginx
      ports:
          - 80:80
      environment:
        - <- `USER=${username}`
        - <- `PORT=${runningPort}`
        - <- `PASSWORD=${password}`

  files:
    defines: files
    gameprop:
      container: nginx
      path: /usr/share/nginx/html/game.properties
      mode: 644
      contents: |
        enemies=aliens
        secret.code.lives=30
    uiprop:
      container: nginx
      path: /usr/share/nginx/html/ui.properties
      mode: 644
      contents: |
        allow.textmode=true
        how.nice.to.look=fairlyNice

  variables:
    defines: variables
    username:
      type: string
      value: anonymous
    runningPort:
      type: int
      value: 10000
    password:
      type: string
      value: bar
```

And in the end we will encrypt it with [SOPS](/guides/passing-secrets/):

```bash
$ sops --encrypt --pgp <your pgp key fingerprint > mystuff.yaml > mystuff-secure.yaml

[PGP]    WARN[0000] Deprecation Warning: GPG key fetching from a keyserver within sops will be removed in a future version of sops. See https://github.com/mozilla/sops/issues/727 for more information.
```

If we will display our file, we will be able to see that it's encrypted and our secrets are not visible:

```
$ cat mystuff-secure.yaml
namespace: ENC[AES256_GCM,data:ZEaPMqEr,iv:I8JUh+W4Hbgu7RM7ERdsinhk2JvldulYpJWe9mAyFic=,tag:1qLvHCVdT4vaTr/Yze/U8A==,type:str]
server:
(...)
    variables:
        defines: ENC[AES256_GCM,data:Rbi4TxPOdBS4,iv:YDGeIxerOlL1CBy8RdZSfIrISvYG1qqHJlwouxccF+M=,tag:uWzf4NoJtzHOIB+SSRNUgA==,type:str]
        username:
            type: ENC[AES256_GCM,data:BFzy5eA2,iv:353x3zkXfrZBV/JJPoA3VD2BVgQyJbR0V6KsoVjQsHY=,tag:3JJMYtNhGF7nVFGgVROA/Q==,type:str]
            value: ENC[AES256_GCM,data:2YoIhlWG/dJh,iv:LBqCl2+hIjL/VBg8DygXnmXumH5Gip2ssD0H7W3mXtg=,tag:KKMoTlPMwn1pY07GfFUSzQ==,type:str]
        runningPort:
            type: ENC[AES256_GCM,data:q/WH,iv:BEIYtoUPAgNVPGTqjBoUw5jdJqkL6V9E+mP0g6EDmRk=,tag:3knwbKF1fUsNRYuPVFz0vw==,type:str]
            value: ENC[AES256_GCM,data:OrG3H9M=,iv:hMRm2r3pyz/8MEieBYj7FFzO/1ciaz5E59i62VX5Dv4=,tag:DHSWQtglPAFSG633sVrsBQ==,type:int]
        password:
            type: ENC[AES256_GCM,data:G2Mwc8hQ,iv:4vmiSjyBvyInG7hu6yMJX3HyjkocoHLx79OOxQxZGoE=,tag:yl8IeNUrr4RzauITQ92aLQ==,type:str]
            value: ENC[AES256_GCM,data:WUXN,iv:oPCjXY2T+yB1alQMZUUv57SrDbTn28LLfx0eRJrZX18=,tag:AGEQ1oK4rv8pO3X75oDtYg==,type:str]
sops:
(...)
    version: 3.7.1
```

