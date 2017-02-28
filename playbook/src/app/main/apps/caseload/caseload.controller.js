(function() {
    'use strict';

    angular
        .module('app.caseload')
        .controller('CaseloadController', CaseloadController)

    function CaseloadController(Caseload, User, msUtils, $scope, $mdSidenav, $mdDialog, $document) {
        var vm = this;
        vm.caseload = Caseload.data;
        vm.user = User.data
        vm.filterIds = null;
        vm.listType = 'all';
        vm.listOrder = 'name';
        vm.listOrderAsc = false;
        vm.selectedResidents = [];
        vm.newGroupName = '';

        //some hood ass instance methods for yall
        vm.filterChange = filterChange;
        vm.openContactDialog = openContactDialog;
        vm.deleteContactConfirm = deleteContactConfirm;
        vm.deleteContact = deleteContact;
        vm.deleteSelectedContacts = deleteSelectedContacts;
        vm.toggleSelectContact = toggleSelectContact;
        vm.deselectContacts = deselectContacts;
        vm.selectAllContacts = selectAllContacts;
        vm.deleteContact = deleteContact;
        vm.addNewGroup = addNewGroup;
        vm.deleteGroup = deleteGroup;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        function filterChange(type) {

            vm.listType = type;

            if (type === 'all') {
                vm.filterIds = null;
            } else if (type === 'frequent') {
                vm.filterIds = vm.user.frequentContacts;
            } else if (type === 'starred') {
                vm.filterIds = vm.user.starred;
            } else if (angular.isObject(type)) {
                vm.filterIds = type.contactIds;
            }

            vm.selectedResidents = [];

        }

        function openContactDialog(ev, contact) {
            $mdDialog.show({
                controller: 'ContactDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/apps/contacts/dialogs/contact/contact-dialog.html',
                parent: angular.element($document.find('#content-container')),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Contact: contact,
                    User: vm.user,
                    Contacts: vm.caseload
                }
            });
        }

        function deleteContactConfirm(contact, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the contact?')
                .htmlContent('<b>' + contact.name + ' ' + contact.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete contact')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function() {
                deleteContact(contact);
                vm.selectedResidents = [];

            }, function() {

            });
        }

        function deleteContact(contact) {
            vm.caseload.splice(vm.caseload.indexOf(contact), 1);
        }


        function deleteSelectedContacts(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the selected contacts?')
                .htmlContent('<b>' + vm.selectedResidents.length + ' selected</b>' + ' will be deleted.')
                .ariaLabel('delete contacts')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function() {

                vm.selectedResidents.forEach(function(contact) {
                    deleteContact(contact);
                });

                vm.selectedResidents = [];

            });

        }

        function toggleSelectContact(contact, event) {
            if (event) {
                event.stopPropagation();
            }

            if (vm.selectedResidents.indexOf(contact) > -1) {
                vm.selectedResidents.splice(vm.selectedResidents.indexOf(contact), 1);
            } else {
                vm.selectedResidents.push(contact);
            }
        }

        function deselectContacts() {
            vm.selectedResidents = [];
        }

        function selectAllContacts() {
            vm.selectedResidents = $scope.filteredContacts;
        }


        function addNewGroup() {
            if (vm.newGroupName === '') {
                return;
            }

            var newGroup = {
                'id': msUtils.guidGenerator(),
                'name': vm.newGroupName,
                'contactIds': []
            };

            vm.user.groups.push(newGroup);
            vm.newGroupName = '';
        }

        function deleteGroup(ev) {
            var group = vm.listType;

            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the group?')
                .htmlContent('<b>' + group.name + '</b>' + ' will be deleted.')
                .ariaLabel('delete group')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function() {

                vm.user.groups.splice(vm.user.groups.indexOf(group), 1);

                filterChange('all');
            });

        }

        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

    }
})();
