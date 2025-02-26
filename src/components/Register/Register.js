import React, {useState} from 'react';

const Register = ({onRouteChange, loadUser}) => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [unable, setUnable] = useState(false);
    const [fill, setFill] = useState(false);

    const onNameChange = (event) => {
        setName(event.target.value);
    }

    const onEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const onSubmitRegister = () => {
        if(!name || !email || !password) {
            setFill(true);
        } else {
            setFill(false);
            fetch('https://face-recognition-brain-api-vp7d.onrender.com/register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(user => {
                if(user.id) {
                    loadUser(user);
                    onRouteChange('home');
                } else {
                    setUnable(true);
                }
            });
        }
    }

    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input onChange={onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name" id="name"/>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input onChange={onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address"/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input onChange={onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password"/>
                        </div>
                    </fieldset>
                    <div className="">
                        <input onClick={onSubmitRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register"/>
                    </div>
                    {unable && (
                        <div className='red pa2 br3 mb3 tc'>Unable to register with these details. Please try a different one.</div>
                    )}
                    {fill && (
                        <div className='red pa2 br3 mb3 tc'>Please fill out all the details to register.</div>
                    )}
                </div>
            </main>
        </article>
    );
};

export default Register;