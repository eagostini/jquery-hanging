jQuery(function ($) {
    var sandbox = {
        /**
         * @param {jQuery} target
         * @param {Function} callback
         */
        it: function it(target, callback) {
            var tag = 'form';

            var clone = target.clone();

            if (!clone.is(tag)) {
                clone.val(target.val());
                clone = $('<' + tag + ' />').append(clone);
            }

            target.find(':input').each(function () {
                var element = $(this);
                var name = element.attr('name');
                var value = element.val();

                clone.find('@' + name).val(value);
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
        var original = {};
        var target = $(element);
        var that = this;

        original.disabled = that.is(':disabled');
        original.data = original.disabled && target.serialize();

        target.change(function () {
            var target = $(this);

            if (target.serialize() !== original.data) {
                sandbox.it(target, function (clone) {
                    that.prop('disabled', !clone.valid());
                });
            } else {
                that.prop('disabled', original.disabled);
            }
        }).change();
    };
});