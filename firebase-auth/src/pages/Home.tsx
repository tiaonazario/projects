import { getAuth, signOut } from "firebase/auth"

export const Home = () => {
  const auth = getAuth();

  return (
    <div className="flex p-6">
      <header className="flex gap-4 justify-between w-[100vw]">
        <span className="">Home</span>
        <span className="">Bem-vindo</span>
        <button onClick={() => signOut(auth)} className="">Sair</button>
      </header>
    </div>
  )
}
