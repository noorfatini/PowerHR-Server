import Company from '../../../models/enterprise/company/company.js';
import Department from '../../../models/enterprise/company/department.js';
import ApiError from '../../../util/ApiError.js';
import UserFactory from '../../users/userFactory.js';
import AuthFacade from '../../auth/authFacade.js';

class CompanyFacade {
    constructor() {
        this.userFactory = new UserFactory();
        this.authFacade = new AuthFacade();
    }

    async createCompany(name, email, phone, address) {
        let company;
        let department;

        const companyExist = await Company.findOne({ email });

        if (companyExist) {
            throw new ApiError(400, 'Company already exists');
        }

        try {
            company = await Company.create({
                name,
                email,
                phone,
                address,
                active: {
                    //30 days from now
                    until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });

            department = await Department.create({
                name: 'Admin',
                company: company._id,
            });

            const adminEmail = email;
            const password = Math.random().toString(36).substring(2, 10);

            await this.authFacade.register('employee', {
                firstName: 'Admin',
                lastName: '1',
                email: adminEmail,
                gender: 'Prefer not to say',
                password,
                confirmPassword: password,
                companyId: company._id,
                jobTitle: 'Admin',
                departmentId: department._id,
            });

            return company;
        } catch (error) {
            if (company._id) {
                await Company.findByIdAndDelete(company._id);
            }

            if (department._id) {
                await Department.findByIdAndDelete(department._id);
            }
            throw error;
        }
    }

    async isExist(email) {
        const company = await Company.exists({ email });

        if (company) {
            return true;
        }

        return false;
    }
}

export default CompanyFacade;
