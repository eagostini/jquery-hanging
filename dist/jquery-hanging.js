+function (exports) {
    if (typeof window === 'undefined') {
        module.exports = exports;
    } else {
        return exports(window.jQuery);
    }
}(function ($) {
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

                if (target.dirty()) {
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

            clone.find('[name]:input').each(function () {
                var element = $(this);
                var selector = '@' + element.attr('name');

                var mirror = source.find(selector);
                var properties = mirror.data('hanging') || {};
                var value = mirror.val();

                if (element.is(':file')) {
                    element.attr('type', 'text');
                }

                element.show();
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

    /**
     * @param {jQuery} element
     * @returns {jQuery}
     */
    $.fn.hangs = function (element) {
        var target = $(element);
        var that = this;

        var original = {
            disabled: that.is(':disabled')
        };

        bind.it.call(that, target, original).change();
    };
});