import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { SnackbarProvider, useSnackbar } from 'notistack';
import { shiftNotificationArray } from "components/Stackbar/Stackbar_slice";
import Grow from '@material-ui/core/Grow';

const StackbarApp = () => {
  const dispatch = useIndexDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { notificationArray } = useIndexSelector((state) => { // Get global state that needed
    return {
      notificationArray: state.Stackbar.Stackbar.notificationArray,
    }
  });

  React.useEffect(() => {
    if (notificationArray.length === 0) {
      return;
    } else {
      enqueueSnackbar(notificationArray[0].message, {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        ransitionComponent: Grow,
        variant: notificationArray[0].variant
      });
      dispatch(shiftNotificationArray())
    }
  }, [notificationArray]);

  return <></>
}

const Stackbar = () => {
  return (<SnackbarProvider
    maxSnack={3}>
    <StackbarApp />
  </SnackbarProvider>);
}

export default Stackbar;