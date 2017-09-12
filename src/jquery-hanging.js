+function (exports) {
    if (typeof window === 'undefined') {
        module.exports = exports;
    } else {
        return exports(window.jQuery);
    }
}(function ($) {
    const back = {
        /**
         * @returns {jQuery}
         */
        up: function (target) {
            const source = target.parent();

            source.find('[name]:input').each(function () {
                const element = $(this);

                element.data('hanging', {
                    required: element.prop('required')
                });
            });
        }
    };

    const bind = {
        /**
         * @param {jQuery} target
         * @param {Object} defaults
         * @returns {jQuery}
         */
        it: function (target, defaults) {
            const that = this;

            return target.on('change click input keyup paste', function () {
                const target = $(this);

                if (target.serialize() !== defaults.data) {
                    sandbox.it(target, clone => {
                        that.prop('disabled', !clone.valid());
                    });
                } else {
                    that.prop('disabled', defaults.disabled);
                }
            })
        }
    };

    const sandbox = {
        /**
         * @param {jQuery} target
         * @param {Function} callback
         */
        it: (target, callback) => {
            let clone = target.clone();

            const source = target.parent();
            const tag = 'form';

            if (!clone.is(tag)) {
                clone = $(`<${ tag } />`).append(clone);
            }

            clone.find('[name]:input').each(function () {
                const element = $(this);
                const selector = `@${ element.attr('name') }`;

                const mirror = source.find(selector);
                const properties = mirror.data('hanging') || {};
                const value = mirror.val();

                if (element.is(':file')) {
                    element.attr('type', 'text');
                }

                element.prop('required', properties.required);
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

    const verify = {
        /**
         * @param {jQuery} target
         * @return {Boolean}
         */
        it: function (target) {
            const source = target.parent();
            const warnings = source.find('[required]:input:not([name])');

            return !warnings.length;
        }
    };

    /**
     * @param {jQuery} element
     * @returns {jQuery}
     */
    $.fn.hangs = function (element) {
        const original = {};
        const target = $(element);
        const that = this;

        original.disabled = that.is(':disabled');
        original.data = original.disabled && target.serialize();

        if (!verify.it(target)) {
            console.warn('jQuery Hanging: target has required fields (or is a required field) with no name attribute(s). It might cause unexpected validation behaviours.');
        }

        back.up.call(that, target);
        bind.it.call(that, target, original).change();
    };
});
