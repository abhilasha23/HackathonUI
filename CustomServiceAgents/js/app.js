/**
 * Created by abhilashakanitkar on 31/05/16.
 */
/**
 * The main topicmodel app module
 *
 * @type {angular.Module}
 */
angular.module('customagents', ['ngRoute','ui.bootstrap','ng.httpLoader'])
    .config(function ($routeProvider) {
        'use strict';

        var routeConfig = {
            controller: 'CustomAgentsCtrl',
            templateUrl: 'customagents-index.html'
        };


        $routeProvider
            .when('/', routeConfig)
            .when('/:status', routeConfig)

            .otherwise({
                redirectTo: '/'
            });

    })
;
