#!/bin/sh

if [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo -e "Set Git Configs for Travis CI"
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"
fi