angular.module('stringFilters', []).filter('displayString', function () {
    return function (input, limit) {
        if (input && input.length > limit) {
            substring = input.substring(0, limit);
            return substring + "...";
        } else {
            return input;
        }
    };
});
