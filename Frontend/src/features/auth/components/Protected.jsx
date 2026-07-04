import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import LoadingScreen from '../../../components/LoadingScreen.jsx';

const Protected = ({ children }) => {
  const { user, Loading } = useAuth();

  if (Loading) {
    return (
      <LoadingScreen
        title='Checking your session'
        subtitle='We are verifying your access and restoring the app state securely.'
        detail='You will be redirected as soon as authentication is ready.'
      />
    );
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;
