set -e

sassfiles=(`find src/components/ -name "*.scss"`)

for sassfile in ${sassfiles[@]}; do
  # skip partials
  if [[ `basename ${sassfile}` =~ ^_ ]]; then
    continue
  fi
  cssjs=`echo ${sassfile} | sed -e 's/.scss/-css.js/'`
  lastdir=`basename $(dirname ${cssjs})`
  echo "Generating ${cssjs}"
  node scripts/sass-render/bin/sass-render.js -t scripts/sass-render/sass-template.js -s ${sassfile} -o ${cssjs}
done