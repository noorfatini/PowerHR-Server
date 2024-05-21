class Authentication {
    async register(userData) {
        throw new Error('Register method must be implemented by subclass');
    }
}

export default Authentication;
