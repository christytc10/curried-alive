import { getSession } from "next-auth/client";
import io from 'socket.io-client'


export async function getServerSideProps(req, res) {
  const session = await getSession(req);
  
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const myUser = session.user.name;

  const socket = io("http://localhost:3001");
  socket.emit('joined', myUser)
  return {
    props: {
      username: myUser
    },
  };
}

export default function Home({ username }) {
  const socket = io("http://127.0.0.1:3001");
  
  const handleClick = (id) => {
    console.log("TESTCLICK");
    socket.emit('action', username)
  };

  return (
    <div>
      <main>
        <h1>Welcome {username}</h1>
        <p>Enter your game ID as shown on the game screen</p>
        <p>Or host a new game</p>
        <a onClick={() => handleClick()}>Test</a>
      </main>
    </div>
  );
}
