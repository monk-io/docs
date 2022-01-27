---
title: Add cloud provider
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Monk requires access to your cloud account in order to be able to provision cloud resources on your behalf. Before running a template that provisions instances, load-balancers, volumes etc. you will have to add your cloud provider to Monk.

:::note

Your credentials are saved by your local Monk instance and shared with other peers within your cluster via encrypted connections on a need-to-know basis. Credentials are never transferred outside of your infrastructure.

:::

## Prerequisites

This procedure can be performed only while you're connected to a cluster - either a fresh or existing one. Monk will ask you to create a cluster in case you try the following commands without having a cluster.

Monk will only accept one provider of each kind per cluster. This means that you can have GCP, AWS, Azure and DO providers added at the same time but you can't have eg. two sets of GCP credentials for different projects.

## Step 1: Obtaining cloud credentials

<Tabs
defaultValue="gcp"
values={[
{label: 'GCP', value: 'gcp'},
{label: 'AWS', value: 'aws'},
{label: 'Azure', value: 'azure'},
{label: 'Digital Ocean', value: 'do'},
]}>

<TabItem value="gcp">

1. Create a new project in your GCP console,
2. In the new project, go to **IAM &#8594; Service Accounts &#8594; CREATE SERVICE ACCOUNT**
3. Assign the **Admin** role on the project to the account,
4. On the account list, click **three dots** and create a **JSON Key** for the account,
5. Save the file on your machine eg. in `key.json`

:::warning

Service Account Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem>

<TabItem value="aws">

If you're running the AWS CLI, you should be able to locate the credentials in the `~/.aws/credentials` on your machine, i.e.:

    [default]
    aws_access_key_id=F0FADIOSFODNN7EXAMPLE
    aws_secret_access_key=wJalrUUtnEEMI/K7MEDNG/bPxRfiCYEXAMPLEKEY

If you don't have that file, consult the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

:::note

Alternatively, if you don't want AWS CLI, follow these steps to obtain your Access and Secret Keys.

1. Open [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
2. Log in to your Amazon account
3. In searchbox - search for `IAM`.
4. On the right you will see `Quick links`, click `My Access Key`
5. Click `Create New Access Key`
6. You will now be able to view or download Access and Secret Keys.

:::

:::warning

Make sure that the account has **AmazonEC2FullAccess policy**.

:::

:::warning

AWS Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem>

<TabItem value="azure">

Assuming you're using Azure CLI, issue the following command:

    az ad sp create-for-rbac --role Contributor --sdk-auth > azurekey.json

This will produce JSON file containing your access key.

:::warning

Azure Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem>

<TabItem value="do">

1. Go to [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Create a new Personal Access Token
3. Note down the Token for future use

:::warning

DigitalOcean API Token is sensitive information. Take care to store it securely.

:::

</TabItem>

</Tabs>

## Step 2: Adding the provider

<Tabs
defaultValue="gcp"
values={[
{label: 'GCP', value: 'gcp'},
{label: 'AWS', value: 'aws'},
{label: 'Azure', value: 'azure'},
{label: 'Digital Ocean', value: 'do'},
]}>

<TabItem value="gcp">

In order to add your Service Account key to Monk do:

    monk cluster provider add -p gcp -f <<path/to/your-key.json>>

where `<<path/to/your-key.json>>` is an absolute path to your Service Account key in JSON format.

For example:

    monk cluster provider add -p gcp -f ~/myproject/key.json

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

<TabItem value="aws">

In order to add your AWS credentials to Monk do:

    monk cluster provider add -p aws

Monk will look for AWS credentials in your AWS CLI config folder `~/.aws/credentials`:

    AWS config /Users/me/.aws/credentials detected, multiple profiles present - pick one.
    ? AWS profile  [Use arrows to move, type to filter]
    > default
        profile eb-cli

:::info

If `~/.aws/credentials` file is not present, Monk will prompt you for Access and Secret Keys.

:::

Select or enter the credentials and confirm with ENTER.

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

<TabItem value="azure">

In order to add your SDK authentication JSON file to Monk do:

    monk cluster provider add -p azure -f <<path/to/your-sdk-file.json>>

where `<<path/to/your-sdk-file.json>>` is an absolute path to your SDK authentication file in JSON format.

For example:

    monk cluster provider add -p azure -f ~/myproject/azure.json

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

<TabItem value="do">

In order to add your Digital Ocean Personal Access Token to Monk do:

    monk cluster provider add -p digitalocean

You will be prompted for your Digital Ocean Personal Access Token:

    ? Digitalocean Token *******************

Enter or paste your token and confirm with ENTER.

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

</Tabs>

## Conclusion

Adding a single provider is enough to start provisioning instances and other resources via Monk. If you have multiple accounts, you can add them the same way by just going back to [Step 1](#Step-1:-Obtaining-cloud-credentials) and repeating the process.

Adding providers is usually a one time operation performed on new clusters. Once the credentials are in there is no maintenance required from the user. This action doesn't have to repeated during deployments, even if they happen from different nodes connected to the same cluster. Monk will manage your credentials and use them only when performing actions on the infrastructure relevant to the cluster itself.
