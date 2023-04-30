---
title: "Define Entities"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Entities are custom resources that allow everybody to extend MonkOS with their own data structures and logic.

---

## Define a new Entity

Suppose we want to have a Person type, it will be used to store information about
people.

Declare type:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    name:
      type: string
    role:
      type: string
    age:
      type: integer
    org:
      type: object
      properties:
        organizationName:
          type: string
        organizationUnit:
          type: string
```

Key part is defines: entity which indicates that this is a new Entity type.

Also, we have here the schema property that describes entity structure. Schema format is similar to Swagger or OpenAPI
and follows [JSON Schema specification](https://json-schema.org/learn/).

An entity type can be loaded with `monk load type.yaml`:

Then we can define several resources that use the Person type:

```yaml title="people.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  name: John D
  role: Accounting
  age: 27

lucy:
  defines: guides/person
  name: Lucy L
  role: Management
  org:
    organizationName: C corp
```

Now we can use MonkOS CLI to work with our custom Entity:

    # load template
    monk load people.yaml
    
    # run
    monk run guides/john
    
    # ps to see list of resources
    monk ps
    
    # describe to show a single entity
    monk describe guides/john
    
    # stop
    monk stop guides/john
    
    # edit templates and apply changes
    monk load type.yaml entities.yaml
    monk update guides/john
    
    # remove entity and delete template
    monk delete guides/john
    
    # remove entity type
    monk delete guides/person

This example already extends MonkOS API, but it is not doing much, apart from storing
and retrieving structured data. We have to write Lifecycle scripts to apply custom logic.

## Lifecycle scripts

Scripts are written in JavaScript and can be inlined in Entity type.

Considering our example, let’s add some validation and logging to create lifecycle:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    ...
  lifecycle:
    create: |
      function main(obj) {
        if (obj.age !== undefined && obj.age < 16) {
           throw new Error("minimum age for employment is 16");
        }
        console.log(obj.name, obj.role);
      }
```

:::note

You can use `<<<` to embed content from an external file: `create: <<< foo.json`.

:::

JS script has to contain a _main_ function that receives up to 3 arguments and optionally returns an object as a result.

```javascript
function main(definition, state, context) {
    return {"lastUpdate": Date.now()};
}
```

Arguments are 3 objects:

1. **definition** - entity data, as defined in template.
2. **state** - saved data that was returned in previous executions, could be empty.
3. **context** - additional data with properties:
    1. **action** - current action, e.g. _create_, _start_, _update_, _purge_
    2. **status** - current entity status, e.g. _stopped_, _running_
    3. **path** - full template path for entity.
    4. Context for custom properties also contains additional arguments in **args** property.

Returned object is saved as state and will be passed to the next operations with this Entity.

:::note

You don't have to return new state for every action. If you do — it replaces previously saved data.

:::

You can use **throw** to terminate command execution from JS at any point.

MonkOS JS Runtime supports most of the native JS functions,
but it doesn't have access to browser features or file system.

Here's a list with some JS methods:

* `JSON.parse()`, `JSON.stringify()` - encode/decode JSON strings.
* `btoa()`, `atob()` - encode/decode base64 strings, this method accepts Unicode.
* `console.log()` - print value to monkd logs.
* `Math`, `Date`, `Map`, etc

### Available lifecycle targets

You can define any of them depending on what commands you need:

* **create** - triggered with first `monk run`, which also triggers **start**.
* **start** - triggered with every `monk run` or `monk update`.
* **update** - triggered with `monk update`, which also triggers **start**.
* **stop** - triggered with `monk stop`.
* **purge** - triggered with `monk purge` when resource is being removed.
* **sync** - triggered for any command that has no explicit script.

### Custom lifecycle actions

Besides standard create/update/delete lifecycle you can define any other verb as an action and use it with your own
arguments:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    ...
  lifecycle:
    hello: |
      let cli = require("cli");
      function main(obj) {
        cli.output("hello", obj.name);
      }
```

Use it with do command (you need to run your entity first):

    monk run guides/john
    
    monk do guides/john/hello
    ...
    ✔ Executing entity hello script for templates/local/guides/john DONE
    ✔ Hello John D DONE

You can use single sync lifecycle to process custom actions — do it by assigning empty string for your action name:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    ...
  lifecycle:
    sync: <<< sync.json
    hello: ""
    bye: ""
```

