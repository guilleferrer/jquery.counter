(function ($) {

    var crono = function (options) {

            var t, $dec = $(this),
                interval, laps = [],
                started = false,

                units = {
                    tenths: 10,
                    half_seconds : 500,
                    seconds: 1000,
                    minutes: 60 * 1000
                },

                limits = {
                    tenths: 99,
                    half_seconds : 29,
                    seconds: 59,
                    minutes: 59
                },

                _change = function () {
                    if (options.direction == 'clockwise') {
                        t = t + 1;
                    } else if (options.direction === 'counterclockwise') {
                        t = t - 1;
                    }
                    $dec.val(t);
                    $dec.trigger('change');
                    check_limit();
                },


                check_limit = function () {
                    if (options.direction === 'clockwise') {
                        if (t === limits[options.units]) {
                            t = 0;
                        }
                    } else if (options.direction === 'counterclockwise') {
                        if (t == 0) {
                            t = limits[options.units];
                        }
                    }
                },

                reset = function () {
                    $dec.val(t);
                    started = false;
                    clearInterval(interval);
                };

            if (options.direction === 'clockwise') {
                t = 0;
            } else if (options.direction === 'counterclockwise') {
                t = limits[options.units];
            }


            return {
                start: function () {
                    if (started === false) {
                        interval = setInterval(_change, units[options.units]);
                        started = true;
                    }
                },

                stop: function () {
                    clearInterval(interval);
                    reset();
                },

                total_time: function () {
                    return t;
                },

                // Stores the current time value in a stack
                lap: function () {
                    laps.push(t);
                },

                get_laps: function () {
                    $dec.append(laps);
                },

                clear: function () {
                    // reset time
                    t = 0;
                    // reset laps
                    laps = [];
                    //reset view
                    reset();
                }
            }
        };


    $.fn.counter = function (opts, val) {

        var _opts;

        // api access using the action key
        if (opts === 'action') {
            _opts = {
                action: val
            }
        } else {
            _opts = $.extend({}, $.fn.counter.defaults, opts);
        }

        return this.each(function () {

            // Create a crono for the selected element
            if (this.mycrono === undefined) {
                this.mycrono = crono.apply(this, [_opts]);
            }
            // AutoStart ?
            if (_opts.autoStart === true) {
                this.mycrono.start();
            }
            // Api
            if (_opts.action !== undefined) {
                this.mycrono[_opts.action]();
            }
        });
    }

    /**
     * Defaults
     */
    $.fn.counter.defaults = {
        units: 'seconds',
        autoStart: true,
        direction: 'clockwise'
    };


})(jQuery);

/**
 * Clock, extends counter
 *
 *
 */
(function ($) {
    var _counter = $.fn.counter;
    $.fn.extend({
        clock: function (options) {

            // Default options
            var defaultOpts = {
                tenthsClass: 'tenths',
                secondsClass: 'seconds',
                minutesClass: 'minutes'
            },

                _opts = $.extend({}, defaultOpts, options),

                $tenths = $(this).find('.' + _opts.tenthsClass),
                $seconds = $(this).find('.' + _opts.secondsClass),
                $minutes = $(this).find('.' + _opts.minutesClass);

            if ($tenths.length) {
                _counter.call($tenths, {
                    units: 'tenths',
                    autoStart: true
                });
            }

            if ($seconds.length) {
                _counter.call($seconds, {
                    units: 'seconds',
                    autoStart: true
                });
            }

            if ($minutes.length) {
                _counter.call($minutes, {
                    units: 'minutes',
                    autoStart: true
                });
            }
        }
    });
})(jQuery);


(function ($) {

    $.fn.extend({
        knobCounter: function (counterOpts, knobOpts) {
            var _defaultKnobOpts = {
                ticks: 8,
                stopper: false
            },
                _defaultCounterOpts = {

                };

            counterOpts = $.fn.extend({}, _defaultCounterOpts, counterOpts), knobOpts = $.fn.extend({}, _defaultKnobOpts, knobOpts);


            $(this).counter(counterOpts).knob(knobOpts);
        }

    });

})(jQuery);

/**
 * Clock with KNOB interface
 */
(function ($) {
    $.fn.extend({
        knobClock: function () {
            $(this).clock();
            $(this).find('input').knob({
                ticks: 8,
                stopper: false,
                cursor: true,
                skin: "tron",
                width: '200'
            });
        }
    });
})(jQuery)