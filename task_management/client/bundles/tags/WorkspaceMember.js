import gql from "graphql-tag";

export const INVITATION_WORKSPACE_MEMBER = gql`
  mutation(
    $name: String!
    $email: String!
    $role: Int!
    $password: String!
    $passwordConfirmation: String!
    $workspaceId: Int!
  ) {
    invitationWorkspaceMember(
      input: {
        name: $name
        email: $email
        role: $role
        password: $password
        passwordConfirmation: $passwordConfirmation
        workspaceId: $workspaceId
      }
    ) {
      workspaceMember {
        role
        user {
          name
        }
      }
    }
  }
`;

export const WORKSPACE_MEMBERS = gql`
  query {
    workspaceMembers {
      edges {
        node {
          role
          user {
            name
          }
        }
      }
    }
  }
`;
