Some information passed in the templates should be hidden from prying eyes. Fortunately, your database passwords, keys, secret tokens, and other sensitive information can be stored safely in encrypted form before being passed to Monk.

This tutorial also has a short video! Stream away:

<iframe width="500" height="315"
  src="https://www.youtube.com/embed/wNJhShmu2R4">
</iframe>

---

## SOPS

Mozilla Secrets OPerationS (SOPS) is a popular editor for encrypted files, supporting many popular formats including JSON and YAML. See: [https://github.com/mozilla/sops](https://github.com/mozilla/sops).

You can encrypt your templates with SOPS for storage or for putting them under version control. Monk is able to `load` SOPS encrypted YAML files in a transparent manner as long as it has access to the key store that was used to encrypt them.

This feature works transparently - if you have an encrypted template, just use:

    monk load myencrypted.yaml

Monk will decrypt the values passed in that YAML file and then re-encrypt it in its internal database so that your data stays secure at rest.

## Prerequisites

In order to to run SOPS you need to generate your GPG key. You can do it by creating example GPG definition file that might look like this:

```text
%no-protection
Key-Type: default
Subkey-Type: default
Name-Real: MyApp1
Name-Email: myapp1@mydomain.local
Expire-Date: 0
```

And then issue following command:

```bash
$ gpg --batch --generate-key < myApp1_key_definition
```

You can then get your key ID that will be used by SOPS via this command:
```
$ gpg --list-keys "myapp1@mydomain.local" | grep pub -A1 | tail -n1
```

## Tutorial

Let's suppose we have the following template:

=== "mystuff.yaml"

    ```yaml linenums="1"
    namespace: mystuff

    my-service:
        defines: runnable
        containers:
            defines: containers
            foo:
                image: foo:latest
                environment:
                    - SECRET_KEY=1234-VERY-SECRET-KEY-ABC
    ```

This file contains `1234-VERY-SECRET-KEY-ABC`, a value that we wouldn't like anyone to intercept.
Encryption

Assuming you have SOPS set up on your machine, you should be able to encrypt that file by using the following command:

    sops --encrypt --pgp <your pgp key fingerprint> mystuff.yaml > mystuff-secure.yaml

!!! note

    SOPS provides many options for key storage. We have shown the `-p` option above. This will use your local PGP for encryption and decryption. Also, you have to be sure that you have PGP key installed locally before use it with monkd

The `mystuff-secure.yaml` should look similar to this:

=== "mystuff-secure.yaml"

    ```yaml linenums="1"
    namespace: ENC[AES256_GCM,data:8eSMrKDiqA==,iv:HHXy2xuo6oHGH3y9cgWUWZJwH9Mg8oUqdXKkwpgY9TY=,tag:d+OUbZPyA7pYAQN7vJKL3g==,type:str]
    my-service:
        defines: ENC[AES256_GCM,data:BQJVtK8Ju1Q=,iv:2JKnD0ZoLUmacJ+zROhyuLv3xybiDpAFR/iGt8Jz18w=,tag:g3gRuIOZ6/GHCi0fU3d3Og==,type:str]
        containers:
            defines: ENC[AES256_GCM,data:w9Wm0ugLGh6Ihw==,iv:qI06rxEvRdZjBlCwpyEEuq7B+r3itRLyXoIC9gav7RM=,tag:snwjY8kRzXsSHh98eymqaA==,type:str]
            foo:
                image: ENC[AES256_GCM,data:P7KUkeLmly+QmA==,iv:GjMCqg8B4Eax3VGx+Cdem/XmX6vL4Q2+h4tJwaHrzvc=,tag:QZbhlaOrj+80lQksUAHrXg==,type:str]
                environment:
                - ENC[AES256_GCM,data:bQrtjuI0kH3SqlzDIAsQOdPeOmMNAfYjYlBx/phyj4mz7MQ=,iv:lcEqMQK5tZUMi0gE/BIgGP1FwabqFkIDoTRvLX5Il6o=,tag:z7mTd+sA8wcroJAZPY1qow==,type:str]
    sops:
        kms: []
        gcp_kms: []
        azure_kv: []
        hc_vault: []
        lastmodified: '2020-10-04T19:43:17Z'
        mac: ENC[AES256_GCM,data:rkt22zDJ2i55cfJegxQ3KlSdlbBOC6aLqgu5zg6ggmte2wCmF9aJ7tkVdJ6tHfcCTB9RHsyb8VZ8FkgY51vNVMJUBhoK1oeI4DDf5P/LtumwWxOmVSeIi46byuHrmM0SHNwH/j5O2W1QGzeoYUPboTaa0v9ond9ECzzUIV0gfc8=,iv:ZipozZKS6qkMwdBK+EPwuQzawHoAEbqsLt+5jUVgAxM=,tag:t76XeNztb5MKeUSBxaGkvQ==,type:str]
        pgp:
        -   created_at: '2020-10-04T19:43:16Z'
            enc: |
                -----BEGIN PGP MESSAGE-----

                hQIMA1+L4XrjeoONAQ//TbzXJ+tY41NlUn8h8rn2pgXasLZLVw1tt6sMjUnPxnQ0
                5F2S2Z/wx5Pkd4Xf6t8ZCsaguD5SuT96DBH4OUYSZuRNu2ez4dUKNtvEJnf1UVxj
                A76QWzldderq/RwDtPAElDBLBae9xYU6z76RXoOO2sQM0sFnIohjC6dvagQR8Xu9
                2A+mJ+T3fVgpDgI/nHeF+YUHEOpNL6UbRpEZpH7gyrigiH7vE94P/m5xReDsHQLF
                JQmLFDiCneY9tV+7KVlfcjVjpLZy93WJnv/SpigsGGuJoxl/bjb9utDsbHFC4dCu
                /DmsgqW+i9M267tzN/eM8/wy0Y38IECtO7pjNZKEPUvr6hxp8VxlcN3V/xmmoOWo
                qvHpHQUQhUxjaWq8A8Z/rrhZvMcnS1+domPiCe3xNgluF2Hpnn6iqofrtjN3XflD
                kCV++MpuNOgZCboxNWi3651lUHyR0JBlopqvDtiTJF/3Zemx+f2WhaanhnnX7PZW
                yUcFL+HKGy74FvT5ivGMA38tpF7kPQHSSQg6ooDAqO8C8mErxm2g0kfuycvYfDTy
                Z/fQZBHn9+Gz6vJr0aq6BJPJuOyZ5twUZXrIktCeshIKfTNkZl39NfTPyu0Wqsj6
                VnVgHiggsWl9b6BvSYKr4fJteUhQE0Je5NSmgaG3LnwY7YjS+YyqaE4sT16EW2PS
                XgGiQV7kDYyb9UMtCGjtv/9lca89n9NJBk/1yYGzt7c4HBmAvhIYtCzgfEDLKdEi
                ayfYeAW8mXW4PNnyUYAuwpup+2mVvleeEyK2noQJa9DT+yFwNx5sf98U14Ijheo=
                =iMK9
                -----END PGP MESSAGE-----
            fp: 888E5DA29455B60CADAF9E94201C5767513753F8
        unencrypted_suffix: _unencrypted
        version: 3.6.0
    ```

As you can see, `1234-VERY-SECRET-KEY-ABC `is nowhere to be found. In fact, SOPS encrypted all the values so the purpose of this template is now impossible to decipher without decrypting the file.

## Loading

To `load` such template file:

    monk load mystuff-secure.yaml

And that's it! Monk will load this file like any other cleartext template.

## Further edits to the template

This template can now be edited by using:

    sops mystuff-secure.yaml

Refer to [SOPS documentation](https://github.com/mozilla/sops) for further help on this topic.
