import React from 'react';
import {render} from 'react-dom';
import App from './App';

import 'react-images-grid/src/styles.css';

const rootEl = document.getElementById('app');

render(<App />, rootEl);

if (module.hot) module.hot.accept();
