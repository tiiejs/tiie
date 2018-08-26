import Body from 'Body';
import element from 'Utils/element';
import expectjs from 'expect.js';

// scss
import 'styles/topi-button.scss'
import 'styles/topi-checkboxList.scss'
import 'styles/topi-dialog.scss'
import 'styles/topi-form.scss'
import 'styles/topi-input.scss'
import 'styles/topi-pagination.scss'
import 'styles/topi-portlet-light.scss'
import 'styles/topi-portlet.scss'
import 'styles/topi-section.scss'
import 'styles/topi-table.scss'
import 'styles/topi-textarea.scss'
import 'styles/topi-toolbar.scss'
import 'styles/topi-topbar.scss'
import 'styles/topi-variables.scss'
import 'styles/topi.scss'

// todo Body to Document
const body = new Body();

// import viewTest from 'viewTest';
// viewTest(body);
//
// import objectTest from 'objectTest';
// objectTest(body);

// import componentsTest from 'componentsTest';
// componentsTest(body);

// import apiTest from 'Api/apiTest';
// apiTest(body);

// import dialogTest from 'Dialog/dialogTest';
// dialogTest(body);

import alertTest from 'Dialog/Views/alertTest';
alertTest(body);
body.clean();

import modalTest from 'Dialog/Views/modalTest';
modalTest(body);
