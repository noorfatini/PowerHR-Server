import CompanyFacade from './company/companyFacade.js';

class EnterpriseFactory {
    constructor() {
        this.companyFacade = new CompanyFacade();
    }

    async createCompany(name, email, phone, address, payment) {
        return this.companyFacade.createCompany(name, email, phone, address, payment);
    }

    async isCompanyExist(email) {
        return this.companyFacade.isExist(email);
    }
}

export default EnterpriseFactory;
