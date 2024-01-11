(function () {
  function search (event) {
    event.preventDefault();
    console.log('submit();');
  }
  function reveal (className, event) {
    var target = (event.currentTarget || event.target);
    event.preventDefault();
    toggle.call(this, className, event);
  }
	function toggle (className, event) {
    var target = (event.target || event.currentTarget);
		var descendant = descends.call(this, target);
		var method = (descendant ? 'add' : 'toggle');
		return this.classList[method](className);
	}
  function update (event) {
    var element = (event.currentTarget || event.target);
    var type = element.name.match(/(minimum|maximum)/)[0];
    var directions = {
      minimum: 'nextSibling',
      maximum: 'previousSibling'
    };
    var sibling = siblings.call(directions[type], element);
    var attribute = ['data', type].join('-');
    return sibling.setAttribute(attribute, element.value);
  }
  function siblings (element) {
  	var valid = (element[this].nodeType === 1);
    return (valid ? element[this] : siblings.call(this, element[this]));
  }
  function descends (element) {
  	var parent = element.parentNode;
    var child = (parent === this);
    return (child || (!!parent ? descends.call(this, parent) : false));
  }
	function listen (element) {
		return element.addEventListener(this.event, this.handler, false);
	}
	function delegate (elements, event, handler) {
		var collection = (Array.isArray(elements) ? elements : [elements]);
		return collection.map(listen.bind({
			event: event,
			handler: handler
		}));
	}
	function find () {
		var selectors = Array.from(arguments).join(',');
		return Array.from(document.querySelectorAll(selectors));
	}
  function register (action) {
    return delegate(action.DOM, action.type, action.handler);
  }
  function init (actions) {
    return actions.map(register);
  }
  var forms = {
    search: find('section.search form')
  };
	var dialogs = {
		search: find('section.search')[0]
	};
	var tooltips = {
		details: find('section.details')[0]
	};
	var controls = {
		search: find(
			'header .search > span',
			'header .search a'
		).concat(
			dialogs.search
		),
		details: [tooltips.details],
    range: find('input[type="range"]'),
    tooltips: find('section.timeline article dl.description a')
	};
  var actions = [
    {
      DOM: controls.tooltips,
      type: 'click',
      handler: reveal.bind(tooltips.details, 'active')
    },
    {
    	DOM: controls.details,
    	type: 'click',
    	handler: toggle.bind(tooltips.details, 'active')
    },
    {
    	DOM: forms.search,
    	type: 'submit',
    	handler: search
    },
    {
      DOM: controls.search,
      type: 'click',
      handler: toggle.bind(dialogs.search, 'active')
    },
    {DOM: controls.range, type: 'input', handler: update}
  ];
  return init(actions);
}).call(this);
