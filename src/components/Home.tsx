import { Link } from 'react-router-dom'
export default function Home(){
  return (
    <div className="absolute w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-center font-bold text-[36px]">Short URL System</h1>
      <Link to="/manage">-Viet Trung-</Link>
    </div>
  );
}