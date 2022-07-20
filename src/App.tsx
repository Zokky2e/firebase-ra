import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
interface City {
  id: string;
  city: string;
  country: string;
}
function App() {
  const [items, setItems] = useState<City[]>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email2, setEmail2] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  useEffect(() => {
    setListeners();
  }, []);
  function setListeners() {
    const q = query(collection(db, "cities"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docsItems = querySnapshot.docs.map((item) => {
        return { ...item.data(), id: item.id };
      }) as City[];
      setItems(docsItems);
    });
  }
  //items = [];
  //if(items.lenght) false
  //if(items) true
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user?.toJSON());
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);
  async function handleClick() {
    const collectionRef = collection(db, "cities");
    await addDoc(collectionRef, {
      city: "Tokyo",
      country: "Japan",
    });
  }
  function renderCities() {
    return (
      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            <p>{item.city}</p>
            <p>{item.country}</p>
          </li>
        ))}
      </ul>
    );
  }
  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email2 || !password2) return;
    createUserWithEmailAndPassword(auth, email2, password2)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log({ user });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  function handleLogout() {
    signOut(auth);
  }
  return (
    <div className="App">
      <button onClick={handleClick}>Add</button>
      <p>Login</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <p>Register</p>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email2}
          onChange={(e) => setEmail2(e.currentTarget.value)}
        />
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.currentTarget.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
      {renderCities()}
    </div>
  );
}

export default App;
