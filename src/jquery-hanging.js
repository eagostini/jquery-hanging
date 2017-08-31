jQuery($ => {
    const sandbox = {
        /**
         * @param {jQuery} target
         * @param {Function} callback
         */
        it: (target, callback) => {
            const tag = 'form';

            let clone = target.clone();

            if (!clone.is(tag)) {
                clone.val(target.val());
                clone = $(`<${ tag } />`).append(clone);
            }

            target.find(':input').each(function () {
                const element = $(this);
                const name = element.attr('name');
                const value = element.val();

                clone.find(`@${ name }`).val(value);
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
