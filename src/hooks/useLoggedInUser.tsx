import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

import { onAuthChanged } from '../utils/Firebase';

// Hook providing logged in user information
const useLoggedInUser = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    onAuthChanged((u) => setUser(u ?? undefined));
  }, []);

  return user;
};

export default useLoggedInUser;