## Readiness & dependency checks

Lefecycle scripts are meant to return fast, but some Entities may take time to become available after `monk run`.
MonkOS comes with readiness checks that can perform tests to check if Entity is up and running.

:::note

See [this guide to learn](readiness-and-dependency-checks.md) how readiness and dependency work in detail.

:::

### Readiness

Readiness check is written in JavaScript. To fail check, you need to throw error at any point.

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  checks:
    readiness:
      code: |
        function main(def, state, ctx) {
          throw "not ready";
        }
      initialDelay: 5   
```

Check can return state to be saved like any other lifecycle action.

```yaml title="type.yaml" linenums="1"
checks:
  readiness:
    code: |
      function main(def, state, ctx) {
        state.ready = true;
        return state;
      }
```

If code is empty and Entity has `sync` method defined, then `sync` is going to be called instead.
Context action will be **check-readiness**.

Example:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  checks:
    readiness:
      initialDelay: 15
      period: 10
      attempts: 12
  lifecycle:
    sync: |
      function main(def, state, ctx) {
         switch (ctx.action) {
            case "create":
              // create logic
              break;
            case "purge":
              // purge logic
              break;
            case "check-readiness":
              // readiness check logic
              break;
            default:
              // no action
              return;
         }
      }
```

### Dependency

Entities can depend on each other being available, they can also depend on Runnable, or vice versa.

```yaml title="people.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  name: John D
  depends:
    wait-for:
      runnables:
        - guides/lucy
      timeout: 120

john-runnable:
  defines: runnable
  depends:
    wait-for:
      runnables:
        - guides/john
      timeout: 60
  containers:
    operator:
      image: your-image/test:webhook
```

## Require modules

MonkOS has a number of modules. You can use them by requiring modules in _requires_ property:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  requires:
    - cloud/aws
    - http
  lifecycle:
    create: |
      function main() {
        res = http.get("https://api.ipify.org");
        if (res.error) {
          throw res.error;
        }
        return {"ip": res.body};
      }
```

Or require module directly from JS script:

```javascript
let http = require("http");

function main(definition, state, context) {
    let res = http.get("https://api.ipify.org");
    if (res.error) {
        throw res.error;
    }
    return {"ip": res.body};
}
```

Available modules:

:::note

Require works only with modules that are implemented in Monk, see full list below.  
But you can use native JS functions like JSON, Math, etc.

:::

* cli
* secret
* fs
* parser
* http
* cloud/digitalocean
* cloud/aws
* cloud/gcp
* cloud/azure

### Module CLI

The module implements methods to work with MonkOS CLI.

Currently, it has only 1 method `output` that prints passed parameters to console.

Usage:

```javascript
let cli = require("cli");

cli.output("Test", "one");
```

The console will show it as:

      ✔ Test one DONE

### Module Secret

The module implements methods to work with MonkOS Secrets.

It has the following methods:

* `get` - get Secret value by name.
* `set` - set Secret value.
* `remove` - delete Secret.
* `randString` - generate random string.

Usage:

```javascript
let secret = require("secret");

// get Secret value
let password = secret.get("mypassword");

// update Secret value
secret.set("mypassword", secret.randString(12))

// delete Secret
secret.remove("mypassword")
```

Secrets have scope of the Entity where they are used.

To use Secrets with global scope, define them in **permitted-secrets** property:

```yaml title="john.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  ...
  permitted-secrets:
    my-global-secret-name: true
```

### Module FS

The module implements methods to work with embedded files. It uses virtual filesystem with readonly access.

Module has the following methods:

* `ls` - returns array of filenames in the given path, dirs names end with "/".
* `readFile` - returns file content.
* `zip` - archive as zip.
* `tar` - package as tar.

Files can be added in **files** property.

:::note

You can use `<<<` macro [to paste contents from a local file](monkscript/yaml/index.md#file-embeds).

:::

Example:

```yaml title="john.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  ...
  files:
    interests:
      path: interests.txt
      contents: "Animal lover, Astrology"
    bio:
      path: biography.txt
      contents: <<< bio.txt
