const gql = require('graphql-tag');

module.exports = {
  user: gql`
    query getUser($id: ID!) {
      user(id: $id) {
        user {
          username
        }
      }
    }
  `,
  CREATE_USER: gql`
    mutation register($data: RegisterData!) {
      register(data: $data) {
        username
        id
      }
    }
  `,
  LOGIN: gql`
    mutation doSome($data: LoginData!) {
      login(data: $data) {
        username
      }
    }
  `,
};
