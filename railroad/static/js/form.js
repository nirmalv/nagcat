/*
 * Copyright 2010 ITA Software, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Execute setup code when page loads
$(document).ready(function() {
    /**** GRAPH SETUP ****/

    // Bind the graph time range selection buttons
    $('.options input[type=button]').live('click', function() {
        var dateRangeButton = this;
        var dates = $(dateRangeButton).parent().siblings('.daterange');

        if ($('#sync').prop('checked')) {
            var from = $('input[name=from]');
            var to = $('input[name=to]');
        } else {
            var from = $(dates).children('[name=from]');
            var to = $(dates).children('[name=to]');
        }

        to.datetimepicker('setDate', new Date());
        from.datetimepicker('setDate', new Date());

        var newDate = from.datetimepicker('getDate');
        if ($(dateRangeButton).attr('name') == 'day') {
            newDate.setDate(newDate.getDate()-1);
            from.datetimepicker('setDate', newDate)
        } else if ($(dateRangeButton).attr('name') == 'week') {
            newDate.setDate(newDate.getDate()-7);
            from.datetimepicker('setDate', newDate)
        } else if ($(dateRangeButton).attr('name') == 'month') {
            newDate.setMonth(newDate.getMonth()-1);
            from.datetimepicker('setDate', newDate)
        } else if ($(dateRangeButton).attr('name') == 'year') {
            newDate.setFullYear(newDate.getFullYear()-1);
            from.datetimepicker('setDate', newDate)
        }

        to.datetimepicker('refresh')
        from.datetimepicker('refresh')
        updateZoom(from,to);
    });

    /* Initialize the data for any graphs already on the page. */
    fetchAndDrawGraphDataByDiv();

    /** Debug **/
    $('#debug_check').prop('checked', localStorageGet('debug'));
    updateDebug();

    $('#debug_check').change(function () {
        localStorageSet('debug', $('#debug_check').prop('checked'));
        updateDebug();
    });

    $('#debug a').live('click', function() {
        localStorageClear();
    });

    /*** Preferences persistance ***/
    $('#preference_panel').bind('change', function () {
        saveFormPersistence($('#preference_panel'));
    });
    restoreFormPersistence($('#preference_panel'));

    $('#localtime, #utc').bind('change', function() {
        // Guarantee that localstorage gets the change before redrawing graphs
        $('#configurator').trigger('change');
        graphs = $('.graph');
        graphs.each(function(index, element) {
            if ($(element).data('data')) {
                redrawGraph(element, $(element).data('data'));
            }
        });
    });

    // Start the AJAX graph refreshes
    setTimeout(autoFetchData, 60 * 1000);

    /******* Hint System *******/
    var hint_timeout = null;
    $('.hint').each(function(index, element) {
        var hintText = $(element).text().trim().replace(/  +/, ' ');
        $('<div class="sprite info"></div>').insertBefore(element).attr('title', hintText);
        $(element).remove();
    });
});
