-   Mention you can create templates either from a file or by using wizard in monkhub or GUI - Pointer to wizard creation guide

    -   Monkhub wizard:
          <figure>
              <img src="/assets/monkhub-wizard.png" />
          <figcaption>Monk hub wizard</figcaption>
          </figure>

          <figure>
              <img src="/assets/monkhub-wizard-expanded.png" />
          <figcaption>Monk hub wizard with variables expanded</figcaption>
          </figure>

    -   Using locally running Monk GUI wizard
          <figure>
              <img src="/assets/monkgui-wizard.png" />
          <figcaption>Monk GUI wizard</figcaption>
          </figure>

          <figure>
              <img src="/assets/monkgui-wizard-expanded.png" />
          <figcaption>Monk GUI wizard with variables expanded</figcaption>
          </figure>

-   refer to template overview in point (6)
-   Create a yaml file in your IDE of choice

    ```bash
    touch monk-test.yaml
    ```

-   Choose your namespace under which all your runnables will be referenced

    ```yaml
    namespace: monk-test
    ```

-   Create a ‘base’ or ‘common’ structure defining core elements of your component

    -   files

        ```yaml
        common-files:
            defines: files
            email-filter:
                path: /usr/src/app/email_filter
                contents: |
                    *@spam.com
                    *@also_spam.com
            config-json:
                path: /usr/src/app/config.json
                raw: true
                contents: '{
                    "jsonConfig": "some val"
                    }'
        ```

    -   variables

        ```yaml
        common-variables:
            defines: variables
            external-service-rpc-port:
                env: EXTERNAL_SERVICE_RPC_PORT
                value: 9090
        ```

    -   combined

        ```yaml
        common:
            variables:
                defines: variables
                external-service-rpc-port:
                    env: EXTERNAL_SERVICE_RPC_PORT
                    value: 9090
            files:
                defines: files
                emails-filter:
                    path: /usr/src/app/emails
                    contents: |
                        *@spam.com
                        *@also_spam.com
                    config-json:
                        path: /usr/src/app/config.json
                        raw: true
                        contents: '{
                            "jsonConfig": "some val"
                        }'
        ```

    -   referencing from runnable definition:
        ```yaml
        statistics:
            defines: runnable
            containers:
                defines: containers
                    statistics:
                        image: gcr.io/monk-test/statistics:latest
            files:
                defines: files
                inherits: ./common-files
                email-filter:
                    container: statistics
                config-json:
                    container: statistics
        ```

-   Look for examples in github - reference to monk repo
    -   [https://github.com/monk-io/monk-chatwoot](https://github.com/monk-io/monk-chatwoot)
-   If you are using your own containers - publish to your container repo of choice
    -   using docker login to make you private repo visible by monk:
        -   gcr:
            -   `monk docker-login -u _json_key -p "$(cat gcr.json)" -s [gcr.io/your-repo/your-container](http://gcr.io/moncc-public-gcr/moncc-ci)`
    -   Once we activate image transfer we should add a section that local images can be also deployed
    -   complete yaml file at the end of section
