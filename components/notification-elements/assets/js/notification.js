window.Notification = window.Notification || (function() {
	var Notification, ret;
	
	var strictMode = false;


	var moz                  = 'moz';
	var webkit               = 'webkit';
	var prototype            = 'prototype';
	var notifications        = 'notifications';
	var addEventListener     = 'addEventListener';
	var removeEventListener  = 'removeEventListener';
	var html5_notification   = 'html5_notification';
	var toString             = 'toString';
	var permissionLevel      = 'permissionLevel';
	var requestPermission    = 'requestPermission';
	

	var doc = document;
	var win = window;
	var nav = navigator;
	
	
	var root = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
	
	
	var href = (doc.body || root).lastChild.src.split('/').slice(0, -1).join('/');
	
	var USER_ALLOWED     = 2;
	var DEFAULT_ALLOWED  = 1;
	var DEFAULT_DENIED   = -1;
	var USER_DENIED      = -2;
	
	
	var WEBKIT_PERMISSION_ALLOWED      = 0;
	var WEBKIT_PERMISSION_NOT_ALLOWED  = 1;
	var WEBKIT_PERMISSION_DENIED       = 2;
	
	
	var currentPerms = DEFAULT_DENIED;
	
	
	var COOKIE_NAME = '_notifications_polyfill_permission';
	var COOKIE_EXPIRES = 60 * 60 * 24 * 365 * 5; 

	var _native = (
		win.webkitNotifications ? webkit : (
		nav.mozNotification ? moz : false
	));
	

	if (! _native && strictMode) {

		if (! nav[permissionLevel]) {
			nav[permissionLevel] = function(feature) {
				throw unknownFeature(feature);
			};
		}
		if (! nav[requestPermission]) {
			nav[requestPermission] = function(feature) {
				throw unknownFeature(feature);
			};
		}

		return false;
	}
	
	
	var _featureExists = true;
	
	
	var _notificationCenter = win.webkitNotifications || nav.mozNotification || null;
	
	
	var _notificationList = null;
	
	
	var _msSiteMode = ('external' in window && window.external.msIsSiteMode);
	
	var titleController = (function() {
		var self = { };
		
		var title;
		var message;
		var timeout;
		var showingMessage;
		
		var blink = function() {
			switch (document.title) {
				case title:
					document.title = message;
				break;
				case message:
					document.title = title;
				break;
				default:
					title = document.title;
					document.title = message;
				break;
			}
			if (showingMessage) {
				timeout = setTimeout(blink, 1000);
			}
		};
		
		self.showMessage = function(msg) {
			message = msg;
			self.hideMessage();
			showingMessage = true;
			title = document.title;
			blink();
		};
		
		self.hideMessage = function() {
			if (showingMessage) {
				showingMessage = false;
				clearTimeout(timeout);

				if (document.title === message) {
					document.title = title;
				}
			}
		};
			
		return self;
	}());
			
			
	addEvents(window, 'focus click scroll', function() {
		titleController.hideMessage();
		if (_msSiteMode) {
			window.external.msSiteModeClearIconOverlay();
		}
	});
	
	function handleFeatureNotifications() {
		if (currentPerms === 2 || currentPerms === 1 || currentPerms === -2) {
			return currentPerms;
		}
		var perms = readCookie(COOKIE_NAME);
		if (perms === null) {
			perms = DEFAULT_DENIED;
		}
		perms = Number(perms);
		if (perms < -2 || perms > 2 || ! perms) {
			perms = DEFAULT_DENIED;
		}
		currentPerms = perms;
		return perms;
	}
	
	var _navPermissionLevel = nav[permissionLevel];
	var _permissionLevelPolyfill = (_native && _notificationCenter.checkPermission) ?
		webkitPermissions : handleFeatureNotifications;
	

	if (! nav[permissionLevel]) {
		nav[permissionLevel] = function(feature) {
			if (feature === notifications) {
				return _permissionLevelPolyfill();
			}
			throw unknownFeature(feature);
		};
	} else {
		try {
			nav[permissionLevel](notifications);
		}

		catch(e) {
			_featureExists = false;
			nav[permissionLevel] = function(feature) {
				if (feature === notifications) {
					return _permissionLevelPolyfill();
				}
				return _navPermissionLevel.apply(this, arguments);
			};
		}
	}

	function requestPermissionFallback() {
		var perms = confirm('Allow notifications from ' + location.hostname + '?') ? USER_ALLOWED : USER_DENIED;
		writeCookie(COOKIE_NAME, perms, COOKIE_EXPIRES, '/', location.hostname);
		return perms;
	}
	
	
	if (! nav[requestPermission]) {
		
		if (_native && _notificationCenter[requestPermission]) {
			nav[requestPermission] = function(feature, callback) {
				if (feature === notifications) {
					return _notificationCenter[requestPermission](function() {
						if (_notificationCenter.checkPermission) {
							currentPerms = webkitPermissions();
						}
						attemptConstructorFetch();
						callback();
					});
				}
				throw unknownFeature(feature);
			};
		}
		
		else {
			nav[requestPermission] = function(feature, callback) {
				if (feature === notifications) {
					if (currentPerms === -1) {
						requestPermissionFallback();
					}
					callback();
					return;
				}
				throw unknownFeature(feature);
			};
		}
	} 
	
	else if (! _featureExists) {
		var _navRequestPermission = nav[requestPermission];
		
		if (_native && _notificationCenter[requestPermission]) {
			nav[requestPermission] = function(feature, callback) {
				if (feature === notifications) {
					_notificationCenter[requestPermission](function() {
						if (_notificationCenter.checkPermission) {
							currentPerms = webkitPermissions();
						}
						attemptConstructorFetch();
						callback();
						return;
					});
				}
				return _navRequestPermission.apply(this, arguments);
			};
		}
		
		else {
			nav[requestPermission] = function(feature, callback) {
				if (feature === notifications) {
					requestPermissionFallback();
					callback();
					return;
				}
				return _navRequestPermission.apply(this, arguments);
			};
		}
	}
	

	if (webSymbols === "always") {
		includeStylesheet('websymbols/stylesheet.css');
	}
	
	if (! _native) {

		includeStylesheet('notification.css');
		
		if (webSymbols === "needed") {
			includeStylesheet('websymbols/stylesheet.css');
		}
		
		var EventCallstack = function() {
			var stack = [ ];
			var value = function() {
				var ret;
				for (var i = 0, c = stack.length; i < c; i++) {
					ret = stack[i].apply(this, arguments);
				}
				return ret;
			};
			value.push = function(func) {
				stack.push(func);
			};
			value.remove = function(func) {
				var result = [ ];
				for (var i = 0, c = stack.length; i < c; i++) {
					if (stack[i] !== func) {
						result.push(func);
					}
				}
				stack = result;
			};
			return value;
		};
		
		_notificationList = createElement('ul', {
			id: html5_notification + '_list'
		});
		
		Notification = function(iconUrl, title, body) {
			var self = this;
			
			
			var node = createElement('li', {
				className: html5_notification,
				innerHTML: [
					'<div class="' + html5_notification + '_toolbar">',
						'<span class="' + html5_notification + '_host">' + location.hostname + '</span>',
						'<a class="' + html5_notification + '_close">&times;</a>',
					'</div>',
					'<div class="' + html5_notification + '_content">',
						(iconUrl ? '<img src="' + iconUrl + '" height="32" width="32" alt="" title="" />' : ''),
						'<div>',
							'<h1>' + title + '</h1>',
							'<p>' + body + '</p>',
						'</div>',
					'</div>'
				].join(''),
				onclick: function(evt) {
					if (! self._canceled) {
						return self._invokeEvent('click', evt || win.event);
					}
				}
			});
			
			this._node = function() {
				return node;
			};
			
			this._iconUrl  = iconUrl;
			this._title    = title;
			this._body     = body;
			
			
			if (Object.defineProperty) {
				Object.defineProperty(this, 'dir', {
					set: function(value) {
						return self._setDir(value, true);
					}
				});
			} else if ('__defineSetter__' in this) {
				this.__defineSetter__('dir', function(value) {
					return self._setDir(value, true);
				});
			}
			this.dir = 'auto';
			
			
			var events = {
				show:  EventCallstack(),
				click: EventCallstack(),
				close: EventCallstack(),
				error: EventCallstack()
			};
			
			
			this.onshow   = null;
			this.onclick  = null;
			this.onclose  = null;
			this.onerror  = null;
			
			
			var close = node.getElementsByTagName('a')[0];
			close.onclick = function() {
				self.cancel();
				return false;
			};
			
			this._canceled = false;
			
			
			this[addEventListener] = function(event, func) {
				if (events[event]) {
					events[event].push(func);
				}
			};
			
			this[removeEventListener] = function(event, func) {
				if (events[event]) {
					events[event].remove(func);
				}
			};
			
			this._invokeEvent = function(event, evtObj) {
				if (typeof this['on' + event] === 'function') {
					this['on' + event](evtObj);
				}
				if (events[event]) {
					events[event](evtObj);
				}
			};
			
		};
	

		Notification[prototype]._setDir = function(value, dontSet) {
			if (! dontSet) {
				return this.dir = value;
			}
			if (value === 'auto' || value === 'ltr' || value === 'rtl') {
				this._node().style.dir = value;
				return value;
			}
		};
		
		Notification[prototype].show = function() {
			if (! _notificationList.parentNode && doc.body) {
				doc.body.appendChild(_notificationList);
			}
			if (! this._canceled) {
				titleController.showMessage(this._title);
				if (_msSiteMode && window.external.msIsSiteMode()) {
					window.external.msSiteModeActivate();
					if (icon) {
						window.external.msSiteModeSetIconOverlay(icon, title);
					}
				}
				if (_notificationList.firstChild) {
					_notificationList.insertBefore(this._node(), _notificationList.firstChild);
				} else {
					_notificationList.appendChild(this._node());
				}
				this._invokeEvent('show');
				css(this._node(), 'display', 'block');
			}
		};
		
		Notification[prototype].cancel = function() {
			this._canceled = true;
			if (this._node().parentNode) {
				this._node().parentNode.removeChild(this._node());
				this._invokeEvent('close');
				css(this._node(), 'display', 'none');
				if (_msSiteMode) {
					window.external.msSiteModeClearIconOverlay();
				}
			}
		};
		
		correctNotificationConstructor();
	} else {
		// Otherwise, as soon as we can get to it, grab a reference
		// to the native notification constructor
		self[requestPermission] = function(callback) {
			if (_notificationCenter && _notificationCenter[requestPermission]) {
				_notificationCenter[requestPermission](function() {
					attemptConstructorFetch();
					return callback.apply(this, arguments);
				});
			} else {
				callback();
			}
		};
	}
	
	// Start making corrections to the notification constructor
	function correctNotificationConstructor() {
		switch (_native) {
			case webkit:
				// Correct the missing onshow event
				var _addEventListener = Notification[prototype][addEventListener];
				Notification[prototype][addEventListener] = function(event) {
					if (event === 'show') {
						arguments[0] = 'display';
					}
					return _addEventListener.apply(this, arguments);
				};
				var _removeEventListener = Notification[prototype][removeEventListener];
				Notification[prototype][removeEventListener] = function(event) {
					if (event === 'show') {
						arguments[0] = 'display';
					}
					return _removeEventListener.apply(this, arguments);
				};
			break;
			case moz:
				// Correct the missing onshow event
				var _addEventListener = Notification[prototype][addEventListener];
				var _removeEventListener = Notification[prototype][removeEventListener];
				Notification[prototype][addEventListener] = function(event, callback) {
					if (this._eventStacks[event]) {
						this._eventStacks[event].push(callback);
						return;
					}
					return _addEventListener.apply(this, arguments);
				};
				Notification[prototype][removeEventListener] = function(event, callback) {
					if (this._eventStacks[event]) {
						this._eventStacks[event].remove(callback);
						return;
					}
					return _removeEventListener.apply(this, arguments);
				};
				// Correct the missing onshow event
				var _show = Notification[prototype].show;
				Notification[prototype].show = function() {
					var ret = _show.apply(this, arguments);
					var evt = { type: 'show' };
					if (typeof this['onshow'] === 'function') {
						this['onshow'](evt);
					}
					this._eventStacks.show(evt);
					return ret;
				};
				// Correct the missing cancel method
				Notification[prototype].cancel = function() {
					// TODO: How does one polyfill the cancel method??
					//       For now, just put an empty function here so calls to this
					//       method don't throw undefined method errors
				};
			break;
		}
		Notification[prototype][toString] = function() {
			return '[object Notification]';
		};
	}
	
	// Make modifications to a single notification instance
	function correctNotificationInstance(note) {
		switch (_native) {
			case webkit:
				// Correct the missing onshow event
				delete note.ondisplay;
				note.onshow = null;
				note[addEventListener]('display', function() {
					if (typeof note.onshow === 'function') {
						return note.onshow.apply(this, arguments);
					}
				});
			break;
			case moz:
				// Correct the missing onshow event
				note.onshow = null;
				note._eventStacks = {
					show: EventCallstack()
				};
				// TODO: How can we correct the missing dir property?
				note.dir = 'auto';
			break;
		}
		return note;
	}
	
	// The method that creates notifications
	ret = function(iconUrl, title, body) {
		if (currentPerms === DEFAULT_DENIED || currentPerms === USER_DENIED) {
			throw 'SECURITY_ERR: Cannot create notification without user permission';
		}
		attemptConstructorFetch();
		switch (_native) {
			case webkit:
				return correctNotificationInstance(
					_notificationCenter.createNotification(iconUrl, title, body)
				);
			break;
			case moz:
				return correctNotificationInstance(
					_notificationCenter.createNotification(title, body, iconUrl)
				);
			break;
			case false:
				return new Notification(iconUrl, title, body);
			break;
		}
	};
	
	// Initialize the current permission level
	currentPerms = nav[permissionLevel](notifications);
	
// ------------------------------------------------------------------
//  Helpers
	
	function css() {
		var args = Array[prototype].slice.call(arguments, 0);
		var element = args.shift();
		if (element) {
			if (args.length === 1) {
				for (var i in args[0]) {
					if (args[0].hasOwnProperty(i)) {
						element.style[i] = args[0][i];
					}
				}
			} else if (args.length === 2) {
				element.style[args[0]] = args[1];
			}
		}
	}
	
	function createElement(tag, properties) {
		var root = doc.body || doc.documentElement;
		var parent, element = doc.createElement(tag);
		root.appendChild(element);
		for (var i in properties) {
			if (properties.hasOwnProperty(i)) {
				switch (i) {
					case 'style':
						css(element, properties[i]);
					break;
					case 'parentNode':
						parent = properties[i];
					break;
					default:
						element[i] = properties[i];
					break;
				}
			}
		}
		root.removeChild(element);
		if (parent) {
			parent.appendChild(element);
		}
		return element;
	}
	
	function readCookie(name) {
		var nameEq = name + '=';
		var cookies = doc.cookie.split(';');
		for (var i = 0, c = cookies.length; i < c; i++) {
			var cookie = cookies[i];
			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(nameEq) === 0) {
				return cookie.substring(nameEq.length);
			}
		}
		return null;
	}

	function writeCookie(name, value, expires, path, domain) {
		var cookieStr = name + '=' + value;
		if (expires) {
			var date = new Date();
			date.setTime(date.getTime() + expires);
			cookieStr += '; expires=' + date.toGMTString();
		}
		cookieStr += '; path=' + (path || '/');
		if (domain) {
			cookieStr += '; domain=' + domain;
		}
		doc.cookie = cookieStr;
	}
	
	function unknownFeature(feature) {
		return 'Feature "' + feature + '" is unknown';
	}
	
	function webkitPermissions(perms) {
		var perms = _notificationCenter.checkPermission();
		switch (perms) {
			case WEBKIT_PERMISSION_NOT_ALLOWED:
				return DEFAULT_DENIED;
			break;
			case WEBKIT_PERMISSION_DENIED:
				return USER_DENIED;
			break;
			case WEBKIT_PERMISSION_ALLOWED:
				return USER_ALLOWED;
			break;
		}
	}
	
	function includeStylesheet(file) {
		root.insertBefore(createElement('link', {
			type: 'text/css',
			rel: 'stylesheet',
			href: href + '/' + file
		}), root.firstChild);
	}
	
	function attemptConstructorFetch() {
		if (! Notification) {
			Notification = _notificationCenter.createNotification('', '', '').constructor;
			correctNotificationConstructor();
		}
	}
	
	function forInList(list, func) {
		list = list.split(' ');
		for (var i = 0, c = list.length; i < c; i++) {
			func(list[i]);
		}
	}
	
	function addEvents(obj, events, func) {
		forInList(events, function(event) {
			if (obj.addEventListener) {
				obj.addEventListener(event, func, false);
			} else if (obj.attachEvent) {
				obj.attachEvent('on' + event, func);
			}
		});
	}
	
	function removeEvents(obj, events, func) {
		forInList(events, function(event) {
			if (obj.removeEventListener) {
				obj.removeEventListener(event, func, false);
			} else if (obj.detachEvent) {
				obj.detachEvent('on' + event, func);
			}
		});
	}


	
	ret[toString] = function() {
		return 'function Notification() { [native code] }';
	};
	
	var objToString = Object[prototype][toString];
	
	Object[prototype][toString] = function() {
		try {
			if (this instanceof Notification) {
				return '[object Notification]';
			}
		} catch (e) { }
		return objToString.apply(this, arguments);
	};
	
	Object[prototype][toString][toString] = function() {
		return objToString[toString]();
	};
	
// ------------------------------------------------------------------
//  Expose

	return ret;
	
}());