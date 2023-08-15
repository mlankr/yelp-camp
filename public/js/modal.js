(function ($) {
    let me = {};

    me.selectors = {
        'infoModal': '#infoModal'
    };

    me.showInfoModal = function () {
        if (document.cookie.indexOf('modal_shown=') < 0) {
            $(me.selectors.infoModal).modal('show');
        }
    }

    me.onModalHidden = function () {
        document.cookie = 'modal_shown=seen';  //set cookie modal_shown
    }

    me.eventListeners = function () {
        $(me.selectors.infoModal).on('hidden.bs.modal', me.onModalHidden)
    }

    me.init = function () {
        me.eventListeners();
    }

    $(document).ready(me.init);
    $(window).on('load', me.showInfoModal);
})(jQuery)