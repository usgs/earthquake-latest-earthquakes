<?php



// work from htdocs directory
chdir(dirname(__FILE__) . '/../htdocs');
// compile javascript using app.build.js settings
echo 'Compiling javascript' . "\n";
shell_exec('node ../lib/require/r.js -o ../lib/app.build.js');
// compile css
echo 'Compiling css' . "\n";
shell_exec('node ../lib/require/r.js -o cssIn=css/index.css optimizeCss=standard out=compiled/compiled.css');



echo 'Modifying compiled javascript' . "\n";
// clean up baseUrl and urlArgs
$compiled_file = "compiled/index.js";
$compiled = file_get_contents($compiled_file);
// repoint base url from "js" to "compiled", set "build time" as stamp to urls for caching
$compiled = str_replace(
	'baseUrl:"js",urlArgs:"stamp="+(new Date).getTime()',
	'baseUrl:"compiled",urlArgs:"modified='.filemtime('index.html').'"',
	$compiled);
file_put_contents($compiled_file, $compiled);


echo 'Compiling html' . "\n";
// compile html, by minifying and substituting urls for compiled files
$MODIFIED = time();
$compiled = file_get_contents("index.html");
// substitute compiled css
$compiled = str_replace(
		'css/index.css',
		'compiled/compiled.css?modified=' . $MODIFIED,
		$compiled);
// substitute compiled js
$compiled = str_replace(
		'data-main="js/index.js" src="lib/require/require.js"',
		'src="compiled/index.js?modified=' . $MODIFIED . '"',
		$compiled);
// remove whitespace
$compiled = str_replace("\n", '', $compiled);
$compiled = str_replace("\t", '', $compiled);
// remove non-conditional comments
$compiled = preg_replace('/<!--[^\[\]]+-->/', '', $compiled);
// add "suggested" whitespace (see http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html#writing )
$compiled = str_replace('<!DOCTYPE html>', '<!DOCTYPE html>' . "\n", $compiled);
$compiled = str_replace('-->', '-->' . "\n", $compiled);
$compiled = str_replace('<html lang="en">', '<html lang="en">' . "\n", $compiled);
// output compiled html
file_put_contents("compiled/index.html", $compiled);
