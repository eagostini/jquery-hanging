jQuery($ => {
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

            clone.find(':input').each(function () {
                const element = $(this);
                const selector = `@${ element.attr('name') }`;
                const value = source.find(selector).val();

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

        target.change(function () {
            const target = $(this);

            if (target.serialize() !== original.data) {
                sandbox.it(target, clone => {
                    that.prop('disabled', !clone.valid());
                });
            } else {
                that.prop('disabled', original.disabled);
            }
        }).change();
    };
});
