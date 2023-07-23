(function(n) {
    n.fn.crSearch = function(t) {
        const i = n.extend({
            minCharsToShowMenu: 3,
            object: [],
            maxResults: 5,
            placeholderText: "Введите запрос",
            noResultsText: "Нет результатов",
            showImage: true,
            useNaturalLanguage: false,
            onSelect: null
        }, t);
        return this.each(function() {
            function f(n, t, i) {
                const r = new Fuse(t, {
                    keys: ["text"]
                });
                const u = r.search(n);
                const f = u.map(n => n.item);
                return f.slice(0, i);
            }

            function e(n, t, i) {
                return t.filter(function(t) {
                    return t.text.toLowerCase().includes(n.toLowerCase());
                }).slice(0, i);
            }

            const $input = n(this);
            const $suggestionsContainer = n('<div class="suggestions-container"></div>');
            $input.attr("placeholder", i.placeholderText);
            const $clearIcon = n('<i class="clear-icon fas fa-times"></i>');
            $input.after($clearIcon);
            $clearIcon.on("click", function() {
                $input.val("").focus();
                $suggestionsContainer.empty().hide();
                $clearIcon.hide();
            });
            $input.on("input", function() {
                const query = $input.val().trim();
                if ($suggestionsContainer.empty().hide(), $clearIcon.toggle(query.length > 0), query.length >= i.minCharsToShowMenu) {
                    let results;
                    if (i.useNaturalLanguage) {
                        results = f(query, i.object, i.maxResults);
                    } else {
                        results = e(query, i.object, i.maxResults);
                    }
                    $suggestionsContainer.empty(); // Очистка контейнера перед заполнением новыми результатами
                    if (results.length > 0) {
                        n.each(results, function(index, item) {
                            if (index >= i.maxResults) {
                                return false; // Прерываем цикл после достижения максимального количества результатов
                            }
                            const $suggestion = n('<div class="suggestion"></div>');
                            const $suggestionText = n('<div class="suggestion-text">' + item.text + '</div>');
                            $suggestion.append($suggestionText);

                            // Add the image as an <img> tag with the specified properties
                            if (i.showImage && item.imageUrl) {
                                const $image = n('<img class="" alt="" style="border-radius: 0px; --width: 1440px; --height: 1920px; --ratio: 0.75;" data-lazy-image="" data-lazy-image_resize="true" data-lazy-image_detect="css-width">');
                                $image.attr('src', item.imageUrl);
                                $suggestion.append($image);
                            }

                            $suggestion.on("click", function() {
                                $input.val(item.text);
                                $suggestionsContainer.empty().hide();
                                if (typeof i.onSelect === 'function') {
                                    i.onSelect(item); // Вызов метода при выборе пункта
                                }
                            });
                            $suggestionsContainer.append($suggestion);
                        });
                        $suggestionsContainer.insertAfter($input).show();
                    } else {
                        const $noResults = n('<div class="no-results">' + i.noResultsText + '</div>');
                        $suggestionsContainer.append($noResults);
                        $suggestionsContainer.insertAfter($input).show();
                    }
                }

                // Update the value on every input event
                // This will update the value whenever text is typed in the input field
                if (typeof i.onInput === 'function') {
                    i.onInput(query);
                }
            });

            $input.on("keyup", function(e) {

                const query = $input.val().trim();
                if (query.length === 0 && e.keyCode === 8) {
                    $suggestionsContainer.empty().hide();
                    $clearIcon.hide();
                }
            });


            n(document).on("click", function(e) {
                if (!n(e.target).closest(".suggestions-container").length && !n(e.target).is($input)) {
                    $suggestionsContainer.empty().hide();
                    $clearIcon.hide();
                }
            });
        });
    };
})(jQuery);

