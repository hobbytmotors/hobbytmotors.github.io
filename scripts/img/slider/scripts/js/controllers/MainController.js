app.controller('MainController', function($scope, $timeout, $location, $anchorScroll, $routeParams) {
    var slidesInSlideshow = 3;
    var slidesTimeIntervalInMs = 3000;

    $scope.slideshow = 1;

    function interval() {
        $scope.slideshow = ($scope.slideshow % slidesInSlideshow) + 1;
        slideTimer = $timeout(interval, slidesTimeIntervalInMs);
    }

    var slideTimer = $timeout(interval(), slidesTimeIntervalInMs);

    /*
     * The slider functions that are connected to the buttons of the slider.
     */
    $scope.next = function() {
        $scope.slideshow++;
        if ($scope.slideshow == slidesInSlideshow + 1) {
            $scope.slideshow = 1;
        }
    };

    $scope.prev = function() {
        $scope.slideshow--;
        if ($scope.slideshow == 0) {
            $scope.slideshow = slidesInSlideshow;
        }
    };


    var navItems = document.getElementsByClassName("navbar-collapse")[0];

    /*
     * The function redirects to the specific section of the navigation menu.
     * @param ID {String} - the section ID.
     */
    $scope.scrollTo = function(ID) {
        var old;

        if ($location.$$path !== "/") {
            $location.path("#");
            old = $location.hash();
            $location.hash(ID);
            $anchorScroll();
        } else {
            old = $location.hash();
            $location.hash(ID);
            $anchorScroll();
            //reset to old
            $location.hash(old);
        }

        /*
         * Closes the menu when clicked an element from the menu.
         */
        if (document.getElementsByClassName("navbar-collapse")[0].getAttribute("aria-expanded")) {
            var el = document.getElementsByClassName("navbar-toggle")[0].click();
        }
    };

    /*
     * The function redirects to the top of the current page, creating an effect of slow moving.
     */
    $scope.scrollToTop = function() {
        function move() {
            if (document.body.scrollTop == 0) {
                clearInterval(effect);
            }
            document.body.scrollTop -= 40;
        }

        var effect = setInterval(move, 10);
    };


    /*
     * The function activates on scroll and changes the navigation to fixed
      and shoows the button that redirects to the top of the page.
     */

    var btn = document.getElementById("btn-up");
    var nav = document.getElementsByClassName("navbar-default")[0];

    document.onscroll = function() {
        if (document.body.scrollTop > 40) {
            nav.classList.add("navbar-fixed-top");
        }
        if (document.body.scrollTop < 40) {
            nav.classList.remove("navbar-fixed-top");
        }
        if (document.body.scrollTop > 500) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    }

});
