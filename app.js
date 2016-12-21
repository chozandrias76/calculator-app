$(function() {

    $(".calculatorButtons")
        .on("click", function() {
            displayString.handleInput($(this)
                .text());
        });

    var validChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "=", "*", "/", "."];
    var validChar = false;
    $(document)
        .keypress(function(event) {
            console.log(event.charCode)
            var keyPress
            if (event.charCode == 13) {
                keyPress = String.fromCharCode(61);
            } else {
                keyPress = String.fromCharCode(event.charCode);
            }
            validChars.forEach(elem => {
                if (keyPress.includes(elem))
                    validChar = true;
            })
            if (validChar) {
                displayString.handleInput(keyPress);
                validChar = false;
            }
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
    var justMathed = false;
    var displayString = { //Object that allows us to modify what is going to be written on the display
        displayValue: "",
        handleInput: function(value) {

            if (isNaN(Number(value)) === false) { //If the value is a number
                if(justMathed){//If we have numbers on the screen and we just did a calculation
                  MathExpression.reset(); //We want to set up a new expression
                  this.displayValue = ""; //Reset the display
                  updateDisplay(); //Draw the display
                  justMathed = false; //And not go through the loop again
                }

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
                if (value == "*" ||
                    value == "/" ||
                    value == "-" ||
                    value == "+") { //Special treatment for operators
                    if (MathExpression.x == 0 &&
                        MathExpression.operand == "" &&
                        MathExpression.y == 0) { //If we have a clean expression

                        MathExpression.x = parseFloat(this.displayValue); //Sets our first varaible
                        MathExpression.operand = value; //Sets our operand
                        this.displayValue = "";
                    } else if (MathExpression.x != 0 && MathExpression.y == 0) { //If we have an x value already

                        MathExpression.x = parseFloat(this.displayValue); //Sets our first varaible
                        MathExpression.operand = value; //Sets our operand
                        this.displayValue = "";

                    } else if (MathExpression.x != 0 && MathExpression.y != 0) { //If we have an x and a y
                        MathExpression.x = parseFloat(this.displayValue);
                        MathExpression.operand = value;
                        MathExpression.y = 0;
                        //MathExpression.x = displayString.displayValue;
                        this.displayValue = "";
                    }

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
                        if (MathExpression.x != 0 && MathExpression.y == 0) { //If we don't have a y value yet
                            MathExpression.y = this.displayValue; //Change our y to what number is on display
                            doMaths(); //Do maths with our Expression
                        } else if (MathExpression.x != 0 && MathExpression.y != 0) { //If we already have x and y values
                            MathExpression.x = this.displayValue; //Set the x to be what is on screen
                            doMaths(); //Do the last type of math operation
                        }

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
            justMathed = true;
            throw "Error"
        } catch (e) {
            this.displayValue = e;
        }
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
