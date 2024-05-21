import User from './user.js';
import mongoose from 'mongoose';

const sysadminSchema = new mongoose.Schema(
    {},
    {
        discriminatorKey: '__t',
    },
);

const SysAdmin = User.discriminator('SysAdmin', sysadminSchema);

export default SysAdmin;
