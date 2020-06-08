import { mount, createLocalVue } from '@vue/test-utils'

import locale from 'element-ui/lib/locale/lang/en'
import Element from 'element-ui'

import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex'

import app from '@/App'
import integrations from '@/views/Integrations'

import awsAccountForm from '@/components/Integrations/AwsAccountForm'

import helpDialog from '@/constants/helpDialog';

import localStoreActions from '@/store/actions'
import localStoreState from '@/store/state'
import localStoreMutations from '@/store/mutations'

import accountsClient from '@/rest/accountsClient'

const localVue = new createLocalVue()

localVue.use(Vuex)
localVue.use(Element, { locale })
localVue.use(Vuetify)
localVue.use(VueRouter)

describe('AwsAccountForm.vue', () => {
  let mutations
  let state
  let store
  let actions
  let integrationsWrapper
  let appWrapper
  let vuetify
  let router

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter();

    state = localStoreState;
    actions = localStoreActions;
    mutations = localStoreMutations;

    store = new Vuex.Store({
      state,
      mutations,
      actions
    })

    integrationsWrapper = mount(integrations, { store, localVue, vuetify, router });
    appWrapper = mount(app, { store, localVue, vuetify, router });

  });

  it('should show the information dialog when the user clicks on the "question" icon', async () => {
    const dialogContentsForIntegratingAwsAccounts = helpDialog.getHelpForIntegratingAwsAccounts();
    const showHelpDialog = integrationsWrapper.find('i.el-icon-question');
    await showHelpDialog.trigger('click');
    expect(appWrapper.vm.helpDialogContent).toBe(dialogContentsForIntegratingAwsAccounts.getContent());
    expect(appWrapper.vm.helpDialogTitle).toBe(dialogContentsForIntegratingAwsAccounts.getTitle());
    expect(appWrapper.vm.showHelpDialog).toBe(true);
  })

  it('should not display the information dialog when the user clicks on the button that says "OK"', async () => {
    const showHelpDialog = integrationsWrapper.find('i.el-icon-question');
    await showHelpDialog.trigger('click');
    const helpDialogOkButton = appWrapper.find('.dialog-footer > button');
    await helpDialogOkButton.trigger('click');
    expect(appWrapper.vm.showHelpDialog).toBe(false);
  })

  it('should create an integration with an AWS account when valid credentials are specified', async () => {
    accountsClient.postAwsAccount = jest.fn();
    const addAwsAccountButton = integrationsWrapper.find('[title="Add an AWS account"]');
    await addAwsAccountButton.trigger('click');
    expect(integrationsWrapper.vm.addAwsAccount).toBe(true);
    integrationsWrapper.find('.el-input > [name="Access Key ID"]').setValue('AKIAIOSFODNN7EXAMPLE');
    integrationsWrapper.find('.el-input > [name="Secret Access Key"]').setValue('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
    integrationsWrapper.find('.el-form-item__content > [name="Integrate AWS account"]').trigger('click');
    expect(accountsClient.postAwsAccount).toHaveBeenCalled();
  })

  it('should not try to create an integration when invalid credentials are specified', async () => {
    accountsClient.postAwsAccount = jest.fn();
    const addAwsAccountButton = integrationsWrapper.find('[title="Add an AWS account"]');
    await addAwsAccountButton.trigger('click');
    expect(integrationsWrapper.vm.addAwsAccount).toBe(true);
    integrationsWrapper.find('.el-input > [name="Access Key ID"]').setValue('');
    integrationsWrapper.find('.el-input > [name="Secret Access Key"]').setValue('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
    integrationsWrapper.find('.el-form-item__content > [name="Integrate AWS account"]').trigger('click');
    expect(accountsClient.postAwsAccount).not.toHaveBeenCalled();
  })
})
