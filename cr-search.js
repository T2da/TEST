(function($) {
    $.fn.crSearch = function(options) {
        const defaults = {
            minCharsToShowMenu: 3,
            object: [],
            maxResults: 5,
            placeholderText: "Введите запрос",
            noResultsText: "Нет результатов",
            showImage: true,
            useNaturalLanguage: false,
            linkEnabled: true, // New parameter to control link functionality
            linkColumnIndex: 2, // Assuming the default link column index is 2, change it according to your data
        };

        const settings = $.extend({}, defaults, options);

        return this.each(function() {
            function searchWithNaturalLanguage(query, data, maxResults) {
                const fuse = new Fuse(data, {
                    keys: ["text"]
                });
                const searchResults = fuse.search(query);
                return searchResults.map(result => result.item).slice(0, maxResults);
            }

            function searchWithBasicFilter(query, data, maxResults) {
                return data.filter(function(item) {
                    return item.text.toLowerCase().includes(query.toLowerCase());
                }).slice(0, maxResults);
            }

            const $input = $(this);
            const $suggestionsContainer = $('<div class="suggestions-container"></div>');
            const $clearIcon = $('<i class="clear-icon fas fa-times"></i>');
            $input.attr("placeholder", settings.placeholderText);
            $input.after($clearIcon);

            $clearIcon.on("click", function() {
                $input.val("").focus();
                $suggestionsContainer.empty().hide();
                $clearIcon.hide();
            });

            $input.on("input", function() {
                const query = $input.val().trim();
                $clearIcon.toggle(query.length > 0);

                if (query.length >= settings.minCharsToShowMenu) {
                    const results = settings.useNaturalLanguage
                        ? searchWithNaturalLanguage(query, settings.object, settings.maxResults)
                        : searchWithBasicFilter(query, settings.object, settings.maxResults);

                    $suggestionsContainer.empty();

                    if (results.length > 0) {
                        $.each(results, function(index, item) {
                            if (index >= settings.maxResults) {
                                return false;
                            }
                            const $suggestion = $('<div class="suggestion"></div>');

                            if (settings.showImage && item.imageUrl) {
                                const $image = $('<img data-lazy-image_resize="true" data-lazy-image_detect="css-width">');
                                $image.attr('src', item.imageUrl);
                                $suggestion.append($image);
                            }

                            const $suggestionText = $('<div class="suggestion-text">' + item.text + '</div>');
                            $suggestion.append($suggestionText);

                            $suggestion.on("click", function() {
                                const selectedText = item.text;
                                const columnIndexWithLink = settings.linkColumnIndex;

                                if (settings.linkEnabled && columnIndexWithLink >= 0 && columnIndexWithLink < columns.length) {
                                    const linkValue = data.rows.find(row => row[0] === selectedText)[columnIndexWithLink];
                                    if (linkValue) {
                                        window.location.href = linkValue;
                                    }
                                }

                                if (typeof settings.onSelect === 'function') {
                                    settings.onSelect(item);
                                }
                            });

                            $suggestionsContainer.append($suggestion);
                        });
                        $suggestionsContainer.insertAfter($input).show();
                    } else {
                        const $noResults = $('<div class="no-results">' + settings.noResultsText + '</div>');
                        $suggestionsContainer.append($noResults);
                        $suggestionsContainer.insertAfter($input).show();
                    }
                }

                if (typeof settings.onInput === 'function') {
                    settings.onInput(query);
                }
            });

            $input.on("keyup", function(e) {
                const query = $input.val().trim();
                if (query.length === 0 && e.keyCode === 8) {
                    $suggestionsContainer.empty().hide();
                    $clearIcon.hide();
                }
            });

            $(document).on("click", function(e) {
                if (!$(e.target).closest(".suggestions-container").length && !$(e.target).is($input)) {
                    $suggestionsContainer.empty().hide();
                    $clearIcon.hide();
                }
            });
        });
    };
})(jQuery);