```

Usage:

```javascript
let fs = require("fs");

// list files from root dir
let res = fs.ls();

// read file and return content
let data = fs.readFile("biography.txt");

// zip all files
let zipdata = fs.zip(".");

// zip files with given path
let zipdata = fs.zip("biography.txt", "interests.txt");

// tar all files
let tardata = fs.tar(".");
```

### Module Parser

The module implements methods to parse value from text documents.

Module has the following methods:

* `xmlquery` - parse XML documents.
* `jsonquery` - parse JSON documents.
* `htmlquery` - parse HTML documents.

Methods accept 2 strings: document and query with XPath expression.

Returned value is a list for most of the queries,
with the exceptions that return scalar values: XML methods like `count`, `concat`, `sum`.

Usage:

```javascript
const parser = require("parser");

// get values by selector
let title = parser.xmlquery(def.data, "//channel/title")[0];
let titles = itemTitles = parser.xmlquery(def.data, "//item/title");

// get attirubute value of a second item
let itemId = parser.xmlquery(def.data, "//item[2]/@id")[0];

// get number of all items
let count = parser.xmlquery(def.data, "count(//item)");

// JSON - get all prices that are greater than value
let prices = parser.jsonquery(def.data, "//price[.>21]");

// HTML - parse header h1 and all h2 text values
let h1 = parser.htmlquery(def.data, "//header/h1")[0];
let h2List = parser.htmlquery(def.data, "//h2");

// HTML - parse all link href values
let hrefs = parser.htmlquery(def.data, "//a/@href");
```

### Module HTTP

The module implements an HTTP REST client with methods `get`, `put`, `post`, `delete`, `do`.

All methods require passing **url** as the first argument and accept optional parameters: **headers**, **object**, *
*body** string, **timeout** in seconds.

The result is an object with properties:

* **status** - full response status e.g. "200 OK"
* **statusCode** - integer code
* **headers** - response headers object
* **body** - response body string
* **error** - contains error string if the request failed.

Usage:

```javascript
// simple get
res = http.get("https://api.ipify.org");

// put with headers, body, timeout
res = http.put(url, {
    "headers": {"authorization": "bearer xyz"},
    "body": `{"test": "val"}`, "timeout": 10
});

// do request with the provided method in parameters
res = http.do(url, {"method": "PATCH"});

// handle response error
if (res.error) {
    throw res.error;
}

// parse response body as json
parsed = JSON.parse(res.body);

// log result object to monkd.log as an encoded string
console.log(JSON.stringify(res));
```

### Module DigitalOcean

This module implements an HTTP client for DigitalOcean API.

:::note

Using digitalocean module requires you to have [DO provider credentials](cloud-provider.md) in your cluster.

:::

Methods and usage are the same as http module: `get`, `put`, `post`, `delete`, `do`. Authorization token will be
added to all requests that are made with this module.

Usage:

```javascript
let digitalocean = require("cloud/digitalocean");

function main(definition, state, context) {
    let res = digitalocean.get("https://api.digitalocean.com/v2/account");
    if (res.error) {
        throw res.error;
    }
    return {"body": res.body};
}
```

### Module GCP

This module implements an HTTP client for Google Cloud Platform API. All requests are authorized
with `https://www.googleapis.com/auth/cloud-platform` scope if provider credentials allow it.

:::note

Using gcp module requires you to have [GCP provider credentials](cloud-provider.md) in your cluster.

:::

Methods are the same as http module: `get`, `put`, `post`, `delete`, `do`.
There is also `getProject` method that returns project name from provider credentials.

Usage:

```javascript
let gcp = require("cloud/gcp");

function main(definition, state, context) {
    let url = "https://compute.googleapis.com/compute/v1/projects/" + gcp.getProject();
    let res = gcp.get(url);
    if (res.error) {
        throw res.error;
    }

    return {"body": res.body};
}
```

### Module AWS

Thies module implements an HTTP client for AWS API.

:::note

Using aws module requires you to have [AWS provider credentials](cloud-provider.md) in your cluster.

:::

