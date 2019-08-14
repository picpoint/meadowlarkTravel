module.exports = {
  cookieSecret: 'Наш секретный куки',
  gmail: {
    user: 'name_of_user',
    password: 'password_of_email'
  },
  mongo: {
    development: {
      connectionString: 'mongodb+srv://admin:admin@cluster0-y62gr.mongodb.net/test?retryWrites=true&w=majority'
    },
    production: {
      connectionString: 'mongodb+srv://admin:admin@cluster0-y62gr.mongodb.net/test?retryWrites=true&w=majority'
    }
  }

};
