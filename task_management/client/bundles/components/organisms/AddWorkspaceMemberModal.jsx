import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  errorMessage: {
    color: "#FF0000"
  }
}));

export const AddWorkspaceMemberModal = ({open, handleClose, invitationWorkspaceMember, error}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const classes = useStyles();

  // 権限のセレクトボックスで使用する
  const roles = [
    { label: "オーナー", value: 0 },
    { label: "管理者", value: 1 },
    { label: "一般", value: 2 },
    { label: "ゲスト", value: 3 }
  ];

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">メンバーの追加</DialogTitle>
      <DialogContent>
        {/* 追加に失敗した時は下記でエラーメッセージを表示する @todo style の修正 */}
        {error != '' &&
          (<p className={classes.errorMessage}>
            {error}
          </p>)
        }
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="メンバー名"
          type="name"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="mail"
          label="メールアドレス"
          type="text"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
          fullWidth
        />
        <FormControl className={classes.formControl}>
          <InputLabel>権限</InputLabel>
          <Select
            value={role}
            onChange={e => {
              setRole(e.target.value);
            }}
          >
            {roles.map((role, index) => {
              return (
                <MenuItem value={role["value"]} key={index}>
                  {role["label"]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          onClick={() =>
            invitationWorkspaceMember(
              name,
              email,
              role,
            )
          }
        >
          追加
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleClose()}
        >
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
};
