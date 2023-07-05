(function($) {
    $.fn.crSearch = function(options) {
        const settings = $.extend({
                minCharsToShowMenu: 3,
                object: [],
                maxResults: 5, // Максимальное количество результатов
                placeholderText: 'Введите запрос',
                noResultsText: 'Нет результатов',
                showImage: true,
                useNaturalLanguage: false // Флаг использования естественной обработки языка
            },
            options
        );

        return this.each(function() {
            const searchInput = $(this);
            const suggestionsContainer = $('<div class="suggestions-container"></div>');

            searchInput.attr('placeholder', settings.placeholderText);

            const clearIcon = $('<i class="clear-icon fas fa-times"></i>');
            searchInput.after(clearIcon);

            clearIcon.on('click', function() {
                searchInput.val('').focus();
                suggestionsContainer.empty().hide();
                clearIcon.hide();
            });

            searchInput.on('input', function() {
                const query = $(this).val().trim();

                suggestionsContainer.empty().hide();
                clearIcon.toggle(query.length > 0);

                if (query.length >= settings.minCharsToShowMenu) {
                    let suggestions;
                    if (settings.useNaturalLanguage) {
                        suggestions = getMatchingSuggestionsNL(query, settings.object, settings.maxResults); // Использование естественной обработки языка
                    } else {
                        suggestions = getMatchingSuggestionsJS(query, settings.object, settings.maxResults); // Использование обработки через JavaScript
                    }

                    if (suggestions.length > 0) {
                        $.each(suggestions, function(index, suggestion) {
                            const suggestionElement = $('<div class="suggestion"></div>');

                            if (settings.showImage) {
                                const imageElement = $('<img class="suggestion-image" src="' + suggestion.imageUrl + '">');
                                suggestionElement.append(imageElement);
                            }

                            const textElement = $('<div class="suggestion-text">' + suggestion.text + '</div>');
                            suggestionElement.append(textElement);

                            suggestionElement.on('click', function() {
                                searchInput.val(suggestion.text);
                                suggestionsContainer.empty().hide();
                            });

                            suggestionsContainer.append(suggestionElement);
                        });

                        suggestionsContainer.insertAfter(searchInput).show();
                    } else {
                        const noResultsElement = $('<div class="no-results">' + settings.noResultsText + '</div>');
                        suggestionsContainer.append(noResultsElement);

                        suggestionsContainer.insertAfter(searchInput).show();
                    }
                }
            });

            searchInput.on('keyup', function(e) {
                const query = $(this).val().trim();

                if (query.length === 0 && e.keyCode === 8) {
                    suggestionsContainer.empty().hide();
                    clearIcon.hide();
                }
            });

            function getMatchingSuggestionsNL(query, object, maxResults) {

                const fuse = new Fuse(object, {
                    keys: ['text']
                });

                const results = fuse.search(query);
                const limitedResults = results.slice(0, maxResults); // Ограничение количества результатов
                return limitedResults.map(result => result.item);
            }

            function getMatchingSuggestionsJS(query, object, maxResults) {
                return object.filter(function(suggestion) {
                    return suggestion.text.toLowerCase().includes(query.toLowerCase());
                });
            }

            $(document).on('click', function(e) {
                if (!$(e.target).closest('.suggestions-container').length && !$(e.target).is(searchInput)) {
                    suggestionsContainer.empty().hide();
                    clearIcon.hide();
                }
            });
        });
    };
})(jQuery);

$(document).ready(function() {
    var columns = data.columns.map((col) => {
        return col.name;
    });
    var rows = data.rows.map((row) => {
        return Object.values(row);
    });
    var arr = [];
    for (var i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
    }

    var object = arr.map(function(row) {
        return {
            text: row[0],
            imageUrl: row[1]
        };
    });

    $(el).closest('.cr-form').css('z-index', 799);
    $(el).find('input').searchWithSuggestions({
        object: object,
        minCharsToShowMenu: 1,
        maxResults: 5,
        placeholderText: 'Введите запрос',
        noResultsText: 'Нет результатов',
        showImage: true,
        useNaturalLanguage: true
    });
});
