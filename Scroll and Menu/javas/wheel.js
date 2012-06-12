

var curDegree =  0;
var clickedDegree = 0;
var center;
var radius=90;

//Radians to degree conversion.
var radtoDeg=180/Math.PI;

//Building Menus
var allUIMenus = [];

$(window).load(function(){
	//calculating the co-ordinates
	$('#wheel').mousedown(function(e) {
		//Disable text selection
		document.onmousedown = disableMouseSelect;
		tracker(this, e);
	});
	
		// After the mouse click event re-enable selection
	$('#wheel').mouseup(function(e) {
		$('#wheel').unbind('mousemove');
		//Enabling the text selection
		document.onmousedown = enableMouseSelect;//Unselectable.disable;
	});
})


//On mouse press tracker is activated
function tracker(target, event){
	center=	[($('#wheel').outerWidth()/2), ($('#wheel').outerHeight()/2)] ;
	
	$('#wheel').mousemove(function(e) {
		positionTracker(this, e);
	});
	$('#wheel').live('dblclick',function(e) {
		clickDegree(this, e);
	});
}

function clickDegree(target, event){
	var x = event.pageX - target.offsetLeft;
	var y = event.pageY - target.offsetTop;
	x-=center[0];
	y-=center[1];
	//calculate the mouse-angle relative to center:
	var angle= findAngle(x, y);
	
	clickedDegree = Math.floor(angle*radtoDeg) + 270;	
}

function positionTracker(target, event){
	//this handler is executed on mouse-move:
	//detect the mouse-coordinates relative to center:
	var x = event.pageX - target.offsetLeft;
	var y = event.pageY - target.offsetTop;
	
	x-=center[0];
	y-=center[1];

	//Calculate Mouse-Click Angle relative to center
	var angle= findAngle(x, y);
	
	//Conversion of radian into degrees for cursor tracking	
	var startDegree =  Math.floor(angle*radtoDeg) + 270;
	
	//Tracking the rotation path and move forward / backward
	if(curDegree % 10 === 0){
		if(curDegree > startDegree){
			var prevLink = $('.ui-state-hover').parent().prev().find('a:eq(0)');						
			if (prevLink.size() > 0) {
				$('.ui-state-hover').trigger('mouseout');
				prevLink.trigger('mouseover');
			};
		}else{
			var nextLink = $('.ui-state-hover').parent().next().find('a:eq(0)');
			if (nextLink.size() > 0) {							
				$('.ui-state-hover').trigger('mouseout');
				nextLink.trigger('mouseover');
			};
		}
	}

	curDegree = Math.floor(angle*radtoDeg) + 270;	
}

function findAngle(x, y){
	//Angle calculation using trigonometric function
	var angle =Math.atan(y/x);
	if (x<0) {
		angle-=Math.PI;
		}
	return angle;
}

function disableMouseSelect(e){
	return false;
}

function enableMouseSelect(){
	return true;
}

// On Double-Click move deeper into menu tree
$('#wheel').live('dblclick',function(e) {
			
			if(flyMenu.menuOpen == true){
				if ($('.ui-state-hover').size() == 0) {
					$('.fg-menu').find('a:eq(0)').trigger('mouseover');
				};
				
				if(clickedDegree > 180){
				 //if clicked on the right side of the circle move into the child node
					if ($('.ui-state-hover').is('.fg-menu-indicator')) {	
						$('.ui-state-hover').next().find('a:eq(0)').trigger('mouseover');
					}
			}else{
				//if clicked on the left side of the circle move out of the child node
					$('.ui-state-hover').trigger('mouseout');
				if ($('.'+flyMenu.options.flyOutOnState).size() > 0) { $('.'+flyMenu.options.flyOutOnState).trigger('mouseover'); };
				}
			}
			/*else{
				flyMenu.showMenu();
				var nextLink = $('.fg-menu').find('a:eq(0)');						
				if (nextLink.size() > 0) {							
					// $(event.target).trigger('mouseout');
					nextLink.trigger('mouseover');
				};					
			}*/
		});

// Menu hide and display using inner circle	
$('#circle').click(function(e){
						
			if(flyMenu.menuOpen == true){
				$.each(allUIMenus, function(i){
			if (allUIMenus[i].menuOpen) { allUIMenus[i].kill(); };
			});
			}
			
			else{
				//alert('else loop');
				flyMenu.showMenu();
				var nextLink = $('.fg-menu').find('a:eq(0)');						
				if (nextLink.size() > 0) {							
					// $(event.target).trigger('mouseout');
					nextLink.trigger('mouseover');
				};					
			}
			
			});
		


