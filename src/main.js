import 'Topi/styles/topi.scss';

// Import jquery and export to global. It's import to have the same reference
// used by framework and other plugins.
import jQuery from "jquery";
window.jQuery = jQuery;

// import some utils
import element from "Topi/Utils/element";
import animate from "Topi/Utils/animate";

// jquery-datetimepicker
import 'jquery-datetimepicker/build/jquery.datetimepicker.full.js';
import 'jquery-datetimepicker/build/jquery.datetimepicker.min.css';
