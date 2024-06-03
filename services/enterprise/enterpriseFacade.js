import CompanyFacade from './company/companyFacade.js';

class EnterpriseFactory {
    constructor() {
        this.companyFacade = new CompanyFacade();
    }

    async createCompany(name, email, phone, address) {
        return this.companyFacade.createCompany(name, email, phone, address);
    }

    async isCompanyExist(email) {
        return this.companyFacade.isExist(email);
    }
}

export default EnterpriseFactory;
