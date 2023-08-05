#Base directory
BDIR="$1"

#Output file
OFILE="build/index"

#Generate index
ODATA="
<!DOCTYPE html>
<html>
	<head>
		<meta charset=\"UTF-8\">
	</head>
	
	<style>
		$(cat ${BDIR}*.css)
	</style>

	<body>
	</body>
	
	<script>
		$(cat ${BDIR}*.js)
		$(cat ${BDIR}user/*.js)
	</script>
</html>"

#Generate HTML file
echo "$ODATA" > "${OFILE}.html"
