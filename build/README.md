# Deployment to Kubernetes

A [helmfile](https://github.com/helmfile/helmfile) to publish run this application on a kubernetes-cluster is provided in [`helmfile.yaml`](./helmfile.yaml).
[`deploy.sh`](./deploy.sh) can be used as a wrapper to easily deploy with a single command.
Required prerequisites and environment-variables are detailed below.

## Prerequisites

A [kubernetes](https://kubernetes.io/)-cluster is needed with an [ingress-controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) set up.
A kube-config should be [available on the host](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/#the-kubeconfig-environment-variable).
[`kubectl`](https://kubernetes.io/de/docs/reference/kubectl/), [`helm`](https://helm.sh/), [`helm-diff`](https://github.com/databus23/helm-diff), and [`helmfile`](https://helmfile.readthedocs.io) need to be installed in order to deploy.

## Parameters

The following environment variables can be used to configure the deployment:

| Name               | Use                                                                                    | Required                               |
| ------------------ | -------------------------------------------------------------------------------------- | -------------------------------------- |
| `CREATE_NAMESPACE` | Whether to create the namespace that `helm` will deploy in                             | :x: `true` by default                  |
| `DEPLOY_HOST`      | Domain that the deployment target is reachable under. Used for ingress and other URLs. | :white_check_mark:                     |
| `PULL_SECRETS`     | Pull-secret to use (if required).                                                      | :x: will not use pull-secrets if unset |
| `REPO_FULLNAME`    | Full name (`username/repo-name`) of the GitHub-repository.                             | :white_check_mark:                     |
| `KEYCLOAK_PREFIX`  | The path-prefix to deploy keycloak under                                               | :x: `authkc` by default                |
| `USER_REALM`       | The of the keycloak-realm to use for users. Needs to be created manually.              | :x: `sprout-users` by default          |
| `ORGS_REALM`       | The of the keycloak-realm to use for organizations. Needs to be created manually.      | :x: `sprout-orgs` by default           |

## Updating the deployment

To deploy or update the deployment, make sure you followed all the prerequisites and set all required environment-variables.
Then, simply execute [`deploy.sh`](./deploy.sh),
which will in turn call [`helmfile`](https://helmfile.readthedocs.io).

## CD-Pipeline

Deployment from the CI/CD-pipeline goes roughly like this:

A GitHub Action will test the code, build a container image, and upload it to the registry.
It will then call a webhook at `http://$DEPLOY_URL/deploy`, which listens for requests with the correct token.
This webhook then pulls the current version of this repository and call the script at `build/deploy.sh`.
This script can then do the actual deployment (e.g., call `helmfile`).
The script is executed inside a pod of the cluster (image based on [`alpine/k8s`](https://github.com/alpine-docker/k8s)) with a service-account preconfigured
(i.e., the script can assume `kubectl` and other tools have a working connection to the cluster).
The service-account has access to the existing `sprout`-namespace (though may not create any namespaces).
`PULL_SECRETS` contains a comma separated list of image pull secrets to access the GitHub container registry.
The `REPO_FULLNAME`-variable is set to point to the name of the repository.

## Environment-variables set for the application

The following variables are set in the deployment:

### Frontend

- `PORT`: Port the frontend is expected to listen on
- `ORIGIN`: The origin domain
- `REVERSE_PROXY_ENABLED`: Whether the frontend is served behind a reverse-proxy.
- `BACKEND`: URL the backend is reachable under. Not necessarily a publicly reachable URL (i.e., may only work from inside the cluster).
- `AUTH_ISSUER_USERS`: The issuer-url of user-accounts
- `AUTH_ISSUER_ORGS`: The issuer-url of organization-accounts
- `AUTH_SECRET`: Random secret to encrypt auth tokens with

### Backend

- `PORT`: Port the backend is expected to listen on
- `DB_DATABASE`: Database the backend can use
- `DB_USER`: User for the database
- `DB_PASSWORD`: Password for the database
- `DB_PORT`: Port of the database
- `DB_HOST`: address of the database
- `ORIGIN`: The origin domain
- `BASE_PATH`: The base path to serve at
- `AUTH_ISSUER_USERS`: The issuer-url of user-accounts
- `AUTH_ISSUER_ORGS`: The issuer-url of organization-accounts
