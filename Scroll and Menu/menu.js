/*-------------------------------------------------------------------- 
Menu function and related css styling

--------------------------------------------------------------------*/


var allUIMenus = [];

$.fn.menu = function(options){
	var caller = this;
	var options = options;
	var m = new Menu(caller, options);	
	allUIMenus.push(m);
	
	$(this)
	.mousedown(function(){
		if (!m.menuOpen) { m.showLoading(); };
	})	
	
	
	.click(function(){
		if (m.menuOpen == false) { m.showMenu(); }
		else { m.kill(); };
		return false;
	});
	
	return m;
};

function Menu(caller, options){
	var menu = this;
	var caller = $(caller);
	var container = $('<div class="fg-menu-container ui-widget ui-widget-content ui-corner-all">'+options.content+'</div>');
	
	this.menuOpen = false;
	this.menuExists = false;
	
	var options = jQuery.extend({
		content: null,
		width: 180, 
		maxHeight: 180, 
		positionOpts: {
			posX: 'left', 
			posY: 'bottom',
			offsetX: 0,
			offsetY: 0,
			directionH: 'right',
			directionV: 'down', 
			detectH: true, // do horizontal collision detection  
			detectV: true, // do vertical collision detection
			linkToFront: false
		},
		showSpeed: 200, // show/hide speed in milliseconds
		callerOnState: 'ui-state-active', // class to change the appearance of the link/button when the menu is showing
		loadingState: 'ui-state-loading', // class added to the link/button while the menu is created
		linkHover: 'ui-state-hover', // class for menu option hover state
		linkHoverSecondary: 'li-hover', // alternate class, may be used for multi-level menus		
	
	// ----- For multi-level menu-----
		crossSpeed: 200, // cross-fade speed for multi-level menus
		crumbDefaultText: 'Choose an option:',
		backLink: true, 
		backLinkText: 'Back',
		flyOut: false, //overrides to make a flyout instead
		flyOutOnState: 'ui-state-default',
		nextMenuLink: 'ui-icon-triangle-1-e', 
		topLinkText: 'All',
		nextCrumbLink: 'ui-icon-carat-1-e'	
	}, options);
	
	this.options = options;
	
	var killAllMenus = function(){
		$.each(allUIMenus, function(i){
			if (allUIMenus[i].menuOpen) { allUIMenus[i].kill(); };	
		});
	};
	
	this.kill = function(){
		caller
			.removeClass(options.loadingState)
			.removeClass('fg-menu-open')
			.removeClass(options.callerOnState);	
		container.find('li').removeClass(options.linkHoverSecondary).find('a').removeClass(options.linkHover);		
		if (options.flyOutOnState) { container.find('li a').removeClass(options.flyOutOnState); };	
		if (options.callerOnState) { 	caller.removeClass(options.callerOnState); };			
		//if (container.is('.fg-menu-ipod')) { menu.resetDrilldownMenu(); };
		if (container.is('.fg-menu-flyout')) { menu.resetFlyoutMenu(); };	
		container.parent().hide();	
		menu.menuOpen = false;
		$(document).unbind('click', killAllMenus);
		$(document).unbind('keydown');
	};
	
	this.showLoading = function(){
		caller.addClass(options.loadingState);
	};

	this.showMenu = function(){
		killAllMenus();
		if (!menu.menuExists) { menu.create() };
		caller
			.addClass('fg-menu-open')
			.addClass(options.callerOnState);
		container.parent().show().click(function(){ menu.kill(); return false; });
		container.hide().slideDown(options.showSpeed).find('.fg-menu:eq(0)');
		menu.menuOpen = true;
		caller.removeClass(options.loadingState);
		// $(document).click(killAllMenus);
		


		
		// keyboard and mouse events
		$(document).keydown(function(event){
			var e;
			if (event.which !="") { e = event.which; }
			else if (event.charCode != "") { e = event.charCode; }
			else if (event.keyCode != "") { e = event.keyCode; }
			
			var menuType = ($(event.target).parents('div').is('.fg-menu-flyout')) ? 'flyout' : 'ipod' ;
			
			switch(e) {
				case 37: // left arrow 
					if (menuType == 'flyout') {
						$(event.target).trigger('mouseout');
						if ($('.'+options.flyOutOnState).size() > 0) { $('.'+options.flyOutOnState).trigger('mouseover'); };
					};
					
					if (menuType == 'ipod') {
						$(event.target).trigger('mouseout');
						if ($('.fg-menu-footer').find('a').size() > 0) { $('.fg-menu-footer').find('a').trigger('click'); };
					if ($('.fg-menu-header').find('a').size() > 0) { $('.fg-menu-current-crumb').prev().find('a').trigger('click'); };
						if ($('.fg-menu-current').prev().is('.fg-menu-indicator')) {
							$('.fg-menu-current').prev().trigger('mouseover');							
						};						
					};
					return false;
					break;
					
				case 38: // up arrow 
					if ($(event.target).is('.' + options.linkHover)) {	
						var prevLink = $(event.target).parent().prev().find('a:eq(0)');						
						if (prevLink.size() > 0) {
							$(event.target).trigger('mouseout');
							prevLink.trigger('mouseover');
						};						
					}
					else { container.find('a:eq(0)').trigger('mouseover'); }
					return false;
					break;
					
				case 39: // right arrow 
					if ($(event.target).is('.fg-menu-indicator')) {						
						if (menuType == 'flyout') {
							$(event.target).next().find('a:eq(0)').trigger('mouseover');
						}
						else if (menuType == 'ipod') {
							$(event.target).trigger('click');						
							setTimeout(function(){
								$(event.target).next().find('a:eq(0)').trigger('mouseover');
							}, options.crossSpeed);
						};				
					}; 
					return false;
					break;
					
				case 40: // down arrow 
					if ($(event.target).is('.' + options.linkHover)) {
						var nextLink = $(event.target).parent().next().find('a:eq(0)');						
						if (nextLink.size() > 0) {							
							$(event.target).trigger('mouseout');
							nextLink.trigger('mouseover');
						};				
					}
					else { container.find('a:eq(0)').trigger('mouseover'); }		
					return false;						
					break;
					
				case 27: // escape
					killAllMenus();
					break;
					
				case 13: // enter
					if ($(event.target).is('.fg-menu-indicator') && menuType == 'ipod') {							
						$(event.target).trigger('click');						
						setTimeout(function(){
							$(event.target).next().find('a:eq(0)').trigger('mouseover');
						}, options.crossSpeed);					
					}; 
					break;
			};			
		});
	};
	
	this.create = function(){	
		container.css({ width: options.width }).appendTo('body').find('ul:first').not('.fg-menu-breadcrumb').addClass('fg-menu');
		container.find('ul, li a').addClass('ui-corner-all');
		
		// aria roles & attributes
		container.find('ul').attr('role', 'menu').eq(0).attr('aria-activedescendant','active-menuitem').attr('aria-labelledby', caller.attr('id'));
		container.find('li').attr('role', 'menuitem');
		container.find('li:has(ul)').attr('aria-haspopup', 'true').find('ul').attr('aria-expanded', 'false');
		container.find('a').attr('tabindex', '-1');
		
		//multiple levels of hierarchy - Branch out 
		if (container.find('ul').size() > 1) {
			if (options.flyOut) { menu.flyout(container, options); }
			else { menu.drilldown(container, options); }	
		}
		else {
			container.find('a').click(function(){
				menu.chooseItem(this);
				return false;
			});
		};	
		
		if (options.linkHover) {
			var allLinks = container.find('.fg-menu li a');
			allLinks.hover(
				function(){
					var menuitem = $(this);
					$('.'+options.linkHover).removeClass(options.linkHover).blur().parent().removeAttr('id');
					$(this).addClass(options.linkHover).focus().parent().attr('id','active-menuitem');
				},
				function(){
					$(this).removeClass(options.linkHover).blur().parent().removeAttr('id');
				}
			);
		};
		
		if (options.linkHoverSecondary) {
			container.find('.fg-menu li').hover(
				function(){
					$(this).siblings('li').removeClass(options.linkHoverSecondary);
					if (options.flyOutOnState) { $(this).siblings('li').find('a').removeClass(options.flyOutOnState); }
					$(this).addClass(options.linkHoverSecondary);
				},
				function(){ $(this).removeClass(options.linkHoverSecondary); }
			);
		};	
		
		menu.setPosition(container, caller, options);
		menu.menuExists = true;
	};
	
	this.chooseItem = function(item){
		menu.kill();
		$('#menuSelection').text($(item).text());	
		location.href = $(item).attr('href');
	};
};