Methods are the same as http module: `get`, `put`, `post`, `delete`, `do`, but each method additionally requires
**service** and **region** properties.

There is also a `presign` method that returns signed URL and headers for a given request and expiration time.

Usage:

```javascript
let aws = require("cloud/aws");

createBucket = function (name, region) {
    return aws.put("https://" + name + ".s3.amazonaws.com", {
        "service": "s3",
        "region": region,
        "headers": {"x-amz-acl": "public-read"}
    });
}

function main(definition) {
    let res = createBucket(definition.name, definition.region);
    if (res.error) {
        throw new Error(res.error);
    }
}
```

### Module Azure

This module implements an HTTP client for Microsoft Azure API.

:::note

Using azure module requires you to have [Azure provider credentials](cloud-provider.md) in your cluster.

:::

Methods are the same as http module: `get`, `put`, `post`, `delete`, `do`.
There are also `getTenant()`, `getSubscription()`, `getResourceGroup()` methods
that return info from provider credentials.

Usage:

```javascript
let azure = require("cloud/azure");

function main(definition, state, context) {
    let url = "https://mytestaccount.blob.core.windows.net/?comp=list";
    // storage has to use at least 2017-11-09 version to work with OAuth token
    let res = azure.get(url, {headers: {"x-ms-version": "2017-11-09"}});
    if (res.error) {
        throw res.error + ", body: " + res.body;
    }
    // print result to monkd logs
    console.log(res.body);
}
```

## Webhook lifecycle

If your logic needs a lot of dependencies, or you don't want to write JavaScript code, you can register webhook url of
your own service. In this case, MonkOS will send request for each lifecycle event and will expect a response with updated
Entity state.

     lifecycle:
       sync:
         url: "https://your-webhook-address.com/path-to-url"

Request is JSON with **definition**, **state**, **context**, the same properties as _main_ function in JS code. Response
can contain **state** object and **output** (list of strings) that will be printed to console.

Example of Entity type and webhook server runnable:

```yaml title="webhook.yaml" linenums="1"
namespace: guides

foo:
  defines: entity
  depends:
    wait-for:
      runnables:
        - guides/foo-operator
      timeout: 60
  schema:
    first-url:
      type: string
    second-url:
      type: string
  lifecycle:
    sync:
      url: <- "http://" peer-ip-address("guides/foo-operator") ":8090/" concat-all

foo-operator:
  defines: runnable
  containers:
    operator:
      image: your-image/test:webhook
      ports:
        - 8090:8090
```

Then, load and run an Entity like the one below to trigger webhook requst:

```yaml title="beep.yaml" linenums="1"
beep:
  defines: guides/foo
  first-url: https://wikipedia.com
  second-url: https://example.com
```

Webhooks don't stop you from using inlined JavaScript: an Entity can define JS script for some action,
and for that lifecycle it will be called instead of webhook url.

```yaml
  lifecycle:
    create: |
      function main() {
        let res = http.get("https://api.ipify.org");
        if (res.error) {
          throw res.error;
        }
        return {"ip": res.body};
      }
    sync:
      url: "https://your-webhook-address.com/path-to-url"
```

If you want to define custom action for the Entity with webhook logic,
you can do it by assigning empty string to your action name:

     lifecycle:
       do-something: ""
       sync:
         url: "https://your-webhook-address.com/path-to-url"

Call it like this to send a request to webhook server with custom arguments:

      monk do guides/beep/do-something your-arg=value

Webhook server example written in Go:

```go
package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type webhookContext struct {
	Status string            `json:"status"`
	Action string            `json:"action"`
	Path   string            `json:"path"`
	Args   map[string]string `json:"args"`
}

type webhookRequest struct {
	Definition map[string]interface{} `json:"definition"`
	State      map[string]interface{} `json:"state"`
	Context    webhookContext         `json:"context"`
}

type webhookResponse struct {
	Output []string               `json:"output,omitempty"`
	State  map[string]interface{} `json:"state,omitempty"`
}

func webhook(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var req webhookRequest
	err := decoder.Decode(&req)
	if err != nil {
		panic(err)
	}

	state, err := json.Marshal(req.State)
	if err != nil {
		panic(err)
	}

	resp := new(webhookResponse)
	resp.Output = []string{"ACTION " + req.Context.Action, "PREV STATE " + string(state)}
	resp.State = map[string]interface{}{
		"lastTime": time.Now().String(),
	}

	data, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}

	_, err = w.Write(data)
	if err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/", webhook)
	err := http.ListenAndServe(":8090", nil)
	if err != nil {
		panic(err)
	}
}
```

