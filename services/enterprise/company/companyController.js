import Company from '../../../models/enterprise/company/company.js';
import Department from '../../../models/enterprise/company/department.js';
import ApiError from '../../../util/ApiError.js';
import UserFactory from '../../users/userFactory.js';
import AuthController from '../../auth/authController.js';

class CompanyController {
    constructor() {
        this.userFactory = new UserFactory();
        this.authFacade = new AuthController();
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

    async getCompanyDetail(companyId) {
        const company = await Company.findById(companyId);

        // find all branches
        const branches = await Company.find({ parentCompany: companyId });

        // find all departments
        const departments = await Department.find({ company: companyId });

        // find all employees
        const employees = await this.userFactory.find('employee', { company: companyId });

        return { company, branches, departments, employees };
    }

    async updateCompany(companyId, args) {
        const company = await Company.findById(companyId);

        if (!company) {
            throw new ApiError(404, 'Company not found');
        }

        await company.updateOne(args);

        return company;
    }

    async getCompanyProfile(companyId) {
        const company = await Company.findById(companyId);

        return company;
    }

    // Manage Employees
    async getEmployees(companyId) {
        const employees = await this.userFactory.find('employee', { company: companyId });

        // remove password from each employee
        const temp = employees.map((employee) => {
            const obj = employee.toObject();
            delete obj.password;
            return obj;
        });

        return temp;
    }

    // Manage Departments
    async getDepartments(companyId) {
        const departments = await Department.find({ company: companyId });

        return departments;
    }

    async getDepartmentById(departmentId) {
        const department = await Department.findById(departmentId);

        if (!department) {
            throw new ApiError(404, 'Department not found');
        }

        const employees = await this.userFactory.find('employee', { department: departmentId });

        return { department, employees };
    }

    async createDepartment(companyId, name, underDepartment) {
        const department = await Department.create({
            company: companyId,
            name,
            underDepartment,
        });

        return department;
    }

    async updateDepartment(departmentId, args) {
        const department = await Department.findById(departmentId);

        if (!department) {
            throw new ApiError(404, 'Department not found');
        }

        await department.updateOne(args);

        return department;
    }

    async deleteDepartment(departmentId) {
        const department = await Department.findById(departmentId);

        if (!department) {
            throw new ApiError(404, 'Department not found');
        }

        await Department.findByIdAndDelete(departmentId);

        return true;
    }

    async getDepartmentEmployees(departmentId) {
        const employees = await this.userFactory.find('employee', { department: departmentId });

        return employees;
    }

    async setEmployeeDepartment(employeeId, departmentId) {
        const employee = await this.userFactory.findOne('employee', { _id: employeeId });

        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }

        await this.userFactory.update('employee', employeeId, { department: departmentId });

        return true;
    }
}

export default CompanyController;
