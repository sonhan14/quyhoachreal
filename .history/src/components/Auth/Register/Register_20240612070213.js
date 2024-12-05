
import React, { useContext, useState } from "react";
import axios from "axios";

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

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const {fullname, email, password, phone} = values;
    
  }
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
              className="opacity-95 rounded-[30px] border-none flex flex-col gap-4 items-center relative"
            >
              <ClearIcon
                className="absolute top-4 right-5 p-2 cursor-pointer text-zinc-500 hover:text-black"
                onClick={handleCloseModal}
              />

<>
          <Typography variant="h3">Create Account</Typography>
          <TextField
            label="Name"
            variant="outlined"
            className="w-full rounded-full"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
          />
          <TextField
            label="Gmail"
            variant="outlined"
            className="w-full"
            type="email"
            value={registerGmail}
            onChange={(e) => {
              setRegisterGmail(e.target.value);
            }}
          />
          <TextField
            label="Username"
            variant="outlined"
            className="w-full"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.currentTarget.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            className="w-full"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <Button
            variant="contained"
            size="large"
            className="bg-[#5BE260] w-full text-center text-black"
            onClick={handleRegister}
          >
            register
          </Button>
          <Button
            variant="contained"
            className="bg-[#CBCDCF] w-full text-[#08174E]"
            onClick={handleShowLogin}
          >
            i already have an account
          </Button>
        </>
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

  
    
}
export default RegisterPage;