Menu.prototype.flyout = function(container, options) {
	var menu = this;
	
	this.resetFlyoutMenu = function(){
		var allLists = container.find('ul ul');
		allLists.removeClass('ui-widget-content').hide();	
	};
	
	container.addClass('fg-menu-flyout').find('li:has(ul)').each(function(){
		var linkWidth = container.width();
		var showTimer, hideTimer;
		var allSubLists = $(this).find('ul');		
		
		allSubLists.css({ left: linkWidth, width: linkWidth }).hide();
			
		$(this).find('a:eq(0)').addClass('fg-menu-indicator').html('<span>' + $(this).find('a:eq(0)').text() + '</span><span class="ui-icon '+options.nextMenuLink+'"></span>').hover(
			function(){
				clearTimeout(hideTimer);
				var subList = $(this).next();
				if (!fitVertical(subList, $(this).offset().top)) { subList.css({ top: 'auto', bottom: 0 }); };
				if (!fitHorizontal(subList, $(this).offset().left + 100)) { subList.css({ left: 'auto', right: linkWidth, 'z-index': 999 }); };
				showTimer = setTimeout(function(){
					subList.addClass('ui-widget-content').show(options.showSpeed).attr('aria-expanded', 'true');	
				}, 300);	
			},
			function(){
				clearTimeout(showTimer);
				var subList = $(this).next();
				hideTimer = setTimeout(function(){
					subList.removeClass('ui-widget-content').hide(options.showSpeed).attr('aria-expanded', 'false');
				}, 400);	
			}
		);

		$(this).find('ul a').hover(
			function(){
				clearTimeout(hideTimer);
				if ($(this).parents('ul').prev().is('a.fg-menu-indicator')) {
					$(this).parents('ul').prev().addClass(options.flyOutOnState);
				}
			},
			function(){
				hideTimer = setTimeout(function(){
					allSubLists.hide(options.showSpeed);
					container.find(options.flyOutOnState).removeClass(options.flyOutOnState);
				}, 500);	
			}
		);	
	});
	
	container.find('a').click(function(){
		menu.chooseItem(this);
		return false;
	});
};

