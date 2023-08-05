#Base directory
BDIR="$1"

#Output file
OFILE="build/index"

#Generate index
ODATA="$(cat ${BDIR}build/index.html)"

#Generate .h file
ODATA="const char web_widgets[] = R\"=====($ODATA)=====\";"
echo "$ODATA" > "${OFILE}.h"
