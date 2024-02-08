// components/withUserName.js

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../app/context/UserContext';
import { useParams } from 'next/navigation'

const UserNameRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const roomName =useParams().roomName;
    console.log("jhj",roomName);

    useEffect(() => {
      if (!user.userName) {
        router.push(`/`);
      }
    }, [user.userName, router]);

    return user.userName ? <WrappedComponent {...props} /> : <h1>Errror</h1>;
  };
};

export default UserNameRoute;
