import Log from '../../../models/enterprise/log/log.js';

class LogController {
    async logAction(user, company, action, description) {
        const log = await Log.create({
            user,
            company,
            action,
            description,
        });

        return log;
    }

    async getCompanyLogs(company, filters) {
        const logs = await Log.find({ company, ...filters })
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });

        return logs;
    }
}

export default LogController;
