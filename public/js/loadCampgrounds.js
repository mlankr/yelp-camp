(function ($) {
    let me = {};
    let loading = false;

    me.selectors = {
        'campgroundList': '#campground-list',
        'campgroundListItems': '.campground-list-items',
        'spinner': '.spinner'
    }

    let limit = 5, offset = 5;
    me.paginate = function () {
        $.ajax({
            method: "POST",
            url: "/campgrounds/paginate",
            data: {
                limit,
                offset
            },
            'success': function (res) {
                if (!res) {
                    $(me.selectors.spinner).hide();
                }
                $(me.selectors.campgroundListItems).append(res);
                offset += limit;
                loading = false;
            },
            'error': function (request, error) {
                console.error("Request: " + JSON.stringify(request));
            }
        });
    }

    me.isBottomReached = function (elem) {
        const $elem = $(elem);
        const docViewTop = $(window).scrollTop();
        const docViewBottom = docViewTop + $(window).height();

        const elemTop = $elem.offset().top;
        const elemBottom = elemTop + $elem.height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    me.eventListeners = function () {
        $(window).scroll(function () {
            if (me.isBottomReached(me.selectors.spinner) && !loading) {
                loading = true;
                $(me.selectors.spinner).show();
                setTimeout(me.paginate, 2000);
            }
        });
    }

    me.init = function () {
        me.eventListeners()
    }

    $(document).ready(me.init);

})(jQuery)