import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './app/app';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.querySelector('myorg-root'));
