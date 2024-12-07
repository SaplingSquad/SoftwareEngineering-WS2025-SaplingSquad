#!/usr/bin/env bash

# `secrets`-chart uses `lookup`
# https://github.com/roboll/helmfile/issues/1901
export HELM_DIFF_USE_UPGRADE_DRY_RUN=true

helmfile apply --skip-needs=false
