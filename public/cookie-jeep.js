/**
 * Cookie utility package
 * Based onto the quirksmode cookie post http://www.quirksmode.org/js/cookies.html
 */
(function () {
    'use strict';
    window.cookies = {};

    cookies.write = function (name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }
        document.cookie = name + ' = ' + value + expires + '; path=/';
    };

    cookies.read = function (name) {
        var nameEQ = name + '=',
            ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };

    cookies.delete = function (name) {
        this.write(name, '', -1);
    };

    if (typeof module === "object" && module.exports) {
	    module.exports = cookies;
    }

    return cookies;
}());
