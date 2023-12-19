---
title: Obtaining Cloud Credentials
---

Monk requires access to your cloud account in order to be able to provision cloud resources on your behalf. You need to obtain credentials from your cloud provider before creating a new project.

See below for instructions on how to obtain credentials for each cloud provider. Once you have them, you can proceed to [Setting Up Your Project](project-setup).

## Google Cloud Platform (GCP)

### Via GCP CLI

If you're running the [GCP CLI](https://cloud.google.com/sdk/gcloud/), you can use it to create credentials.

For example:

    gcloud iam service-accounts create monk --display-name "Monk Service Account"

    gcloud projects add-iam-policy-binding <PROJECT_ID> --member "serviceAccount:monk@<PROJECT_ID>.iam.gserviceaccount.com" --role "roles/owner"
        
    gcloud iam service-accounts keys create key.json --iam-account monk@<PROJECT_ID>.iam.gserviceaccount.com

Where `<PROJECT_ID>` is the ID of your GCP project. It is advisable to create a new project for Monk.

### Via GCP Console

1. Create a new project in your [GCP console](https://console.cloud.google.com/),
2. In the new project, go to [**IAM &#8594; Service Accounts &#8594; CREATE SERVICE ACCOUNT**](https://console.cloud.google.com/iam-admin/serviceaccounts/create)
3. Assign the **Admin** role on the project to the account,
4. On the account list, click **three dots** and create a **JSON Key** for the account,
5. Save the file on your machine eg. in `key.json`

:::warning

Service Account Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in your Monk cluster.

:::

## Amazon Web Services (AWS)

### Via AWS CLI

If you're running the [AWS CLI](https://aws.amazon.com/cli/), you should be able to locate the credentials in the `~/.aws/credentials` on your machine, i.e.:

    [default]
    aws_access_key_id=F0FADIOSFODNN7EXAMPLE
    aws_secret_access_key=wJalrUUtnEEMI/K7MEDNG/bPxRfiCYEXAMPLEKEY

If you don't have that file, consult the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

### Via AWS Console

Alternatively, if you don't want AWS CLI, follow these steps to obtain your Access and Secret Keys.

1. Open [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
2. Log in to your Amazon account
3. In searchbox - search for `IAM`.
4. On the right you will see `Quick links`, click `My Access Key`
5. Click `Create New Access Key`
6. You will now be able to view or download Access and Secret Keys.

See [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) for more details.

:::warning

Make sure that the account has **AmazonEC2FullAccess policy**.

:::

:::warning

AWS Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in your Monk cluster.

:::

## Microsoft Azure

### Via Azure CLI

Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) and issue the following command:

    az ad sp create-for-rbac --role Contributor --sdk-auth > azurekey.json

This will produce JSON file containing your access key.

:::warning

Azure Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in your Monk cluster.

:::

## DigitalOcean

### Via DigitalOcean Console

1. Go to [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Create a new *Personal Access Token*
3. Note down the Token for future use

:::warning

DigitalOcean API Token is sensitive information. Take care to store it securely or discard it after configuring Monk. The credentials are now stored in an encrypted storage in your Monk cluster.

:::

## Revoking Credentials

If you wish to stop using Monk you can revoke credentials at any time by deleting them in the cloud console. Monk will lose access to your cloud account and its resources, but will not be able to delete them.

Thus, it is advisable to delete the Monk project in its Settings page, which will delete all resources created by Monk. Only then proceed with revoking the credentials.
