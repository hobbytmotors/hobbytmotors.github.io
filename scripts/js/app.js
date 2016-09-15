/*
 * Sets the used templates when selected specific route in the app.
 * If unrecognized route is selected redirects to the main page.
 */

var app = angular.module('hobbyt', ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/main-view.html'
            }).when('/force-balance', {
                templateUrl: 'templates/force-balance.html'
            }).when('/drivetrain', {
                templateUrl: 'templates/drivetrain.html'
            }).when('/batteries', {
                templateUrl: 'templates/batteries.html'
            }).when('/electronics', {
                templateUrl: 'templates/electronics.html'
            }).when('/chassis', {
                templateUrl: 'templates/chassis.html'
            }).when('/suspensions', {
                templateUrl: 'templates/suspensions.html'
            }).otherwise({
                redirectTo: '/'
            })
    }]);

app.run(function ($rootScope, $location) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if (!$location.path().match(/^\/?$/) && !$rootScope.mainVisitedOnce) {
            $rootScope.mainVisitedOnce = true;
        }
    });
});

app.controller('MainController', function ($scope, $timeout, $location, $anchorScroll,$rootScope) {

    /*
     *  Slider functions. Controlling the buttons and timing of slides change.
     */
    var slidesInSlideshow = 3;
    var slidesTimeIntervalInMs = 5000;
    $scope.slideshow = 1;

    function interval() {
        requestAnimationFrame(function () {
            $scope.slideshow = ($scope.slideshow % slidesInSlideshow) + 1;
            slideTimer = $timeout(interval, slidesTimeIntervalInMs);
        })
    }

    var slideTimer = $timeout(interval(), slidesTimeIntervalInMs);

    /*
     * The slider functions that are connected to the buttons of the slider.
     */
    $scope.next = function () {
        $scope.slideshow++;
        if ($scope.slideshow == slidesInSlideshow + 1) {
            $scope.slideshow = 1;
        }
    };

    $scope.prev = function () {
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
    $scope.scrollTo = function (ID) {
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
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        }

    };

    $scope.returnToMainPage = function () {
        $location.path("#");
    };

    /*
     * The function redirects to the top of the current page, creating an effect of slow moving.
     */
    var move = function () {
        document.body.scrollTop -= 80;
        if (document.body.scrollTop !== 0) {
            requestAnimationFrame(move);
        }
    };

    $scope.scrollToTop = function () {
        requestAnimationFrame(move)
    };


    /*
     * The function activates on scroll and changes the navigation to fixed
     * and shows the button that redirects to the top of the page.
     */
    var btn = document.getElementById("btn-up");
    var nav = document.getElementsByClassName("navbar-default")[0];
    var collapse = false;
    var navList = document.getElementById("nav-list");


    document.getElementsByClassName("btn-collapse")[0].addEventListener('click', function (event) {
        requestAnimationFrame(function () {
            if (!collapse) {
                navList.style.display = "block";
            } else {
                navList.style.display = "none";
            }
            collapse = !collapse;
        });
    });

    document.onscroll = function () {
        var scrollTop = document.body.scrollTop;
        requestAnimationFrame(function () {
            if (scrollTop > 40) {
                nav.classList.add("navbar-fixed-top");
            }
            if (scrollTop < 10) {
                nav.classList.remove("navbar-fixed-top");
            }
            if (scrollTop > 500) {
                btn.style.display = "block";
            } else {
                btn.style.display = "none";
            }
        })
    };

    var contactForm = document.getElementById("contact-form");

    $scope.sendForm = function() {
        $scope._crateContactFormMessageContainer();
        $scope._sendMailWithFormspree();
        return false;
    };


    /**
     * Send mail through Formspee API.
     * @private
     * @returns {undefined}
     */
    $scope._sendMailWithFormspree = function() {
        var url = 'https://formspree.io/l_yanev@abv.bg';
        var xhttp = new XMLHttpRequest();
        var messageData = {
            subject: document.getElementById("subject").value,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };


        xhttp.open('POST', url, true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.addEventListener('load', $scope._formLoadHandler.bind(this, xhttp), false);
        xhttp.addEventListener('error', $scope._formErrorHandler.bind(this), false);

        xhttp.send(JSON.stringify(messageData));
    };


    /**
     * Load event handler.
     * @param {object} xhttp - XMLHttpRequest object.
     * @private
     * @returns {undefined}
     */
    $scope._formLoadHandler = function(xhttp) {
        this._contactFormMessageContainer.innerText = 'The message was send successful.';
    };

    /**
     * Error event handler.
     * @private
     * @returns {undefined}
     */
    $scope._formErrorHandler = function() {
        this._contactFormMessageContainer.innerText = 'Something went wrong, please try again later.';
    };

    /**
     * Submit event handler.
     * @param {Object} event - Submit event
     * @private
     * @returns {undefined}
     */
    $scope._formSubmitHandler = function(event) {
        event.preventDefault();

        if (this.isFormValid(this._contactForm)) {
            this._sendMailWithFormspree();
        }
    };

    /**
    * Creates field for response 
    * @private
    */
    $scope._crateContactFormMessageContainer = function() {
        var messageContainer = document.createElement('p');

        messageContainer.setAttribute('data-contact-form', 'message');
        messageContainer.classList.add('message-form-response')
        contactForm.appendChild(messageContainer);

        $scope._contactFormMessageContainer = messageContainer;
    };


});
