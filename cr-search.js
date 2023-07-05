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

            function e(n, t) {
                return t.filter(function(t) {
                    return t.text.toLowerCase().includes(n.toLowerCase())
                });
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
                    if (i.useNaturalLanguage || !i.useNaturalLanguage) {
                        results = f(query, i.object, i.maxResults);
                    } else {
                        results = e(query, i.object, i.maxResults);
                    }
                    if (results.length > 0) {
                        n.each(results, function(index, item) {
                            const $suggestion = n('<div class="suggestion"></div>');
                            if (i.showImage) {
                                const $image = n('<img class="suggestion-image" src="' + item.imageUrl + '">');
                                $suggestion.append($image);
                            }
                            const $text = n('<div class="suggestion-text">' + item.text + '</div>');
                            $suggestion.append($text);
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
