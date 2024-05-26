import Company from './company.js';
import Department from './department.js';
import ApiError from '../../util/ApiError.js';
import UserFactory from '../users/userFactory.js';

class CompanyFacade {
    async createCompany(name, email, phone, address, payment) {
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
                payment,
                active: {
                    //30 days from now
                    until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });

            department = await Department.create({
                name: 'Admin',
                company: company._id,
            });

            const adminEmail = name.replace(/\s/g, '') + '@admin.com';

            const password = Math.random().toString(36).substring(2, 10);

            const userFactory = new UserFactory();
            const admin = await userFactory.createUser('employee', {
                firstName: 'Admin',
                lastName: '1',
                email: adminEmail,
                gender: 'Prefer not to say',
                password,
                confirmPassword: password,
                companyId: company._id,
                jobTitle: 'Admin',
            });

            admin.department = department._id;

            await userFactory.save(admin);

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
