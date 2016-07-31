// This is the entry point for React webapp

import 'babel-polyfill';

const content = document.createTextNode('This is a placeholder for 8weike server.');
const container = document.createElement('span');

container.appendChild(content);
document.body.appendChild(container);
