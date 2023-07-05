(function($) {
    $.fn.crSearch = function(options) {
        let settings = $.extend({
            minCharsToShowMenu: 3,
            object: [],
            maxResults: 5,
            placeholderText: "Enter a query",
            noResultsText: "No results",
            showImage: true,
            useNaturalLanguage: false,
            onSelect: null
        }, options);

        return this.each(function() {
            let input = $(this);
            let suggestionsContainer = $('<div class="suggestions-container"></div>');
            input.attr("placeholder", settings.placeholderText);
            let clearIcon = $('<i class="clear-icon fas fa-times"></i>');
            input.after(clearIcon);

            clearIcon.on("click", function() {
                input.val("").focus();
                suggestionsContainer.empty().hide();
                clearIcon.hide();
            });

            input.on("input", function() {
                let query = input.val().trim();
                if (suggestionsContainer.empty().hide(), clearIcon.toggle(query.length > 0), query.length >= settings.minCharsToShowMenu) {
                    let results;
                    if (settings.useNaturalLanguage) {
                        results = fuzzySearch(query, settings.object, settings.maxResults);
                    } else {
                        results = filterResults(query, settings.object, settings.maxResults);
                    }

                    if (results.length > 0) {
                        $.each(results, function(index, result) {
                            let suggestion = $('<div class="suggestion"></div>');
                            if (settings.showImage) {
                                let image = $('<img class="suggestion-image" src="' + result.imageUrl + '">');
                                suggestion.append(image);
                            }
                            let text = $('<div class="suggestion-text">' + result.text + "</div>");
                            suggestion.append(text);

                            suggestion.on("click", function() {
                                input.val(result.text);
                                suggestionsContainer.empty().hide();
                                page.getComponent(el).setValue(123)
                            });

                            suggestionsContainer.append(suggestion);
                        });
                        suggestionsContainer.insertAfter(input).show();
                    } else {
                        let noResults = $('<div class="no-results">' + settings.noResultsText + "</div>");
                        suggestionsContainer.append(noResults);
                        suggestionsContainer.insertAfter(input).show();
                    }
                }
            });

            input.on("keyup", function(event) {
                let query = input.val().trim();
                if (query.length === 0 && event.keyCode === 8) {
                    suggestionsContainer.empty().hide();
                    clearIcon.hide();
                }
            });

            $(document).on("click", function(event) {
                if (!$(event.target).closest(".suggestions-container").length && !$(event.target).is(input)) {
                    suggestionsContainer.empty().hide();
                    clearIcon.hide();
                }
            });
        });
    }

    function fuzzySearch(query, items, maxResults) {
        let fuse = new Fuse(items, {
            keys: ["text"]
        });
        let searchResults = fuse.search(query);
        return searchResults.slice(0, maxResults).map(result => result.item);
    }

    function filterResults(query, items, maxResults) {
        return items.filter(function(item) {
            return item.text.toLowerCase
        }).slice(0, maxResults);
    }
})(jQuery);
