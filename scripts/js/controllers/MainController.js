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
