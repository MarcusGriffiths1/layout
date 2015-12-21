/*
* Author: Marcus Griffiths
* Layout v 0.1.0
* Make dem images all layout-y
*
* If you've got some things in a nice grid, and they're all the same width
* this will get rid of them pesky spaces between the rows. 
* It'll also animate everything nicely on resize if you tell it to.
*
* You know that licence lets you do whatever you want with it? It's that one.
*
* I'm always learning, please let me know if you have made improvements, 
* changed the design patterns etc, so I can learn and progress.
*/

(function($) {
  
    // No jQuery? Whuuut?
    if (!$) {
        return console.error('Pssssh, try adding jQuery to your document');
    } 
    
    // The plugin
    $.fn.layout = function(options) {
        
        // Pop in the options
        var opts = $.extend({},options);
        
        // Just in case
        var self = this;
        
        // Layout Object
        var Layout = function(container, options) {
            
            // Create variables
            var $items = $(options.itemIdentifier);
            var container = $(container);
            var gridSizer = $(options.gridSizer);
            var containerWidth, itemWidth;
            var rows, itemsPerRow;
            var itemMargin;
            
            function initialise() {   
                // Make sure we have control over item layout
                container.css({
                    'position': 'relative'
                });
                $items.css({
                    'position': 'absolute'
                });
                
                // This runs the rest of the code. Sets up and calculates all.
                setup();
                
                // If the window is resized, recalculate!
                onResizeStop(setup);
            } 
            
            /* 
            * Calculate all variables and layout the items 
            * according to row calculations
            */
            function setup() {
                containerWidth = container.width();
                itemWidth = $items.width();
                itemsPerRow = Math.floor(containerWidth / itemWidth);
                itemMargin = parseInt(gridSizer.css('margin-left').slice(0, -2));
                
                calculateRows();
                layoutRows();
                adjustBoundingHeight();
                
            }
            
            /* 
            * Takes the rows array variable and makes a 
            * multidimensional array of rows depending on 
            * the css set 
            */
            function calculateRows() {
                rows = [];
                var row = [];
                var count = itemsPerRow;
                $items.each(function(index, element) {
                    if (count) {
                        row.push($(element));
                        count--;
                        if (count === 0 || index === $items.length - 1) {
                            rows.push(row);
                            row = [];
                            count = itemsPerRow;
                        }
                    }
                });
            }
            
            /*
            * Uses the calculated rows array to layout each row
            */
            function layoutRows() {
                var count = 0;
                var x, y;
                for (var i = 0; i < rows.length; i++) {
                    layoutRow(rows[i], i);
                }
            }
            
            /*
            * Sets layout for a specific item in a row
            */
            function layoutRow(row, rowNumber) {
                for (var columnNumber = 0; columnNumber < row.length; columnNumber++) {
                    x = columnNumber * itemWidth + columnNumber * itemMargin;
                    if (rowNumber > 0) {
                        y = rowNumber * itemMargin + calculateRowHeights(rowNumber, columnNumber);
                    } else {
                        y = 0;
                    }

                    row[columnNumber].animate({
                        'top': y + 'px',
                        'left': x + 'px'
                    });
                }
            };
            
            /*
            * Positioning settings mean the bounding box does not take on height of its contents
            * Makes sure the items are surrounded by their bounding box
            */ 
            function adjustBoundingHeight() {
                var rowHeights = [];
                
                for (var i = 0; i < itemsPerRow; i++) {
                    rowHeights.push(calculateRowHeights(rows.length, i) + (itemMargin * rows.length));
                }
                
                self.height(Math.max.apply(null, rowHeights) + 'px');
            }
            
            /* 
            * Helper function
            * Takes the row and column number of an item 
            * Returns the height of the entrire row
            */
            function calculateRowHeights(rowNumber, columnNumber) {
                var sum = 0;
                
                for (var i = 0; i < rowNumber; i++) {
                    if (rows[i][columnNumber]) {
                        sum += rows[i][columnNumber].height();
                    }
                }
                
                return sum;
            }
            
            /*
            * Debounce the callback on resize to stop the browser being overloaded
            */
            function onResizeStop(callback) {
                var resizeTimer;
                $(window).resize(function() {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(callback, 200);
                });
            }
            
            return {
                init: initialise
            }
        };
        
        // Initialise and return the object, not sure if it's a good idea to have chaining on it yet so i've not returned 'this'
        return new Layout(self, opts).init();
    };
  
})(jQuery);