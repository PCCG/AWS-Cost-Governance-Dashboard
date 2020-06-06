import { mount, createLocalVue  } from '@vue/test-utils'
import Element from 'element-ui'
import accounts from '@/views/Accounts'
import Vuex from 'vuex'
import app from '@/App'
import helpDialog from '@/constants/helpDialog';
import locale from 'element-ui/lib/locale/lang/en'
import localStoreActions from '@/store/actions'
import localStoreState from '@/store/state'
import localStoreMutations from '@/store/mutations'
import accountsClient from '@/rest/accountsClient'
import Vuetify from 'vuetify';
import VueRouter from 'vue-router'

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
  let accountsWrapper
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

    accountsWrapper = mount(accounts, { store, localVue, vuetify, router });
    appWrapper = mount(app, { store, localVue, vuetify, router });

  });

  it('should show the information dialog when the user clicks on the "question" icon', () => {
    const dialogContentsForIntegratingAwsAccounts = helpDialog.getHelpForIntegratingAwsAccounts();
    accountsWrapper.find('i.el-icon-question').trigger('click');
    expect(appWrapper.vm.helpDialogContent).toBe(dialogContentsForIntegratingAwsAccounts.getContent());
    expect(appWrapper.vm.helpDialogTitle).toBe(dialogContentsForIntegratingAwsAccounts.getTitle());
    expect(appWrapper.vm.showHelpDialog).toBe(true);
  })

  it('should not display the information dialog when the user clicks on the button that says "OK"', () => {
    accountsWrapper.find('i.el-icon-question').trigger('click');
    appWrapper.find('.dialog-footer > button').trigger('click');
    expect(appWrapper.vm.showHelpDialog).toBe(false);
  })

  it('should create an integration with an AWS account when valid credentials are specified', () => {
    accountsClient.postAwsAccount = jest.fn();
    accountsWrapper.find('[name="Access Key ID"]').setValue('AKIAIOSFODNN7EXAMPLE');
    accountsWrapper.find('[name="Secret Access Key"]').setValue('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
    accountsWrapper.find('[name="Integrate AWS account"]').trigger('click');
    expect(accountsClient.postAwsAccount).toHaveBeenCalled();
  })

  it('should not try to create an integration when invalid credentials are specified', () => {
    accountsClient.postAwsAccount = jest.fn();
    accountsWrapper.find('[name="Access Key ID"]').setValue('');
    accountsWrapper.find('[name="Secret Access Key"]').setValue('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
    accountsWrapper.find('[name="Integrate AWS account"]').trigger('click');
    expect(accountsClient.postAwsAccount).not.toHaveBeenCalled();
  })
})
