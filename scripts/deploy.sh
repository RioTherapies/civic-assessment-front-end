#!/usr/bin/env bash
set -euo pipefail

source ~/.zsh-work/.zprofile
export CLOUDFLARE_ACCOUNT_ID=880ecf74da02edf846e1a540a835df40

npm run build
wrangler pages deploy apps/web/dist --project-name=civic-assessment-front-end "$@"
