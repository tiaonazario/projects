import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignIn () {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setAuthing(true)

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setAuthing(false)
      });
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center">
      <div className="flex flex-col gap-5 bg-gray-800 p-8 rounded-2xl">
        <h1 className="text-center font-bold text-3xl pb-4">Fazer Login</h1>

        <div className="flex flex-col gap-2">
          <button className="font-bold hover:text-cyan-700">Entar com o Facebook</button>
          <button onClick={signInWithGoogle} className="font-bold hover:text-cyan-700">Entrar com o Google</button>
        </div>

        <span className="text-center">ou</span>

        <form className="flex flex-col gap-4">
          <input type="email" className="p-2 w-[300px] bg-transparent border border-gray-400 rounded focus:outline-none focus:border-cyan-700" placeholder="E-mail" />
          <input type="password" className="p-2 w-[300px] bg-transparent border border-gray-400 rounded focus:outline-none focus:border-cyan-700" placeholder="Senha" />

          <button type="submit" className="bg-cyan-600 rounded-lg p-2 font-bold hover:bg-cyan-700 transition-colors">Entrar</button>
        </form>

        <span className="text-center">Não tem uma conta? <a className="cursor-pointer font-bold text-cyan-600 hover:text-cyan-700">Inscrever-se</a></span>
      </div>
    </div>
  )
}
