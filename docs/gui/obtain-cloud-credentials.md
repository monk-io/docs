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

### AWS Account Security

:::danger

This is very important, read this first before proceeding with AWS.

:::

Monk requires an AWS account with sufficient permissions to create and manage resources. **It is strongly recommended to create a new IAM user for Monk, and not use the root account**.

Some AWS users might receive an email from AWS stating that their account has been compromised. This has happened to some of our users whose AWS accounts are new. This is a false positive caused by the fact that AWS attempts to detect unusual activity on new accounts. If you receive such an email, you can rest assured that Monk has not compromised your credentials. It is also advisable to check your CloudTrail logs to confirm that no unusual activity has taken place.

:::note

We are actively working with AWS to resolve this issue and prevent it from happening in the future.

:::

Below is a policy containing the minimum permissions required for Monk to function. You can create a new policy in the AWS console and attach it to the IAM user. Monk does not use any other permissions and will not attempt to access any other resources.

```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "VisualEditor0",
               "Effect": "Allow",
               "Action": [
                   "ec2:AttachVolume",
                   "ec2:AuthorizeSecurityGroupIngress",
                   "ec2:DeleteSnapshot",
                   "ec2:DescribeAddresses",
                   "ec2:DescribeInstances",
                   "ec2:DescribeRegions",
                   "ec2:DescribeVolumesModifications",
                   "ec2:DescribeSnapshots",
                   "ec2:DeleteVolume",
                   "iam:SimulateCustomPolicy",
                   "ec2:CreateDefaultSubnet",
                   "ec2:DescribeAvailabilityZones",
                   "ec2:CreateSecurityGroup",
                   "ec2:DescribeVolumes",
                   "ec2:ModifyInstanceAttribute",
                   "ec2:DescribeInstanceStatus",
                   "ec2:DetachVolume",
                   "ec2:ReleaseAddress",
                   "ec2:ModifyVolume",
                   "ec2:TerminateInstances",
                   "ec2:CreateTags",
                   "ec2:DeleteNetworkInterface",
                   "ec2:RunInstances",
                   "ec2:StopInstances",
                   "ec2:AllocateAddress",
                   "ec2:DescribeSecurityGroups",
                   "ec2:CreateVolume",
                   "ec2:RevokeSecurityGroupIngress",
                   "ec2:DescribeImages",
                   "ec2:DescribeSecurityGroupRules",
                   "ec2:DeleteSecurityGroup",
                   "ec2:DescribeInstanceTypes",
                   "ec2:DescribeSubnets",
                   "kms:DescribeKey",
                   "kms:CreateKey",
                   "kms:EnableKey",
                   "kms:UpdateAlias",
                   "kms:CreateAlias",
                   "kms:Encrypt",
                   "kms:Decrypt"
               ],
               "Resource": "*"
           }
       ]
   }
```


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

:::info



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
