(function(){
	'use strict';
	angular
	.module('app.caseload',
	    [

		])
	.config(config);


	function config($stateProvider, msApiProvider, msNavigationServiceProvider) {
		$stateProvider.state('app.caseload', {
			url  : '/caseload',
			views: {
				'content@app': {
					templateUrl: 'app/main/apps/caseload/caseload.html',
					controller : 'CaseloadController as vm'
				},
			},
			resolve: {
					Caseload: function(msApi)
					{
						return msApi.resolve('caseload.case@get');
					},
					User: function(msApi)
					{
						return msApi.resolve('caseload.user@get');
					}
				}
		});		

		msApiProvider.register('caseload.case', ['app/data/contacts/contacts.json']);
		msApiProvider.register('caseload.user', ['app/data/contacts/user.json']);

		msNavigationServiceProvider.saveItem('apps.caseload', {
			title : 'My Caseload',
			icon  : 'icon-account-alert',
			state : 'app.caseload',
			weight: 10
		});
	}
})();