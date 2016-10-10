'use strict';

var Hogan = require('hogan.js');
var algoliasearch = require('algoliasearch');
var algoliasearchHelper = require('algoliasearch-helper');
var noUiSlider = require('./nouislider');
// var client = algoliasearch('7FI9T0IXZ5', 'b998ea87dc6edcbdf733d2796f8eccf7');
// var index = client.initIndex('mozu_apps');


exports.config = {};

exports.init = function() {
    $(document).ready(function() {

        /********************
         * INITIALIZATION
         * *******************/

        // REPLACE WITH YOUR OWN VALUES
        var APPLICATION_ID = exports.config.APPLICATION_ID;
        var SEARCH_ONLY_API_KEY = exports.config.SEARCH_ONLY_API_KEY;
        var INDEX_NAME = exports.config.INDEX_NAME;
        //var HITS_PER_PAGE = exports.config.HITS_PER_PAGE;
        var HITS_PER_PAGE = 100;
        var FACET_CONFIG = exports.config.FACET_CONFIG;
        var MAX_VALUES_PER_FACET = exports.config.MAX_VALUES_PER_FACET;
        // END REPLACE

        // DOM binding
        var $inputField = $('#q');
        var $hits = $('#hits');
        var $stats = $('#stats');
        var $facets = $('#facets');
        var $pagination = $('#pagination');

        // Templates binding
        var hitTemplate = Hogan.compile($('#hit-template').text());
        var statsTemplate = Hogan.compile($('#stats-template').text());
        var facetTemplate = Hogan.compile($('#facet-template').text());
        var sliderTemplate = Hogan.compile($('#slider-template').text());
        var paginationTemplate = Hogan.compile($('#pagination-template').text());

        // Client initialization
        var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);

        // Helper initialization
        var params = {
            hitsPerPage: HITS_PER_PAGE,
            maxValuesPerFacet: MAX_VALUES_PER_FACET,
            facets: $.map(FACET_CONFIG, function(facet) {
                return !facet.disjunctive ? facet.name : null;
            }),
            disjunctiveFacets: $.map(FACET_CONFIG, function(facet) {
                return facet.disjunctive ? facet.name : null;
            })
        };
        var helper = algoliasearchHelper(algolia, INDEX_NAME, params);

        // Input binding

        //////////////////////////////////////////////////////
        // USING THIS:
        // this is the only way to do it and detect javascript changes to the input box
        // which is nice for when developing with Browsersync cross devices
        // per: http://stackoverflow.com/questions/1948332/detect-all-changes-to-a-input-type-text-immediately-using-jquery?rq=1
        var previousInputFieldValue = '';
        setInterval(function() {
            observeInputValue($('#q').val());
        }, 100);

        function observeInputValue(val) {
            if (previousInputFieldValue !== val) {
                previousInputFieldValue = val;
                toggleIconEmptyInput(!val.trim());
                helper.setQuery(val).search();
            }
        }
        //////////////////////////////////////////////////////
        // INSTEAD OF THIS:

        // $inputField
        //   .bind('keyup', function() {
        //     console.log('test');
        //     var query = $inputField.val();
        //     toggleIconEmptyInput(!query.trim());
        //     helper.setQuery(query).search();
        //   })
        //   .focus();
        //////////////////////////////////////////////////////

        helper.on('change', setURLParams);
        helper.on('error', function(error) {
            //console.log(error);
        });
        helper.on('result', function(content, state) {
            renderStats(content);
            renderHits(content);
            renderFacets(content, state);
            addRefinedMarkers();
            renderPagination(content);
            bindSearchObjects();
            triggerResultEvent();
        });


        /************
         * SEARCH
         * ***********/

        // Initial search
        initWithUrlParams();
        helper.search();

        function renderStats(content) {
            var stats = {
                nbHits: numberWithDelimiter(content.nbHits),
                processingTimeMS: content.processingTimeMS,
                nbHits_plural: content.nbHits !== 1
            };
            $stats.html(statsTemplate.render(stats));
        }

        function renderHits(content) {
            var hitsHtml = '';
            for (var i = 0; i < content.hits.length; ++i) {
                hitsHtml += hitTemplate.render(content.hits[i]);
            }
            if (content.hits.length === 0) {
              hitsHtml = '<p id="no-hits">We didn\'t find any products for your search.<br>Try broadening your search.</p>';
            }
            $hits.html(hitsHtml);
        }

        function renderFacets(content, state) {

            // If no results
            if (content.hits.length === 0) {
                $facets.empty();
                return;
            }

            // Process facets
            var facets = [];
            for (var facetIndex = 0; facetIndex < FACET_CONFIG.length; ++facetIndex) {
                var facetParams = FACET_CONFIG[facetIndex];
                var facetResult = content.getFacetByName(facetParams.name);
                if (facetResult) {
                    var facetContent = {};
                    facetContent.facet = facetParams.name;
                    facetContent.title = facetParams.title;
                    facetContent.type = facetParams.type;

                    if (facetParams.type === 'slider') {
                        // if the facet is a slider
                        facetContent.min = facetResult.stats.min;
                        facetContent.max = facetResult.stats.max;
                        var valueMin = state.getNumericRefinement(facetParams.name, '>=') || facetResult.stats.min;
                        var valueMax = state.getNumericRefinement(facetParams.name, '<=') || facetResult.stats.max;
                        valueMin = Math.min(facetContent.max, Math.max(facetContent.min, valueMin));
                        valueMax = Math.min(facetContent.max, Math.max(facetContent.min, valueMax));
                        facetContent.values = [valueMin, valueMax];
                    } else {
                        // format and sort the facet values
                        var values = [];
                        for (var v in facetResult.data) {
                            values.push({
                                label: v,
                                value: v,
                                id: getUniqueId(),
                                count: facetResult.data[v],
                                refined: helper.isRefined(facetParams.name, v)
                            });
                        }
                        var sortFunction = facetParams.sortFunction || sortByName;
                        if (facetParams.topListIfRefined) {
                          sortFunction = sortByRefined(sortFunction);
                        }
                        values.sort(sortFunction);

                        facetContent.values = values.slice(0, 25);
                        facetContent.has_other_values = values.length > 25;
                        facetContent.other_values = values.slice(25);
                        facetContent.disjunctive = facetParams.disjunctive;
                    }
                    facets.push(facetContent);
                }
            }
            // Display facets
            var facetsHtml = '';
            for (var indexFacet = 0; indexFacet < facets.length; ++indexFacet) {
                var facet = facets[indexFacet];
                if (facet.type && facet.type === 'slider') {
                  facetsHtml += sliderTemplate.render(facet);
                }
                else {
                  facetsHtml += facetTemplate.render(facet);
                }
            }
            $facets.html(facetsHtml);
        }

        function addRefinedMarkers() {
            // Get array of checked lis
            var refinedFacets = $('li.refined');
            // Add .is-refined to trigger button
            if (refinedFacets.length) {
                if (!($('.filter-trigger').hasClass('is-refined'))) {
                    $('.filter-trigger').addClass('is-refined');
                }
            } else {
                if (($('.filter-trigger').hasClass('is-refined'))) {
                    $('.filter-trigger').removeClass('is-refined');
                }
            }
            //Add .is-refined class to facet titles
            for (var i = 0; i < refinedFacets.length; i++) {
                var currFacet = refinedFacets[i];
                var currTitle = $(currFacet).closest('.facet').find('.page-header');
                currTitle.addClass('is-refined');
            }
        }

        function renderPagination(content) {
            // If no results
            if (content.hits.length === 0) {
                $pagination.empty();
                return;
            }

            // Process pagination
            var pages = [];
            if (content.page > 5) {
                pages.push({
                    current: false,
                    number: 1
                });
                pages.push({
                    current: false,
                    number: '...',
                    disabled: true
                });
            }
            for (var p = content.page - 5; p < content.page + 5; ++p) {
                if (p < 0 || p >= content.nbPages) {
                    continue;
                }
                pages.push({
                    current: content.page === p,
                    number: p + 1
                });
            }
            if (content.page + 5 < content.nbPages) {
                pages.push({
                    current: false,
                    number: '...',
                    disabled: true
                });
                pages.push({
                    current: false,
                    number: content.nbPages
                });
            }
            var pagination = {
                pages: pages,
                prev_page: content.page > 0 ? content.page : false,
                next_page: content.page + 1 < content.nbPages ? content.page + 2 : false
            };
            // Display pagination
            $pagination.html(paginationTemplate.render(pagination));
        }

        // Event bindings
        function bindSearchObjects() {
            // Slider binding
            var slider = $('#customerReviewCount-slider');
            if (!slider.length) {
              return;
            }

            //create an instance of the noUiSlider
            createNoUiSlider(slider[0], slider.data('min'), slider.data('max'), slider.data('values'));

            ///////////////////////////////////////////////////////
            // ADD TOOLTIP FEATURE TO NOUISLIDER
            // PER: http://refreshless.com/nouislider/examples/#section-tooltips
            var tipHandles = slider[0].getElementsByClassName('noUi-handle'),
                tooltips = [];
            // Add divs to the slider handles.
            for (var i = 0; i < tipHandles.length; i++) {
                tooltips[i] = document.createElement('div');
                tipHandles[i].appendChild(tooltips[i]);
                // Add a class for styling
                tooltips[i].className += 'tooltip';
                // Add additional markup
                tooltips[i].innerHTML = '<span></span>'; //NOTE: You can put a currency symbol or other text before the <span>
                // Replace the tooltip reference with the span we just added
                tooltips[i] = tooltips[i].getElementsByTagName('span')[0];
            }
            // When the slider changes, write the value to the tooltips.
            slider[0].noUiSlider.on('update', function(values, handle) {
                tooltips[handle].innerHTML = values[handle].toString().replace('.00', '');
            });
            ///////////////////////////////////////////////////////

            //watch for changes to it
            slider[0].noUiSlider.on('change', function(ev) {
                helper.addNumericRefinement('customerReviewCount', '>=', ev[0]).search();
                helper.addNumericRefinement('customerReviewCount', '<=', ev[1]).search();
            });
        }

        //bind to any element with a class of noUiSlider
        function createNoUiSlider(elem, min, max, values) {
            var vals = values.split(',');
            noUiSlider.create(elem, {
                start: [vals[0], vals[1]],
                step: 1,
                connect: true,
                range: {
                    'min': min,
                    'max': max
                }
            });
        }

        function triggerResultEvent(){
            $(window).trigger( 'resultsLoaded');
        }

        // Click binding
        $(document).on('click', '.show-more, .show-less', function(e) {
            e.preventDefault();
            $(this).closest('ul').find('.show-more').toggle();
            $(this).closest('ul').find('.show-less').toggle();
            return false;
        });
        $(document).on('click', '.toggleRefine', function() {
            helper.toggleRefine($(this).data('facet'), $(this).data('value')).search();
            return false;
        });
        $(document).on('click', '.gotoPage', function() {
            helper.setCurrentPage(+$(this).data('page') - 1).search();
            $('html, body').animate({
                scrollTop: 0
            }, '500', 'swing');
            return false;
        });
        $(document).on('click', '.sortBy', function() {
            $(this).closest('#sort-by').find('.js-sorting-by').text($(this).text());
            helper.setIndex(INDEX_NAME + $(this).data('index-suffix')).search();
        });
        $(document).on('click', '#input-search', function() {
            $inputField.val('').keyup();
        });

        // Dynamic styles
        $('#facets').on('mouseenter mouseleave', '.button-checkbox', function() {
            $(this).parent().find('.facet_link').toggleClass('hover');
        });
        $('#facets').on('mouseenter mouseleave', '.facet_link', function() {
            $(this).parent().find('.button-checkbox button.btn').toggleClass('hover');
        });


        /************
         * HELPERS
         * ***********/

        function toggleIconEmptyInput(isEmpty) {
            if (isEmpty) {
                $('#input-search')
                    .addClass('glyphicon-search')
                    .removeClass('glyphicon-remove');
            } else {
                $('#input-search')
                    .removeClass('glyphicon-search')
                    .addClass('glyphicon-remove');
            }
        }

        function numberWithDelimiter(number, delimiter) {
            number = number + '';
            delimiter = delimiter || ',';
            var split = number.split('.');
            split[0] = split[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delimiter);
            return split.join('.');
        }

        function sortByName(a, b) {
            return a.value.localeCompare(b.value);
        }
        exports.sortByName = sortByName; //also export it

        function sortByCountDesc(a, b) {
            return b.count - a.count;
        }
        exports.sortByCountDesc = sortByCountDesc; //also export it

        function sortByRefined(sortFunction) {
            return function(a, b) {
                if (a.refined !== b.refined) {
                    if (a.refined) {
                      return -1;
                    }
                    if (b.refined) {
                      return 1;
                    }
                }
                return sortFunction(a, b);
            };
        }

        function initWithUrlParams() {
            var sPageURL = location.hash;
            if (!sPageURL || sPageURL.length === 0) {
                return true;
            }
            var sURLVariables = sPageURL.split('&');
            if (!sURLVariables || sURLVariables.length === 0) {
                return true;
            }
            var query = decodeURIComponent(sURLVariables[0].split('=')[1]);
            $inputField.val(query);
            helper.setQuery(query);
            for (var i = 2; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                var facet = decodeURIComponent(sParameterName[0]);
                var value = decodeURIComponent(sParameterName[1]);
                helper.toggleRefine(facet, value, false);
            }
            // Page has to be set in the end to avoid being overwritten
            var page = decodeURIComponent(sURLVariables[1].split('=')[1]) - 1;
            helper.setCurrentPage(page);
        }

        function setURLParams(state) {
            var urlParams = '#';
            var currentQuery = state.query;
            urlParams += 'q=' + encodeURIComponent(currentQuery);
            var currentPage = state.page + 1;
            urlParams += '&page=' + currentPage;
            for (var facetRefine in state.facetsRefinements) {
                urlParams += '&' + encodeURIComponent(facetRefine) + '=' + encodeURIComponent(state.facetsRefinements[facetRefine]);
            }
            for (var disjunctiveFacetrefine in state.disjunctiveFacetsRefinements) {
                for (var value in state.disjunctiveFacetsRefinements[disjunctiveFacetrefine]) {
                    urlParams += '&' + encodeURIComponent(disjunctiveFacetrefine) + '=' + encodeURIComponent(state.disjunctiveFacetsRefinements[disjunctiveFacetrefine][value]);
                }
            }
            location.replace(urlParams);
        }

        var uniqueId = 0;

        function getUniqueId() {
            return 'uniqueId_' + (++uniqueId);
        }
    });
}
