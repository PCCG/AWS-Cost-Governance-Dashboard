import { mount, createLocalVue  } from '@vue/test-utils'
import Element from 'element-ui'
import accounts from '@/views/Accounts'
import Vuex from 'vuex'
import skeleton from '../../src/App'
import helpDialog from '../../src/constants/helpDialog';
import awsAccountForm from '@/components/Accounts/AwsAccountForm'
import locale from 'element-ui/lib/locale/lang/en'
import Vuetify from 'vuetify';

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Element, { locale })
localVue.use(Vuetify)

describe('AwsAccountForm.vue', () => {
  let mutations
  let state
  let store

  beforeEach(() => {
    state = {
      helpDialogTitle: '',
      helpDialogContent: ''
    }

    mutations = {
      SET_HELP_DIALOG_CONTENTS: jest.fn(),
      HELP_DIALOG_STATE: jest.fn()
    }

    store = new Vuex.Store({
      state,
      mutations
    })
  });

  it('should show the information dialog when the user clicks on the "question" icon', () => {
    let accountsWrapper = mount(accounts, { store, localVue });
    accountsWrapper.find('i.el-icon-question').trigger('click');
    expect(mutations.SET_HELP_DIALOG_CONTENTS).toHaveBeenCalled();
    expect(mutations.HELP_DIALOG_STATE).toHaveBeenCalled();
  })

  it('should present "Cost Explorer" as the default AWS service', () => {
    let accountsWrapper = mount(accounts, { localVue });
    expect(accountsWrapper.findComponent(awsAccountForm).vm.awsAccountForm.awsService).toBe('Cost Explorer (CE)');
  })
})
