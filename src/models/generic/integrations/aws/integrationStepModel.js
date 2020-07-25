const defaultFunctionToExecuteOnNext = new Promise((resolve) => {resolve()});

export default class {
  constructor (stepName, stepDescription, functionToExecuteOnNext = defaultFunctionToExecuteOnNext) {
    this.name = stepName;
    this.description = stepDescription;
    this.functionToExecuteOnNext = functionToExecuteOnNext;
  }

  getName () {
    return this.name;
  }

  getDescription () {
    return this.description;
  }

  getFormData () {
    return this.formData;
  }

  getFunctionToExecuteOnNext () {
    return this.functionToExecuteOnNext;
  }

  setFunctionToExecuteOnNext (functionToExecuteOnNext) {
    this.functionToExecuteOnNext = functionToExecuteOnNext;
  }

  setFormData (formData) {
    this.formData = formData;
  }

}
