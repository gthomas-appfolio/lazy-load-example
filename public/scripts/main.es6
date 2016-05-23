import Ractive from 'ractive';
import Router from 'ractive-route';

import './lib/ractive/transitions.es6';

import Home from './Home.es6';

let router = new Router({
  el: '#main',
  basePath: '/'
});

router.addRoute('/', Home);

router.dispatch(window.location.pathname, { noHistory: true })
      .watchLinks()
      .watchState();
