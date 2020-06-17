import { mount, createLocalVue, shallowMount } from '@vue/test-utils';

import locale from 'element-ui/lib/locale/lang/en';
import Element from 'element-ui';

import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import flushPromises from 'flush-promises';

import app from '@/App';
import integrations from '@/views/Integrations';

import awsAccountForm from '@/components/integrations/AwsAccountForm'

import helpDialog from '@/constants/helpDialog';

import localStoreActions from '@/store/actions';
import localStoreState from '@/store/state';
import localStoreMutations from '@/store/mutations';
import integrationsModuleState from '@/store/modules/integrations/state';
import integrationsModuleMutations from '@/store/modules/integrations/mutations';

const currentRouteName = 'integrations';

const localVue = new createLocalVue()

localVue.use(Vuex)
localVue.use(Element, { locale })
localVue.use(Vuetify)
localVue.use(VueRouter)

describe('Integrations.vue', () => {
  let mutations
  let state
  let store
  let actions
  let appWrapper
  let vuetify
  let router
  let computed
  let integrationsModuleActions
  let integrationsWrapper

  beforeEach(() => {
    computed = {
      currentRouteName () {
        return currentRouteName
      }
    };

    vuetify = new Vuetify();
    router = new VueRouter();

    state = localStoreState;
    actions = localStoreActions;
    mutations = localStoreMutations;
    integrationsModuleActions = {
      FETCH_AWS_ACCOUNTS: jest.fn(),
      INTEGRATE_AWS_ACCOUNT: jest.fn()
    };

    store = new Vuex.Store({
      modules: {
        integrations: {
          namespaced: true,
          state: integrationsModuleState,
          mutations: integrationsModuleMutations,
          actions: integrationsModuleActions
        }
      },
      state,
      mutations,
      actions
    })


    integrationsWrapper = mount(integrations, { store, localVue, vuetify, router });
    integrationsWrapper.setData({ routeName: currentRouteName});
    appWrapper = mount(app, { store, localVue, vuetify, router, computed });

  });

  it('should show the information dialog when the user clicks on the "help" icon', async () => {
    const dialogContentsForIntegrationsRouteKey = currentRouteName;
    const dialogContentsForIntegratingAwsAccounts = helpDialog[dialogContentsForIntegrationsRouteKey];
    const showHelpDialog = integrationsWrapper.find('i.el-icon-help');
    await showHelpDialog.trigger('click');
    expect(appWrapper.vm.showHelpDialog).toBe(true);
    expect(appWrapper.vm.helpDialogContent).toBe(dialogContentsForIntegratingAwsAccounts.getContent());
    expect(appWrapper.vm.helpDialogTitle).toBe(dialogContentsForIntegratingAwsAccounts.getTitle());
  })

  it('should not display the information dialog when the user clicks on the button that says "OK"', async () => {
    const showHelpDialog = integrationsWrapper.find('i.el-icon-help');
    await showHelpDialog.trigger('click');
    const helpDialogOkButton = appWrapper.find('.dialog-footer > button');
    await helpDialogOkButton.trigger('click');
    expect(appWrapper.vm.showHelpDialog).toBe(false);
  })


  // vue-test-utils is not able to set the value for the field of the type "number" (el-input-number to be precise). The test does not pass because of this.
  // it('should create an integration with an AWS account when valid credentials are specified', async () => {
  //   const addAwsAccountButton = integrationsWrapper.find('[title="Add an AWS account"]');
  //   await addAwsAccountButton.trigger('click');
  //   expect(integrationsWrapper.vm.addAwsAccount).toBe(true);
  //   integrationsWrapper.find('[name="Access Key ID"]').setValue('AKIAIOSFODNN7EXAMPLE');
  //   integrationsWrapper.find('[name="Secret Access Key"]').setValue('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
  //   integrationsWrapper.find('.el-radio__input > [name="CUR"]').setChecked(true);
  //   integrationsWrapper.find('.el-input-number > .el-input-number__increase').trigger('click');
  //   integrationsWrapper.find('.el-form-item__content > [name="Integrate AWS account"]').trigger('click');
  //   await flushPromises();
  //   expect(integrationsWrapper.vm.addAwsAccount).toBe(false);
  //   expect(integrationsModuleActions.INTEGRATE_AWS_ACCOUNT).toHaveBeenCalled();
  // })

  it('should not try to create an integration when invalid credentials are specified', async () => {
    const addAwsAccountButton = integrationsWrapper.find('[title="Add an AWS account"]');
    await addAwsAccountButton.trigger('click');
    expect(integrationsWrapper.vm.addAwsAccount).toBe(true);
    integrationsWrapper.find('[name="Access Key ID"]').setValue('');
    integrationsWrapper.find('[name="Secret Access Key"]').setValue('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
    integrationsWrapper.find('[name="Integrate AWS account"]').trigger('click');
    expect(integrationsWrapper.vm.addAwsAccount).toBe(true);
  })
})
