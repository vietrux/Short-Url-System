import { auth, db } from '../firebase';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, query, onSnapshot, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';

type UrlType = {
  short: string;
  long: string;
}

export default function Manage() {
  const [user, setUser] = useState({} as User);
  const [urls, setUrls] = useState([] as UrlType[]);
  const [listid, setListid] = useState([] as string[]);
  const [shorturi, setShort] = useState('');
  const [longuri, setLong] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);



  useEffect(() => {
    const q = query(collection(db, "urls"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const urls = [] as UrlType[];
      const shortid = [] as string[];
      querySnapshot.forEach((doc) => {
        urls.push({
          short: doc.data().short,
          long: doc.data().long
        } as UrlType);
        shortid.push(doc.id);
      });
      setUrls(urls);
      setListid(shortid);
    });
    return () => {
      unsubscribe();
    }
  }, []);

  function GenId() {
    const randomString = Math.random().toString(36).substring(2, 8);
    //check if id is exist
    if (listid.includes(randomString)) {
      GenId();
    }
    return randomString;
  }

  async function AddUrl() {
    if (!shorturi) {
      const randomid = GenId();
      //check if protocol is exist
      if (longuri.includes("://")) {
        await setDoc(doc(db, "urls", randomid as string), {
          short: randomid,
          long: longuri,
        });
      } else {
        await setDoc(doc(db, "urls", randomid as string), {
          short: randomid,
          long: "http://" + longuri,
        });
      }
      setLong('')
    } else {
      if (!longuri) {
        alert('Vui lòng nhập đủ thông tin');
      } else {
        await setDoc(doc(db, "urls", shorturi as string), {
          short: shorturi,
          long: longuri,
        });
        setLong('')
        setShort('')
      }
    }
  }

  async function DeleteUrl(id: string) {
    await deleteDoc(doc(db, "urls", id));
  }

  const provider = new GoogleAuthProvider();
  async function handleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      }).catch((error) => {
        console.log(error);
      });
  }
  async function handleSignOut() {
    signOut(auth).then(() => {
      setUser({} as User);
    })
  }

  return (
    <>

      {
        user.uid
          ?
          <div className="w-full h-full">
            <div className="flex my-8 mx-2 justify-between">
              <h1 className="text-left font-bold text-3xl">Short URL System</h1>
              <button
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                onClick={handleSignOut}>
                Sign out
              </button>
            </div>
            {
              user.uid !== 'UtiDQtZqchVJF7ZhwrUnWdWic7g1' ?
                <div className="flex my-8 mx-auto justify-center">
                  Bạn không có cửa đâu
                </div>
                :
                <div className='overflow-x-auto relative shadow-md sm:rounded-lg my-4'>
                  <table className='w-full text-sm text-left text-gray-500 '>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
                      <tr>
                        <th scope="col" className="py-3 px-6 w-1/5">Short</th>
                        <th scope="col" className="py-3 px-6 w-3/5">Long</th>
                        <th scope="col" className="py-3 px-6 w-1/5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='bg-white border-b hover:bg-gray-50 '>
                        <td className='py-4 px-6'>
                          <input
                            onChange={
                              (e) => {
                                setShort(e.target.value);
                              }
                            }
                            value={shorturi}
                            className=' appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none '
                            type='text' placeholder='Short URL' />
                        </td>
                        <td className='py-4 px-6'>
                          <input
                            onChange={
                              (e) => {
                                setLong(e.target.value);
                              }
                            }
                            value={longuri}
                            className=' appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight ' type='text' placeholder='Long URL' />
                        </td>
                        <td className='py-4 px-6 cursor-pointer text-center'>
                          <button
                            onClick={
                              async () => {
                                await GenId();
                                AddUrl();
                              }
                            }
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Shorten
                          </button>
                        </td>
                      </tr>
                      {
                        urls.length !== 0 ? urls.map((url, index) => {
                          return (
                            <tr key={index} className='bg-white border-b hover:bg-gray-50 '>
                              <td className='py-4 px-6'><a href={`https://vtrg.tk/${url?.short}`}>{url?.short}</a></td>
                              <td className='py-4 px-6'><a href={url?.long}>{url?.long}</a></td>
                              <td onClick={() => DeleteUrl(url.short)} className='py-4 px-6 cursor-pointer text-center'>
                                <button
                                  onClick={() => DeleteUrl(url.short)}
                                  className='bg-blue-100 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded'>
                                  <svg className='h-6 w-6 text-red-500 mx-auto' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
                                    <path d='M0 0h24v24H0z' fill='none' />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          )
                        })
                          :
                          <tr>
                            <td colSpan={2}>No urls</td>
                          </tr>
                      }
                    </tbody>
                  </table>
                </div>
            }

          </div>
          :
          <div className="absolute w-full h-full flex flex-col items-center justify-center">
            <p className='my-4 text-xl'>You have to be logged in to manage your short URLs</p>
            <br />
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
              onClick={handleSignIn}>Sign in with Google</button>
          </div>
      }
    </>
  );
}