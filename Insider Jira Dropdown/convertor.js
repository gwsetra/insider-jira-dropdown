/**
 * {convertor.js} is a javascript pieces which modify specific custom field and apply Select2 library to the custom field.
 * @author Setra Wicana
 */

console.log(12312312313);
var customField = '#customfield_14592';
var clickTarget = customField + '-val.type-select.editable-field.inactive';

var init = function () {
    console.log('asdasdasd')
    //Initialize mutation observer for creating new task and editing new task
    if (window.MutationObserver) {
        listenForTaskCreation();
    }

    //Hide editing custom field on task description (editing can only be done from edit button below the issue title)
    setTimeout(function () {
        $(customField + '-val').removeClass();
        $(customField + '-val > span').hide();
    }, 6500);
};

var listenForTaskCreation = function () {
    // Attach mutation observer to body
    var startMutationObserver = function () {
        var target = document.querySelector('body');
        var config = listenOnlyAttributeChanges();
        var mutationObs = new MutationObserver(callbackAttributeChange);

        mutationObs.observe(target, config);
    }

    var listenOnlyAttributeChanges = function () {
        // listen only to children change.
        return {
            attributes: false,
            childList: true,
            subtree: false
        };
    }

    var callbackAttributeChange = function (mutations, mutationObs) {
        mutations.forEach(function (item, index) {
            var mutationNode = (item.addedNodes || '')[0];
            console.log(mutationNode);

            //Init select2 on create issue and edit issue popup window.
            if (typeof mutationNode !== 'undefined' &&
                typeof (mutationNode || '').getAttribute('id') !== 'undefined' &&
                (((mutationNode || '').getAttribute('id') == 'create-issue-dialog') ||
                    (mutationNode || '').getAttribute('id') == 'edit-issue-dialog')) {
                console.log('found');

                var intervalRuns = 0;
                var popUpWindowInterval = setInterval(function () {
                    if (++intervalRuns * 250 === 30000 || $(mutationNode).is(':visible')) {
                        clearInterval(popUpWindowInterval);

                        initSelect2(customField);

                        // Edit the width of select dropdown.
                        $('.select2.select2-container.select2-container--default').width('350px');

                        // Change z-index of http://prntscr.com/pvgxcx, if not then it will hidden behind popup window.
                        $('.select2.select2-container.select2-container--default').off('click.insMutation').on('click.insMutation', function () {
                            $('.select2-container.select2-container--default.select2-container--open').css('z-index', '99999999');
                        });
                    }
                }, 250);
            }
        })
    }

    startMutationObserver();
};

var initSelect2 = function (element, parentElement) {
    $(element).select2();
};

init();