## Examples: AWS S3 Bucket Entity

Let's implement a new Entity to manage AWS S3 bucket.
It will allow us to create new Buckets and upload files using Monk.

First, we have to declare the Bucket type with create/delete lifecycle and additional **presign** method:

```yaml title="objectstorage.yaml" linenums="1"
namespace: guides

aws-bucket:
  defines: entity
  schema:
    required: [ "name", "region" ]
    name:
      type: string
    region:
      type: string
  requires:
    - cloud/aws
  lifecycle:
    create: |
      let createBucket = function(name, region) {
        return aws.put("https://"+name+".s3.amazonaws.com", {"service": "s3", "region": region, "headers": {"x-amz-acl": "public-read"}});
      }

      function main(definition) {
        let res = createBucket(definition.name, definition.region);
        if (res.error) {
          throw new Error(res.error);
        }
      }
    purge: |
      deleteBucket = function(name, region) {
        return aws.delete("https://"+name+".s3.amazonaws.com", {"service": "s3", "region": region});
      }

      function main(definition) {
        let res = deleteBucket(definition.name, definition.region);
        if (res.error) {
          throw new Error(res.error);
        }
      }
    presign: |
      var cli = require("cli");

      presignUpload = function(name, region, path) {
        return aws.presign("https://"+name+".s3.amazonaws.com" + path,
           {"method": "PUT", "expire": "5m", "service": "s3", "region": region,
            "headers": {"x-amz-acl": "public-read"}});
      }

      function main(definition, state, context) {
        let {url, headers} = presignUpload(definition.name, definition.region, context.args.path);
        cli.output("Pre-signed URL:", decodeURI(url))
        if (headers) {
          cli.output("Pre-signed headers", JSON.stringify(headers));
        }
      }
```

We declared guides/aws-bucket type with 2 properties in schema: **name** and **region**.

Lifecycle has only 2 events: create a bucket using AWS API on Entity create, remove it on delete.

Custom action **presing** returns upload url with authorization to upload to our Bucket.

Now, let's add Entity definition for an actual bucket,
keep in mind that AWS requires it to have a globally unique name:

```yaml title="mybucket.yaml" linenums="1"
mybucket:
  defines: guides/aws-bucket
  name: my-bucket-with-unique-name
  region: us-east-1
```

Then, we use MonkOS CLI to load and run templates:

      # load templates
      monk load objectstorage.yaml mybucket.yaml
      
      # run to trigger a "create" event
      monk run guides/mybucket

An empty bucket with public read access should be created in AWS,
available at:  
https://my-bucket-with-unique-name.s3.amazonaws.com/

Now we can use presign an url to upload some file to Bucket to desired location path.

      monk do guides/mybucket/presign path=/image.png

This commands prints to console signed url and headers:

      ...
      ✔ Pre-signed URL: https://my-bucket-with-unique-name.s3.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUACQQXWL7VRHQCYH%2F20221222%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221222T213534Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host%3Bx-amz-acl&X-Amz-Signature=7a8dd9acf0752f6a3223d7d335b5daf9a3503b2bdf5447bdeb5bd46ab725b403 DONE
      ✔ Pre-signed headers {"x-amz-acl":["public-read"]} DONE

We can upload the actual file using _curl_ tool with parameters from a response to the previous command:

      curl -X PUT -T /path-to-file/image.png -H "x-amz-acl: public-read" "https://my-bucket-with-unique-name.s3.amazonaws.com.s3.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUACQQXWL7VRHQCYH/20221222/us-east-1/s3/aws4_request&X-Amz-Date=20221222T194021Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=f215ef40722f2d967fd35453ed94cbf12508a929ed6b57fc7e13ccd08dc5f2de"

