import Body from 'Body';
import element from 'Utils/element';
import expectjs from 'expect.js';

// todo Body to Document
const body = new Body();

// import viewTest from 'viewTest';
// viewTest(body);
//
// import objectTest from 'objectTest';
// objectTest(body);

// import componentsTest from 'componentsTest';
// componentsTest(body);

import apiTest from 'Api/apiTest';
apiTest(body);
