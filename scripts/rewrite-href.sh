#!/usr/bin/env bash
echo "rewriting urls to work with redirects used by prpl-server"
find server/build \( -name "*.js" ! -wholename "*/node_modules/**/*.js" -o -name "*.html" \) \
-exec sed -i 's#href=\(['"'"'"]\)\([^/]\)#href=\1\/\2#g' {} +
find build \( -name "*.js" ! -wholename "*/node_modules/**/*.js" -o -name "*.html" \) \
-exec sed -i 's#href=\(['"'"'"]\)\([^/]\)#href=\1\/\2#g' {} +