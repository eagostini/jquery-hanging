jQuery(function ($) {
    var bind = {
        /**
         * @param {jQuery} target
         * @param {Object} defaults
         * @returns {jQuery}
         */
        it: function it(target, defaults) {
            var that = this;

            return target.on('change click input keyup paste', function () {
                var target = $(this);

                if (target.serialize() !== defaults.data) {
                    sandbox.it(target, function (clone) {
                        that.prop('disabled', !clone.valid());
                    });
                } else {
                    that.prop('disabled', defaults.disabled);
                }
            });
        }
    };

    var sandbox = {
        /**
         * @param {jQuery} target
         * @param {Function} callback
         */
        it: function it(target, callback) {
            var clone = target.clone();

            var source = target.parent();
            var tag = 'form';

            if (!clone.is(tag)) {
                clone = $('<' + tag + ' />').append(clone);
            }

            clone.find(':input').each(function () {
                var element = $(this);
                var selector = '@' + element.attr('name');
                var value = source.find(selector).val();

                if (element.is(':file')) {
                    element.attr('type', 'text');
                }

                element.val(value);
            });

            clone.css({
                bottom: 0,
                opacity: 0,
                position: 'absolute'
            }).appendTo(document.body);

            callback.call(target, clone);

            clone.remove();
        }
    };

    var verify = {
        /**
         * @param {jQuery} target
         * @return {Boolean}
         */
        it: function it(target) {
            var source = target.parent();
            var warnings = source.find('[required]:input:not([name])');

            return !warnings.length;
        }
    };

    /**
     * @param {jQuery} element
     * @returns {jQuery}
     */
    $.fn.hangs = function (element) {
        var original = {};
        var target = $(element);
        var that = this;

        original.disabled = that.is(':disabled');
        original.data = original.disabled && target.serialize();

        if (!verify.it(target)) {
            console.warn('jQuery Hanging: target has required fields (or is a required field) with no name attribute(s). It might cause unexpected validation behaviours.');
        }

        bind.it.call(that, target, original).change();
    };
});