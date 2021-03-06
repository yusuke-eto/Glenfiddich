import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { SearchContent } from "../../components/molecules/SearchContent";
import { GrPaper } from "../../components/molecules/GrPaper";
import { PaperHeader } from "../../components/molecules/PaperHeader";
import { PaperSearchContent } from "../../components/organisms/PaperSearchContent";
import { PaperBody } from "../../components/atoms/PaperBody";
import { AddButton } from "../../components/atoms/AddButton";
import { DashboardTable } from "../../components/organisms/DashboardTable";
import { ProjectThead } from "../../components/molecules/ProjectThead";
import { ProjectTableTr } from "../../components/molecules/ProjectTableTr";
import DescriptionIcon from "@material-ui/icons/Description";
import PeopleIcon from "@material-ui/icons/People";
import { AddProjectModal } from "../../components/organisms/AddProjectModal";
import { AddWorkspaceMemberModal } from "../../components/organisms/AddWorkspaceMemberModal";
import {
  INVITATION_WORKSPACE_MEMBER,
  WORKSPACE_MEMBERS
} from "../../tags/WorkspaceMember";
import { MemberSortTable } from "../../components/organisms/MemberSortTable";
import { ProjectSortTable } from "../../components/organisms/ProjectSortTable";
import { CREATE_USER, USERS } from "../../tags/User";
import { ADD_TASK } from "../../tags/Task";
import { useMutation, useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles(theme => ({
  projectPaper: {
    paddingBottom: "10px"
  },
  icon: {
    flex: "1",
    height: "100%"
  }
}));

export const DashboardContainer = props => {
  const classes = useStyles();
  // モーダル表示の状態を管理する
  const [projectOpen, setProjectOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const [tasks, setTasks] = useState(props.tasks);
  const [addTask] = useMutation(ADD_TASK);
  const [addWorkspaceMember] = useMutation(INVITATION_WORKSPACE_MEMBER, {
    update(cache, { data: { invitationWorkspaceMember } }) {
      // 本当はここで cache.writeQuery を使っていい感じに users のリストを更新したい
      // const { workspaceMembers } = cache.readQuery({ query: WORKSPACE_MEMBERS });
    }
  });

  // ユーザー追加のエラーメッセージ用
  const [userErrors, setUserErrors] = useState([]);
  const { loading, error, data } = useQuery(WORKSPACE_MEMBERS);
  const [workspaceMembersNode, setWorkspaceMembersNode] = useState([]);

  useEffect(() => {
    if (data) {
      setWorkspaceMembersNode(data.workspaceMembers.edges);
    }
  }, [data]);

  const addNewTasks = (title, description) => {
    addTask({
      variables: { title: title, userId: 1, description: description }
    });
    const newTasks = tasks.concat({
      title: title,
      description: description
    });
    setTasks(newTasks);
  };

  const cerateWorkspaceMember = (
    name,
    email,
    role,
    password,
    passwordConfirmation
  ) => {
    addWorkspaceMember({
      variables: {
        name: name,
        email: email,
        role: role,
        password: password,
        passwordConfirmation: passwordConfirmation,
        workspaceId: props.workspaceId
      }
    })
      .then(result => {
        // ユーザーの一覧に追加したメンバーを表示させるため
        setWorkspaceMembersNode(
          workspaceMembersNode.concat({
            node: result.data.invitationWorkspaceMember.workspaceMember
          })
        );
        setUserOpen(false);
      })
      .catch(e => {
        // 失敗した時は、エラーメッセージを表示して、モーダルを閉じないようにする
        const errorMessages = e.graphQLErrors.map(error => {
          return error["message"];
        });
        setUserErrors(errorMessages);
      });
  };

  return (
    <>
      <BackgroundThema>
        <Content>
          <SearchContent />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <GrPaper className={classes.projectPaper}>
                <PaperHeader title="Project">
                  <DescriptionIcon className={classes.icon} />
                </PaperHeader>
                <PaperSearchContent />
                <PaperBody>
                  <AddButton
                    message="プロジェクトを追加する"
                    handleClick={() => setProjectOpen(true)}
                  />
                  <ProjectSortTable
                    tasks={tasks}
                  />
                </PaperBody>
              </GrPaper>
            </Grid>
            <Grid item xs={6}>
              <GrPaper>
                <PaperHeader title="Member">
                  <PeopleIcon className={classes.icon} />
                </PaperHeader>
                <PaperSearchContent />
                <PaperBody>
                  <AddButton
                    message="メンバーを追加する"
                    handleClick={() => setUserOpen(true)}
                  />
                  <MemberSortTable
                    users = {usersNode &&
                    usersNode.map((userNode, index) => {
                      return (
                        userNode.node
                      );
                    })}
                  />
                </PaperBody>
              </GrPaper>
            </Grid>
          </Grid>
        </Content>
      </BackgroundThema>
      {/* プロジェクト追加モーダル */}
      <AddProjectModal
        open={projectOpen}
        handleClose={() => setProjectOpen(false)}
        addNewTasks={(title, description) => addNewTasks(title, description)}
      />
      <AddWorkspaceMemberModal
        open={userOpen}
        handleClose={() => setUserOpen(false)}
        cerateWorkspaceMember={(
          name,
          email,
          role,
          password,
          passwordConfirmation
        ) =>
          cerateWorkspaceMember(
            name,
            email,
            role,
            password,
            passwordConfirmation
          )
        }
        errors={userErrors}
      />
    </>
  );
};

const BackgroundThema = styled.div`
  background-image: url("../../assets/dashboard-background.png");
  background-size: cover;
`;

const Content = styled.div`
  width: 85%;
  margin: 0 auto;
`;
