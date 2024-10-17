import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div style={styles.container}>
      <SignUp />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Makes the container take the full height of the viewport
    backgroundColor: '#f9f9f9', // Optional: change the background color
  },
};
