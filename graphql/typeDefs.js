const { gql } = require('apollo-server');

module.exports = gql`
type User {
    _id:ID
    email: String
    password: String
    number : String
    name: String
}
type LoggedInUser {
    _id:ID
    email: String
    number : String
    name: String
    token:String
}
input RegisterInput {
    email: String
    password: String
    number : String
    name: String
}
input loginInput {
    email: String
    password: String
}
input updateInput{
    email:String
    name:String
    number:String
}
type Query {
    User(id: ID!): User
}
type Mutation {
    registerUser(RegisterInput: RegisterInput): User
    loginUser(loginInput: loginInput): LoggedInUser
    updateUser(updateInput:updateInput):User
}
`