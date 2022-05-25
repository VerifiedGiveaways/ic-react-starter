#!/bin/bash

# run from portal project npm script
echo "Language: $LANGUAGE";

cp -r "../../backend-$LANGUAGE/accounts/.dfx/local/canisters/accounts" "../../frontend/portal/src/services/actors";
cp -r "../../backend-$LANGUAGE/content/.dfx/local/canisters/content" "../../frontend/portal/src/services/actors";

