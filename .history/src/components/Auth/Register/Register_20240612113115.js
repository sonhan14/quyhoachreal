import React, { useContext, useState } from "react";
import axios from "axios";
import "./Register.scss"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { callLogin, callRegister } from "../../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../../redux/account/accountSlice";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";


const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: '8px',
  p: 6,
};

const LOGIN = 1;
const REGISTER = 2;
const FORGOT_PASSWORD = 3;
const RESET_PASSWORD = 4;

const Register = () => {
  const [content, setContent] = useState(1);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerGender, setRegisterGender] = useState("Nam");
  const [registerLatitude, setRegisterLatitude] = useState(null);
  const [registerLongitude, setRegisterLongitude] = useState("");
  const [registeravatarLink, setRegisteravatarLink] = useState(null);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLastLoginIP, setRegisterLastLoginIP] = useState(null);

  const navigate = useNavigate();

  const [forgotPassword, setForgotPassword] = useState("");
  const dispatch = useDispatch()

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogin = async(userName, password) => {
    const res = await callLogin(userName, password);
    if(res?.data) {
      console.log("res",res)
      localStorage.setItem('jwt',res.data.jwt)
      dispatch(doLoginAction(res.config.data))
      message.success('Đăng nhập tài khoản thành công!');
      navigate('/')
    }else{
      notification.error({
        message:'Có lỗi xáy ra',
        description:
          res.message && Array.isArray(res.message) ? res.message[0] :res.message[1],
        duration: 5
      })
    }
  };

  const handleRegister = async(registerUsername, registerFullName, registerPassword, registerGender, registerLatitude, registerLongitude, registeravatarLink, registerEmail, registerLastLoginIP) => {
    const res = await callRegister(registerUsername, registerFullName, registerPassword, registerGender, registerLatitude, registerLongitude, registeravatarLink, registerEmail, registerLastLoginIP);
    if(res?.data) {
      console.log("res",res)
      // localStorage.setItem('jwt',res.data.jwt)
      // dispatch(doLoginAction(res.config.data))
      message.success('Đăng ký tài khoản thành công!');
      setContent(LOGIN);
      setOpenModal(true);
    }else{
      notification.error({
        message:'Có lỗi xáy ra',
        description:
          res.message && Array.isArray(res.message) ? res.message[0] :res.message[1],
        duration: 5
      })
    }
  };


  const renderContent = () => {
    if (content === LOGIN) {
      return (
        <div className="form-modal-item">
          <Typography className="form-modal-title" variant="h3">Sign In</Typography>
          <TextField
            label="Email address or username"
            variant="outlined"
            className="form-modal-input w-full rounded-full"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            className="form-modal-input w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            className="btn-form bg-[#5BE260] w-full text-center text-black"
            onClick={()=>{handleLogin(userName,password)}}
          >
            login
          </Button>
          <Button
            variant="contained"
            className="btn-form bg-[#CBCDCF] w-full text-[#08174E]"
            onClick={() => (handleShowForgotPassword(), setOpenModal(true))}
          >
            i forgot my password
          </Button>
        </div>
      );
    }
    if (content === REGISTER) {
      return (
        <div className="form-modal-item">
          <Typography className="form-modal-title" variant="h3">Create Account</Typography>
          <TextField
            label="UserName"
            variant="outlined"
            className="form-modal-input w-full rounded-full"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <TextField
            label="Gmail"
            variant="outlined"
            className="form-modal-input w-full"
            type="email"
            value={registerEmail}
            onChange={(e) => {
              setRegisterEmail(e.target.value);
            }}
          />
          <TextField
            label="Fullname"
            variant="outlined"
            className="form-modal-input w-full"
            value={registerFullName}
            onChange={(e) => setRegisterFullName(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            className="form-modal-input w-full"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <Button
            variant="contained"
            size="large"
            className="btn-form bg-[#5BE260] w-full text-center text-black"
            onClick={()=> {handleRegister(registerUsername, registerFullName, registerPassword, registerGender, registerLatitude, registerLongitude, registeravatarLink, registerEmail, registerLastLoginIP)}}
          >
            register
          </Button>
          <Button
            variant="contained"
            className="btn-form bg-[#CBCDCF] w-full text-[#08174E]"
            onClick={handleShowLogin}
          >
            i already have an account
          </Button>
        </div>
      );
    }


    if (content === FORGOT_PASSWORD) {
      return (
        <div className="form-modal-item">
          <Typography className="form-modal-title" variant="h4">Forgot Your Password ?</Typography>
          <Typography>
            Please enter your email below and we will send you a password reset
            via email.
          </Typography>
          <TextField
            label="Email address "
            variant="outlined"
            className="form-modal-input w-full rounded-full"
            type="email"
            value={forgotPassword}
            onChange={(e) => setForgotPassword(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            className="btn-form bg-[#5BE260] w-full text-center text-black"
          >
            submit
          </Button>
        </div>
      );
    }
  };
  const handleShowLogin = () => {
    setContent(LOGIN);
    setOpenModal(true);
  };

  const handleShowRegister = () => {
    setContent(REGISTER);

    setOpenModal(true);
  };

  const handleShowForgotPassword = () => {
    setContent(FORGOT_PASSWORD);
  };



  return (
    <Box className="h-screen w-screen bg-[url(/loginBackground.png)] bg-cover">
      <Box className="flex flex-col gap-12 top-0 left-0 w-full h-full  justify-center items-center text-center">
        <Box className="flex items-center gap-4">
          <img src="/public/logo.png" alt="" className="w-[120px] h-[102px]" />

          <Typography className="uppercase font-bold text-white text-[128px]">
            samnotes
          </Typography>
        </Box>
        <Typography className="text-5xl text-white">
          A place to store and share your ideas. Anytime, anywhere.
        </Typography>
        <Box className="flex gap-12 justify-center">
          <Button
            variant="contained"
            className="w-[495px] h-[111px] bg-[#5BE260] text-5xl text-black rounded-[30px]"
            onClick={handleShowRegister}
          >
            Get Started
          </Button>

          <Button
            variant="contained"
            className="w-[495px] h-[111px] text-5xl bg-[#DADADA] text-black rounded-[30px]"
            onClick={handleShowLogin}
          >
            login
          </Button>
          <Modal
            open={openModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={styleModal}
              className="form-modal opacity-95 rounded-[30px] border-none flex flex-col gap-4 items-center relative"
            >
              <ClearIcon
                className="form-modal-iconclose absolute top-4 right-5 p-2 cursor-pointer text-zinc-500 hover:text-black"
                onClick={handleCloseModal}
              />

              {renderContent()}
            </Box>
          </Modal>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Account Created</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                We have sent a confirmation letter to your email address. Please
                check your email and access the link. If you haven't received
                our letter, please click the button below to resend.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Box className="w-full flex justify-center gap-3">
                <Button
                  variant="contained"
                  onClick={() => (handleCloseDialog(), setContent(LOGIN))}
                  className="bg-[#5BE260] text-black flex-1"
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseDialog}
                  className="text-black bg-[#DADADA] flex-1"
                >
                  resend confirmation mail
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;