Now you should see uploaded image at your location:  
https://my-bucket-with-unique-name.s3.amazonaws.com/image.png.

We can upload many more files, but when we don't need this Bucket anymore,
we can delete it with `monk delete`:

      monk delete guides/mybucket

This should remove Entity from MonkOS and the Bucket resource from AWS.

## Examples: Cloud SQL Entity

In this example let's implement a new Entity to deploy Cloud SQL Database instances on Google Cloud Platform.

First, we'll define an Entity for the Cloud SQL Instance server.

```yaml title="cloud-sql-instance.yaml" linenums="1"
namespace: guides

# BEFORE RUNNING:
#  If not already done, enable the Cloud SQL Administration API
#  and check the quota for your project at
#  https://console.developers.google.com/apis/api/sqladmin
cloud-sql-instance:
  defines: entity
  schema:
    required: [ "name" ]
    name:
      type: string
    database-version:
      type: string
      default: "POSTGRES_14"
    tier:
      type: string
      default: "db-f1-micro"
    region:
      type: string
      default: "us-central1"
    allow-all:
      type: bool
  requires:
    - cloud/gcp
  lifecycle:
    create: |
      var createInstance = function(project, def) {
        let body = {
          name: def.name,
          databaseVersion: "POSTGRES_14",
          region: "us-central1",
          settings: {
            tier: "db-f1-micro",
          }
        };

        if (def.tier) {
           body.settings.tier = def.tier;
        }

        if (def["allow-all"]) {
           body.settings.ipConfiguration = {
             authorizedNetworks: [{name: "unsafe-allow-all", value: "0.0.0.0/0"}]
           }
        }

        if (def.region) {
           body.region = def.region;
        }

        if (def["database-version"]) {
           body.databaseVersion = def["database-version"];
        }

        return gcp.post("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances", {"body": JSON.stringify(body)});
      }

      function main(def, state, ctx) {
        let res = createInstance(gcp.getProject(), def);
        console.log(JSON.stringify(res));
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        return {"statusCode": res.statusCode};
      }
    purge: |
      var deleteInstance = function(project, name) {
        return gcp.delete("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+project+
          "/instances/"+name);
      }

      function main(def, state, context) {
        let res = deleteInstance(gcp.getProject(), def.name);
        console.log(JSON.stringify(res));
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
      }
```

One instance can have many databases, so next we will define
an Entity to initialize new Databases.

```yaml title="cloud-sql-database.yaml" linenums="1"
namespace: guides

cloud-sql-database:
  defines: entity
  schema:
    required: [ "instance", "name" ]
    instance:
      type: string
    name:
      type: string
  requires:
    - cloud/gcp
  lifecycle:
    create: |
      var createDatabase = function(project, instance, name) {
        let body = {
          name: name
        };

        return gcp.post("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+instance+"/databases",
          {"body": JSON.stringify(body)});
      }

      var getAddress = function(project, def) {
        let res = gcp.get("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          gcp.getProject();+"/instances/"+def.instance);
        if (res.error) {
          throw new Error(res.error);
        }
        let instance = JSON.parse(res.body);
        if (!instance.ipAddresses) {
          throw new Error("instance has no address yet");
        }
        let address = "";
        for (let i = 0; i < instance.ipAddresses.length; i++) {
          if (instance.ipAddresses[i].type === "PRIMARY") {
             address = instance.ipAddresses[i].ipAddress;
             break;
          }
        }
        return address;
      }

      function main(def, state, ctx) {
        // get instance address
        let address = getAddress(gcp.getProject(), def);
        if (!address) {
          throw new Error("instance address is empty");
        }

        let res = createDatabase(gcp.getProject(), def.instance, def.name);
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        return {"name": def.name, "address": address};
      }
    purge: |
      var deleteDatabase = function(project, instance, name) {
        return gcp.delete("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+instance+"/databases/"+name);
      }

      function main(def, state, context) {
        let res = deleteDatabase(gcp.getProject(), def.instance, def.name);
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
      }
```

Next is Cloud SQL User.

User needs password, our Entity will expect password to be passed as Secret.     
Or, if none are provided, it will generate random Secret with given name.

