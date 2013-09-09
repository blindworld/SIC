/*
 Text area that highlights a single row in the background.
 */
angular.module('sic.directives', []).directive('highlightableTextarea', function($sce)
{
    return {
        restrict: 'E',
        scope: {
            text: '=',
            highlightIndex: '=',
            selected: '='
        },
        transclude: false,
        replace: true,
        template: '<div class="highlightable-textarea">' +
            '<pre class="text-behind" ng-bind-html="highlightedText"></pre>' +
            '<textarea ng-model="text" ng-trim="false"></textarea>' +
            '</div>',
        link: function(scope, element) {

            scope.$watch('highlightIndex', function() {
                var highlight = highlightRow(scope.text, scope.highlightIndex);

                scope.highlightedText = highlight.text;
                scope.selected = highlight.line;
                if (highlight.index == 0) {
                    scope.highlightIndex = 0;
                }
            });

            scope.$watch('text', function() {
                var highlight = highlightRow(scope.text, scope.highlightIndex);

                scope.highlightedText = highlight.text;
                scope.selected = highlight.line;
            });

            element.find('textarea').on('scroll', function() {
                var pre = element.find('pre').css('top', '-' + this.scrollTop + 'px');
            });

            /*
             { private }
             highlights a row behind the text area.
             */
            var highlightRow = function (textBlob, index) {
                if (!textBlob)
                    textBlob = '';

                var lines = textBlob.split('\n');

                if (index >= lines.length) {
                    index = 0;
                }

                var line = lines[index];
                lines[index] = '<span class="highlight">' + lines[index] + '</span>';

                return { text: $sce.trustAsHtml(lines.join('\n')), index: index, line: line };
            };
        }
    }
});
