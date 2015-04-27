#!/usr/bin/env bash

github_changelog_generator -t $PEERIO_MOBILE_CHANGELOG_GITHUB_TOKEN --no-issues-wo-labels --no-pull-requests --no-compare-link --include-labels feature,bug,enhancement,internals,security