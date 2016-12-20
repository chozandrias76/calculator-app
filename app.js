$(function() {

    $(".calculatorButtons")
        .on("mouseover", function() { //Works for any click on a calculator button
            $(this)
                .css("color", "white");
        })
        .on("mouseout", function() {
            $(this)
                .removeAttr('style');
        })
        .on("click", function() {
            $(this)
                .css("background-color", "#2c4645");
            // setTimeout(function(){
            //   $(this).removeAttr('style');
            // }, 2000);
            displayString.setValue($(this)
                .text());
        });

    $(document)
        .keypress(function(event) {
            //alert('Handler for .keypress() called. - ' + String.fromCharCode(event.charCode));
            var keyPress = String.fromCharCode(event.charCode);
            displayString.setValue(String.fromCharCode(event.charCode));
        });

    var MathExpression = {
        x: 0,
        operand: "",
        y: 0,

        // save initial values
        init: function() {
            var origValues = {};
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && prop != "origValues") {
                    origValues[prop] = this[prop];
                }
            }
            this.origValues = origValues;
        },
        // restore initial values
        reset: function() {
            for (var prop in this.origValues) {
                this[prop] = this.origValues[prop];
            }
        },

        value: function() {
            return `${this.x} ${this.operand} ${this.y}`;
        }
    }

    MathExpression.init();
    var displayString = { //Object that allows us to modify what is going to be written on the display
        displayValue: "",

        setValue: function(value) {
            if (isNaN(Number(value)) === false) { //If the value is a number
                //console.log(value);
                for (var i = $("#display-screen")
                        .children()
                        .length; i > 0; i--) {
                    this.displayValue[i + 1] = this.displayValue[i]; //Push the last digit to left
                    this.displayValue[i] = value; //Change first digit to clicked value
                }
                this.displayValue += value; //Add the value to the string
                this.displayValue = this.displayValue.substring(this.displayValue.length - $("#display-screen")
                    .children()
                    .length, this.displayValue.length); //Start replacing characters when the string is longer than display space

            } else if (isNaN(Number(value))) { //If we have anything but a number
                if (value != "." && value != "=") { //Special treatment for operators

                    MathExpression.x = parseInt(this.displayValue); //Sets our first varaible
                    MathExpression.operand = value; //Sets our operand

                    this.displayValue = "";
                } else if (value == "." && this.displayValue.indexOf(".") == -1) { //If I am pressing "." and none exists already
                    for (var i = $("#display-screen")
                            .children()
                            .length; i > 0; i--) {
                        this.displayValue[i + 1] = this.displayValue[i]; //Push the last digit to left
                        this.displayValue[i] = value; //Change first digit to clicked value
                    }
                    this.displayValue += value; //Add the value to the string
                    this.displayValue = this.displayValue.substring(this.displayValue.length - $("#display-screen")
                        .children()
                        .length, this.displayValue.length); //Start replacing characters when the string is longer than display space

                } else if (value == "=") { //If our special character is '='
                    if (MathExpression.operand != "") { //Make sure math is possible
                        MathExpression.y = this.displayValue; //Change our y to what number is on display
                        doMaths(); //Do maths with our Expression
                        //MathExpression.reset();
                    } else if (MathExpression.operand == "Clr") {
                        MathExpression.reset();
                        this.displayValue = "";
                    }
                } else if (value == "Clr") {
                    MathExpression.reset();
                    this.displayValue = "";
                }

            }
            updateDisplay();
        },

        getValue: function() {
            return this.displayValue;
        }
    };

    function doMaths() {
        console.log(MathExpression.value());
        try {
            displayString.displayValue = eval(MathExpression.value())
                .toString();
            MathExpression.x = displayString.displayValue;
            //throw "An exception!"
        } catch (e) {
            console.log(e);
        }
        //console.log(eval(MathExpression.value()));
    };

    function updateDisplay() { //Grabs the actual string value to display and changes the divs
        //console.log(displayString);
        var digits = displayString.getValue()
            .split('')
            .reverse()
            .join(''); //Screen writes from right to left
        if (digits != "") //Only update the screen if the string contains numbers
            var displayScreen = [].reverse.call($("#display-screen")
                .children())
            .each(function(i) { //Reverse div array to write right to left
                $(this)
                    .html(digits[i]); //Update the screen with all the new values
            });
        else //Clear the screen
            var displayScreen = [].reverse.call($("#display-screen")
                .children())
            .each(function(i) { //Reverse div array to write right to left
                $(this)
                    .html("0"); //Update the screen with all the new values
            });
    }
});
