/**
 * Created by abhilashakanitkar on 31/05/16.
 */
/*global angular */

/**
 * The main controller for the app. The controller:

 * - exposes the model to the template and provides event handlers
 */


angular.module('customagents')
    .controller('CustomAgentsCtrl', function CustomAgentsCtrl($scope, $routeParams,$http, $filter,$q,$sce,$timeout) {
        // 'use strict';

        $scope.searchKeyword = '';
        $scope.firstTimeFlag = true;
        $scope.showMoreWords = false;
        $scope.finalResultsFlag = false;
        $scope.initialResultforSendingSEL =[];
        $scope.initialResultforSendingDSEL =[];
        $scope.moreWordsLoadingFlag = false;
        $scope.interResultsLoadingFlag = false;

        $scope.init = function(){
            console.log("inside Custom Agents INIT");

            $http.get('/api/customagents/loadtypeaheaddata')
                .then(function(res){

                    console.log("sample typeahead received");

                    var x = res.data["response"]["docs"];
                    //console.log(x[0].words);

                    $scope.keywordsfortypeahead = x[0].words;
                    console.log($scope.keywordsfortypeahead);

                });

        };

        $scope.startNewSearch = function(){

            $scope.firstTimeFlag = true;
            $scope.searchKeyword = '';
            $scope.expandedWords = [];
            $scope.expandedWordsToSendSEL=[];
            $scope.expandedWordsToSendDSEL = [];
            $scope.showMoreWords = false;

            $scope.initialResult = [];
            $scope.initialResultforSendingSEL = [];
            $scope.initialResultforSendingDSEL = [];

            $scope.finalResult = [];
            $scope.finalResultsFlag = false;

        };


        $scope.onSelect = function($item, $model, $label){

            console.log($item);
            console.log($model);
            console.log($label);

        };

        $scope.onChange = function(id){
            $scope.searchKeyword = id;
        };

        $scope.toggleSelection = function($event,val){

            console.log("toggleSelection - "+val);
            var index = $scope.expandedWordsToSendSEL.indexOf(val);
            var target = $(event.target);
            if(target.hasClass('isSelected')){
                target.removeClass('isSelected');
                if(index==-1)
                    $scope.expandedWordsToSendSEL.add(val);

                if($scope.expandedWordsToSendDSEL.indexOf(val)!=-1)
                    $scope.expandedWordsToSendDSEL.remove(val);

            }
            else {
                target.addClass('isSelected');
                if(index!=-1)
                    $scope.expandedWordsToSendSEL.remove(val);

                if($scope.expandedWordsToSendDSEL.indexOf(val)==-1)
                    $scope.expandedWordsToSendDSEL.add(val);

            }


            //console.log($scope.expandedWordsToSendSEL);
            //console.log($scope.expandedWordsToSendDSEL);
        };

        $scope.getMoreWords = function(){
            console.log("inside getMoreWords - " + $scope.searchKeyword);
            $scope.moreWordsLoadingFlag = true;

            $scope.showMoreWords = true;
            $scope.moreWordsLoadingFlag = true;
            $scope.expandedWords = [];
            $scope.expandedWordsToSendSEL=[];
            $scope.expandedWordsToSendDSEL = [];

            $http.get('/api/customagents/getWordsPlus/['+$scope.searchKeyword+']')
                .then(function(res){

                    console.log("sample results received");
                    $scope.expandedWords = (res.data).split(",");


                    //add original words to the expanded words list too.
                    var x = $scope.searchKeyword.split(",");

                    for(var i=0;i<x.length;i++){
                        $scope.expandedWords.add(x[i]);
                    }

                    $scope.expandedWordsToSendSEL = $scope.expandedWords.slice();
                    $scope.expandedWordsToSendDSEL = [];
                    $scope.moreWordsLoadingFlag = false;
                });

        };

        $scope.getInitialResult = function(){
            console.log("inside getInitialResult - " + $scope.searchKeyword);
            $scope.firstTimeFlag = false;
            $scope.interResultsLoadingFlag = true;

            $http.get('/api/customagents/getInsights/['+$scope.expandedWordsToSendSEL.toString()+']/['+$scope.expandedWordsToSendDSEL.toString()+']')
                .then(function(res){

                    console.log("got custom agent response");
                    //console.log(res.data);

                    $scope.initialResult = JSON.parse(res.data);
                    console.log($scope.initialResult);
                    for(var k=0;k<$scope.initialResult.length;k++){
                        $scope.initialResultforSendingSEL.push($scope.initialResult[k].article_id);
                    }
                    $scope.initialResultforSendingDSEL = [];

                    $scope.interResultsLoadingFlag = false;

                    // $scope.initialArticleIds = '['+(res.data).toString()+']';
                    //
                    // console.log($scope.initialArticleIds);
                    //
                    // $http.get('/api/customagents/getArticleData/'+$scope.initialArticleIds)
                    //     .then(function(res){
                    //         console.log("Insights received");
                    //         console.log(res);
                    //
                    //         $scope.initialResult = res.data["response"]["docs"];
                    //         console.log($scope.initialResult);
                    //
                    //         //$scope.initialResultforSendingSEL = $scope.initialResult.slice();
                    //         for(var k=0;k<$scope.initialResult.length;k++){
                    //             $scope.initialResultforSendingSEL.push($scope.initialResult[k].article_id);
                    //         }
                    //         $scope.initialResultforSendingDSEL = [];
                    //         $scope.interResultsLoadingFlag = false;
                    //
                    //     });
                    //

                });



        };

        $scope.updateResultToSend = function(data){


            var index = $scope.initialResultforSendingSEL.indexOf(data);

            console.log(index);
            if(index!=-1){
                $scope.initialResultforSendingSEL.remove(data);
                if($scope.initialResultforSendingDSEL.indexOf(data)==-1)
                    $scope.initialResultforSendingDSEL.add(data);

            }
            else{
                $scope.initialResultforSendingSEL.add(data);
                if($scope.initialResultforSendingDSEL.indexOf(data)!=-1)
                    $scope.initialResultforSendingDSEL.remove(data);
            }

            //console.log($scope.initialResultforSendingSEL);
            //console.log($scope.initialResultforSendingDSEL);
        };


        $scope.getResults = function(){

            var messagesel = '['+$scope.initialResultforSendingSEL.toString()+']';
            var messagedsel = '['+$scope.initialResultforSendingDSEL.toString()+']';


            $scope.finalResultsLoadingFlag = true;
            $http.get('/api/customagents/getFinalResultSet/'+messagesel+'/'+messagedsel+'/['+$scope.expandedWordsToSendSEL.toString()+']/['+$scope.expandedWordsToSendDSEL.toString()+']')
                .then(function(r){
                    console.log("got result getFinalResultSet ");
                    //console.log(r);

                    //$scope.resultsetaids =  '['+(r.data).toString()+']';
                    //console.log(r.data);
                    $scope.finalResult = JSON.parse(r.data);
                    // $http.get('/api/customagents/getArticleData/'+$scope.resultsetaids)
                    //     .then(function(res){
                    //         console.log("final results received");
                    //         //console.log(res);
                    //
                    //         $scope.finalResult = res.data["response"]["docs"];
                    //         console.log($scope.finalResult);
                    //
                    //     });


                    $scope.finalResultsLoadingFlag = false;
                });

            $scope.finalResultsFlag = true;

        };
        $scope.goBack = function(){
            $scope.finalResultsFlag = false;
            $scope.finalResult = [];
        };



        Array.prototype.add = function(value){
            if (this.indexOf(value)==-1){
                this.push(value);
                return true;
            }
            else return false;
        };

        Array.prototype.remove = function(value) {
            if (this.indexOf(value)!==-1) {
                this.splice(this.indexOf(value), 1);
                return true;
            } else {
                return false;
            }
        };

        $scope.wordSelected = function(val){

            return $scope.expandedWordsToSendDSEL.indexOf(val)!=-1;
        };


    })


;


