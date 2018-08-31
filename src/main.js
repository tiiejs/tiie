import 'styles/topi.scss';

// jQuery
// Cześć bibliotek zewnętrznych jest trudna do spakowania za pomocą webpacka,
// ze względu na różne zleżne pliki. Dlatego takie biblioteki sa ładowane w
// tradycyjny sposób. Takie biblioteki są umieszczone w katalogu
// dist/packages i są bezpośrednio włączone w index.html. Aby miały tą samą
// referencję co te spakowe, muszę wyeksportować je na do przestrzeni
// globalnej.
import jQuery from "jquery";
window.jQuery = jQuery;

// import element from "Topi/Utils/element";
// import animate from "Topi/Utils/animate";

// jquery-datetimepicker
import 'jquery-datetimepicker/build/jquery.datetimepicker.full.js';
import 'jquery-datetimepicker/build/jquery.datetimepicker.min.css';
