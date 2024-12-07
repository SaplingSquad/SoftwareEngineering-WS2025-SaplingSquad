# CI-Setup

## Deployment

Deployment goes roughly like this:

A GitHub Action will test the code, build a container image, and upload it to the registry.
It will then call a webhook at `http://$DEPLOY_URL/deploy`, which listens for requests with the correct token.
This webhook then pulls the current version of this repository and call the script at `build/deploy.sh`.
This script can then do the actual deployment (e.g., call `helm`).
The script is executed inside a pod of the cluster (image based on [`alpine/k8s`](https://github.com/alpine-docker/k8s)) with a service-account preconfigured
(i.e., the script can assume `kubectl` and other tools have a working connection to the cluster).
The service-account has access to the existing `sprout`-namespace (though may not create any namespaces).
`PULL_SECRETS` contains a comma separated list of image pull secrets to access the GitHub container registry.
The `REPO_FULLNAME`-variable is set to point to the name of the repository.
