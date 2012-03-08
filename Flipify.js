/*
 * Flipify plugin
 * Copyright (c) 2012 Stefan Crain <stefancrain@gmail.com>
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 */

jQuery.fn.flipify = function(userOptions){
	
  // Default options
  var options = {
    stepTime: 50,
    format: "dd:hh:mm:ss",
    startTime: "01:12:32:55",
    digitImages: 6,
    digitWidth: 53,
    digitHeight: 77,
	interval: 1000,
    timerEnd: function(){},
    image: "digits.png"
  };
  var digits = [], interval;

  // Draw digits in given container
  var createDigits = function(where)
  {
    var c = 0;
    var tempStartTime = options.startTime;
    // Iterate each startTime digit, if it is not a digit
    // we'll asume that it's a separator
    for (var i = 0; i < options.startTime.length; i++)
    {
      if (parseInt(tempStartTime.charAt(i)) >= 0)
      {
        elem = jQuery('<div id="cnt_' + i + '" class="cntDigit" />').css({
          height: options.digitHeight * options.digitImages * 10,
          float: 'left',
 		  background: 'url(\'' + options.image + '\')',
          width: options.digitWidth});
        digits.push(elem);
        margin(c, -((parseInt(tempStartTime.charAt(i)) * options.digitHeight * options.digitImages)));
        digits[c].__max = 9;

        // Add max digits, for example, first digit of minutes (mm) has
        // a max of 5. Conditional max is used when the left digit has reach
        // the max. For example second "hours" digit has a conditional max of 4
        switch (options.format.charAt(i)) {
          case 'h':
            digits[c].__max = (c % 2 == 0) ? 2: 3;
            if (c % 2 != 0)
              digits[c].__condmax = 3;
            break;
          case 'd':
            digits[c].__max = 9;
            break;
          case 'm':
          case 's':
            digits[c].__max = (c % 2 == 0) ? 5: 9;
        }
        ++c;
      }
      else
        elem = jQuery('<div class="cntSeparator"/>').css({float: 'left'}).text(tempStartTime.charAt(i));
		where.append('<div>');
		where.append(elem);
		where.append('</div>');
    }
  };
 
  // Set or get element margin
  var margin = function(elem, val)
  {
    if (val !== undefined)
    	return digits[elem].css({'marginTop': val + 'px'});
    	return parseInt(digits[elem].css('marginTop').replace('px', ''));
  };
  
  // Makes the movement. This is done by "digitImages" steps.
  var moveStep = function(elem)
  {
    digits[elem]._digitInitial = -(digits[elem].__max * options.digitHeight * options.digitImages);
	return function _move() {
    mtop = margin(elem) - options.digitHeight; /// we negate this to move it up ( FUCK YA ITS A COUNTER BIOTCHES )
	if (mtop < digits[elem]._digitInitial){ // when they are too high we must the move that other shit around
			margin(elem, 0);
			if (elem > 0) moveStep(elem - 1)();
	} else {
	    margin(elem, mtop);
		if (margin(elem) / options.digitHeight % options.digitImages != 0){
			setTimeout(_move, options.stepTime);
		}
		if (mtop < -4510) {
			digits[elem].__ismax = true;
		}
    }

  };
};


  jQuery.extend(options, userOptions);
  this.css({height: options.digitHeight, overflow: 'hidden'});
  createDigits(this);
  interval = setInterval(moveStep(digits.length - 1), options.interval);

jQuery.fn.pause = function(userOptions){
	clearInterval(interval);
}
jQuery.fn.restart = function(userOptions){
  interval = setInterval(moveStep(digits.length - 1), options.interval);
}

};