```yaml title="cloud-sql-user.yaml" linenums="1"
namespace: guides

cloud-sql-user:
  defines: entity
  schema:
    required: [ "instance", "name", "password-secret" ]
    instance:
      type: string
    name:
      type: string
    password-secret:
      type: string
  requires:
    - cloud/gcp
    - secret
  lifecycle:
    create: |
      var createUser = function(project, def) {
        let body = {
          name: def.name
        };

        try {
          body.password = secret.get(def["password-secret"]);
        } catch (error) {
          // generate password and save to secret if it doesn't exist
          body.password = secret.randString(16));
          secret.set(def["password-secret"], body.password);
        }

        return gcp.post("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+def.instance+"/users",
          {"body": JSON.stringify(body)});
      }

      function main(def, state, ctx) {      
        let res = createUser(gcp.getProject(), def);
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        return {}
      }
    purge: |
      var deleteUser = function(project, instance, name) {
        return gcp.delete("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+instance+"/users?name="+name);
      }

      function main(def, state, context) {
        let res = deleteUser(gcp.getProject(), def.instance, def.name)
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        try {
          secret.remove(def["password-secret"]);
        } catch (error) {}
      }
```

When we're done with Entities types, we can actually use them to define our specific Instance, Database and User.

Resources can use `entity` and `entity-state` ArrowScript operators to reference other Entity properties.

```yaml title="my-cloud-sql.yaml" linenums="1"
namespace: guides

myinstance:
  defines: guides/cloud-sql-instance
  name: testmyinstance1
  database-version: MYSQL_8_0
  tier: "db-g1-small"
  allow-all: true

mydb:
  defines: guides/cloud-sql-database
  name: mydb1
  instance: <- entity("guides/myinstance") get-member("name")

myuser:
  defines: guides/cloud-sql-user
  name: myuser1
  instance: <- entity("guides/myinstance") get-member("name")
  password-secret: myuser-password
  permitted-secrets:
    myuser-password: true
```

We'll use MonkOS CLI to load and run everything:

      # load Entity types
      monk load cloud-sql-instance.yaml cloud-sql-database.yaml cloud-sql-user.yaml

      # load the definitions
      monk load my-cloud-sql.yaml

      # run db Instance, it takes some time for GCP to provision the instance until we can use it
      monk run guides/myinstance

      # when Instance is ready, we can create Database and User
      monk run guides/mydb guides/myuser      

Finally, let's use these Entities for something practical:  
we are going to deploy WordPress Runnable that stores data in Cloud SQL Database
with User credentials from MonkOS Secret.

We are using `entity` and `entity-state` ArrowScript operators to reference Entity properties in Runnable resource.

```yaml title="wordpress.yaml" linenums="1"
namespace: guides

wordpress:
  defines: runnable
  permitted-secrets:
    myuser-password: true
  variables:
    wordpress_db_host:
      value: <- entity-state("guides/mydb") get-member("address")
      type: string
    wordpress_db_name:
      value: <- entity("guides/mydb") get-member("name")
      type: string
    wordpress_db_secret:
      value: <- entity("guides/myuser") get-member("password-secret")
      type: string
    wordpress_db_password:
      value: <- secret($wordpress_db_secret)
      type: string
    wordpress_db_user:
      value: <- entity("guides/myuser") get-member("name")
      type: string
    wordpress_db_addr:
      value: <- $wordpress_db_host ":3306" concat-all
      type: string
    wordpress_table_prefix:
      type: string
      value: wp_
    image-tag:
      value: latest
      type: string
  containers:
    wordpress:
      environment:
        - <- `WORDPRESS_DB_NAME=${wordpress_db_name}`
        - <- `WORDPRESS_DB_HOST=${wordpress_db_addr}`
        - <- `WORDPRESS_TABLE_PREFIX=${wordpress_table_prefix}`
        - <- `WORDPRESS_DB_PASSWORD=${wordpress_db_password}`
        - <- `WORDPRESS_DB_USER=${wordpress_db_user}`
      ports:
        - 8080:80
      image-tag: <- `${image-tag}`
      image: wordpress
```

Load and run WordPress, it should be able to run using Cloud SQL Database:

      monk load wordpress.yaml
      monk run guides/wordpress
