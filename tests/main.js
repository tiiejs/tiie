import 'Topi/main.js';

import Content from 'Content';
import element from 'Utils/element';
import expectjs from 'expect.js';

const content = new Content();

import viewTest from 'viewTest';
viewTest(content);

import objectTest from 'objectTest';
objectTest(content);

import componentsTest from 'componentsTest';
componentsTest(content);

import apiTest from 'Api/apiTest';
apiTest(content);

import dialogTest from 'Dialog/Views/dialogTest';
dialogTest(content);

import alertTest from 'Dialog/Views/alertTest';
alertTest(content);
content.clean();

import modalTest from 'Dialog/Views/modalTest';
modalTest(content);

import dateTest from 'Views/Widgets/dateTest';
dateTest(content);
