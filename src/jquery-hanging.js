+function (exports) {
    if (typeof window === 'undefined') {
        module.exports = exports;
    } else {
        return exports(window.jQuery);
    }
}(function ($) {
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

                if (target.dirty()) {
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
        const target = $(element);
        const that = this;

        const original = {
            disabled: that.is(':disabled')
        };

        bind.it.call(that, target, original).change();
    };
});