//Menu positioning

Menu.prototype.setPosition = function(widget, caller, options) { 
	var el = widget;
	var referrer = caller;
	var dims = {
		refX: referrer.offset().left,
		refY: referrer.offset().top,
		refW: referrer.getTotalWidth(),
		refH: referrer.getTotalHeight()
	};	
	var options = options;
	var xVal, yVal;
	
	var helper = $('<div class="positionHelper"></div>');
	helper.css({ position: 'absolute', left: dims.refX, top: dims.refY, width: dims.refW, height: dims.refH });
	el.wrap(helper);
	
	// get X pos
	switch(options.positionOpts.posX) {
		case 'left': 	xVal = 0; 
			break;				
		case 'center': xVal = dims.refW / 2;
			break;				
		case 'right': xVal = dims.refW;
			break;
	};
	
	// get Y pos
	switch(options.positionOpts.posY) {
		case 'top': 	yVal = 0;
			break;				
		case 'center': yVal = dims.refH / 2;
			break;				
		case 'bottom': yVal = dims.refH;
			break;
	};
	
	// add the offsets (zero by default)
	xVal += options.positionOpts.offsetX;
	yVal += options.positionOpts.offsetY;
	
	// position the object vertically
	if (options.positionOpts.directionV == 'up') {
		el.css({ top: 'auto', bottom: yVal });
		if (options.positionOpts.detectV && !fitVertical(el)) {
			el.css({ bottom: 'auto', top: yVal });
		}
	} 
	else {
		el.css({ bottom: 'auto', top: yVal });
		if (options.positionOpts.detectV && !fitVertical(el)) {
			el.css({ top: 'auto', bottom: yVal });
		}
	};
	
	// and horizontally
	if (options.positionOpts.directionH == 'left') {
		el.css({ left: 'auto', right: xVal });
		if (options.positionOpts.detectH && !fitHorizontal(el)) {
			el.css({ right: 'auto', left: xVal });
		}
	} 
	else {
		el.css({ right: 'auto', left: xVal });
		if (options.positionOpts.detectH && !fitHorizontal(el)) {
			el.css({ left: 'auto', right: xVal });
		}
	};
	
	// if specified, clone the referring element and position it so that it appears on top of the menu
	if (options.positionOpts.linkToFront) {
		referrer.clone().addClass('linkClone').css({
			position: 'absolute', 
			top: 0, 
			right: 'auto', 
			bottom: 'auto', 
			left: 0, 
			width: referrer.width(), 
			height: referrer.height()
		}).insertAfter(el);
	};
};


/* Sorting and find viewport dimensions */

function sortBigToSmall(a, b) { return b - a; };

jQuery.fn.getTotalWidth = function(){
	return $(this).width() + parseInt($(this).css('paddingRight')) + parseInt($(this).css('paddingLeft')) + parseInt($(this).css('borderRightWidth')) + parseInt($(this).css('borderLeftWidth'));
};

jQuery.fn.getTotalHeight = function(){
	return $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom')) + parseInt($(this).css('borderTopWidth')) + parseInt($(this).css('borderBottomWidth'));
};

function getScrollTop(){
	return self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
};

function getScrollLeft(){
	return self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
};

function getWindowHeight(){
	var de = document.documentElement;
	return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
};

function getWindowWidth(){
	var de = document.documentElement;
	return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};

/* To test whether an element will fit in the viewport */
	
function fitHorizontal(el, leftOffset){
	var leftVal = parseInt(leftOffset) || $(el).offset().left;
	return (leftVal + $(el).width() <= getWindowWidth() + getScrollLeft() && leftVal - getScrollLeft() >= 0);
};

function fitVertical(el, topOffset){
	var topVal = parseInt(topOffset) || $(el).offset().top;
	return (topVal + $(el).height() <= getWindowHeight() + getScrollTop() && topVal - getScrollTop() >= 0);
};

